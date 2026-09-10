import { $, Glob } from "bun";
import { parse } from "./parse";
import { frontmatter } from "./frontmatter";
import { urlShape } from "./checkUrl";
import type { Item, Link, Note, NoteKey } from "./types";

const clean = new RegExp(/(?:.\/)?(.*).md$/);

// Algolia caps a record at 10 KB on this plan, and a note is meant to stay far below it.
const MAX_CONTENT_BYTES = 8000;

const fileNameToTag = (fileName: string): string[] =>
  clean
    .exec(fileName)![1]
    .replaceAll("_", "")
    .replaceAll(" ", "-")
    .replaceAll("\\", "/")
    .toLowerCase()
    .split("/");

export const mdFiles = async (): Promise<string[]> => {
  const glob = new Glob("**/*.md");

  return (await Array.fromAsync(glob.scan("."))).filter(
    (f) => !f.startsWith("node_modules") && !f.startsWith("README.md")
  );
};

const shape = (url: string): string => {
  try {
    return urlShape(url);
  } catch {
    return url;
  }
};

const NOTES_FOLDER = "_notes";

const baseName = (file: string): string => file.split("/").at(-1)!.replace(/\.md$/, "");
const dirName = (file: string): string => file.split("/").slice(0, -1).join("/");
// A note's own folder is a filing detail, never a tag.
const pathTags = (file: string): string[] =>
  fileNameToTag(file.split("/").filter((segment) => segment !== NOTES_FOLDER).join("/"));

const content = ({ text, file }: { text: string; file: string }): string => {
  const bytes = new TextEncoder().encode(text);
  if (bytes.length <= MAX_CONTENT_BYTES) return text;
  console.warn(`${file}: content cut at ${MAX_CONTENT_BYTES} bytes`);
  return new TextDecoder().decode(bytes.slice(0, MAX_CONTENT_BYTES)).replace(/�$/, "");
};

// The file name is the title, as in Obsidian.
const readNote = ({
  file,
  data,
  body,
}: {
  file: string;
  data: Partial<Record<NoteKey, string>>;
  body: string;
}): Note => ({
  source: data.source!,
  title: baseName(file),
  body: body.trim(),
  status: data.status ?? "fresh",
  fetched: data.fetched ?? "",
  published: data.published,
  file,
});

const noteFields = (note: Note): Pick<Item, "type" | "note" | "status" | "content"> => ({
  type: "note",
  note: note.file,
  status: note.status,
  content: content({ text: note.body, file: note.file }),
});

// A `[[note]]` line resolves to the note in the link file's `_notes/` folder first, then its
// own folder, then any note of that name. A `[title](url)` line whose url is a note's source
// is enriched by that note. A note neither linked nor referenced becomes its own record.
export const list = async (): Promise<Item[]> => {
  const fileNames = await mdFiles();
  const notesBySource = new Map<string, Note>();
  const notesByFile = new Map<string, Note>();
  const links: { fileName: string; link: Link }[] = [];

  await Promise.all(
    fileNames.map(async (fileName) => {
      const { data, body } = frontmatter<NoteKey>(await $`cat ${fileName}`.text());
      if (data.source) {
        const note = readNote({ file: fileName, data, body });
        const key = shape(data.source);
        const twin = notesBySource.get(key);
        if (twin) console.warn(`${fileName}: same source as ${twin.file}, only one is indexed`);
        notesBySource.set(key, note);
        notesByFile.set(fileName, note);
        return;
      }
      parse(body).forEach((link) => links.push({ fileName, link }));
    })
  );

  const byBaseName = new Map([...notesByFile.values()].map((note) => [baseName(note.file), note]));
  const resolve = ({ fileName, name }: { fileName: string; name: string }): Note | undefined => {
    const dir = dirName(fileName);
    const at = (folder: string) => notesByFile.get(`${folder}/${name}.md`.replace(/^\//, ""));
    return at(`${dir}/${NOTES_FOLDER}`) ?? at(dir) ?? byBaseName.get(name);
  };

  const matched = new Set<Note>();
  const items = links.flatMap(({ fileName, link: { headers, line, gist, note: name, ...link } }): Item[] => {
    const tags = [...fileNameToTag(fileName), ...headers];
    if (name !== undefined) {
      const note = resolve({ fileName, name });
      if (!note) {
        console.warn(`${fileName}:${line}: [[${name}]] points at no note`);
        return [];
      }
      matched.add(note);
      return [{ url: note.source, text: note.title, tags, ...noteFields(note) }];
    }
    const note = notesBySource.get(shape(link.url));
    if (note) {
      matched.add(note);
      return [{ ...link, tags, ...noteFields(note) }];
    }
    return [gist ? { ...link, tags, content: gist } : { ...link, tags }];
  });

  const orphans = [...notesByFile.values()]
    .filter((note) => !matched.has(note))
    .map((note): Item => {
      const path = pathTags(note.file);
      return {
        url: note.source,
        text: note.title,
        tags: path.length > 1 ? path.slice(0, -1) : path,
        ...noteFields(note),
      };
    });

  return [...items, ...orphans];
};
