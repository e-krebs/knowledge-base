import { createHash } from "node:crypto";
import { $, Glob } from "bun";
import { parse } from "./parse";
import { frontmatter } from "./frontmatter";
import { urlShape } from "./checkUrl";
import type { Freshness, Item, KbRecord, Link, Note, NoteKey } from "./types";

export const VAULT_DIR = "vault";
export const vaultPath = (file: string): string => `${VAULT_DIR}/${file}`;

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

  return Array.fromAsync(glob.scan({ cwd: VAULT_DIR }));
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

const FRESHNESS: readonly string[] = ["fresh", "stale", "emerging"];
const isFreshness = (raw: string): raw is Freshness => FRESHNESS.includes(raw);

const freshnessOf = (raw: string): Freshness | undefined => {
  if (isFreshness(raw)) return raw;
  console.warn(`unknown status "${raw}", kept as rawStatus only`);
  return undefined;
};

const recordId = ({ file, url }: { file: string; url: string }): string =>
  createHash("sha1").update(file + shape(url)).digest("hex").slice(0, 12);

const firstParagraph = (body: string): string | undefined =>
  body.split(/\n\s*\n/)[0]!.trim() || undefined;

const gotchasOf = (body: string): string | undefined =>
  /^## gotchas[ \t]*\n([\s\S]*?)(?=^## |(?![\s\S]))/im.exec(body)?.[1]!.trim() || undefined;

const noteRecord = ({
  note,
  file,
  url,
  title,
  topic,
  tags,
  headers,
  line,
}: {
  note: Note;
  file: string;
  url: string;
  title: string;
  topic: string;
  tags: string[];
  headers: string[];
  line?: number;
}): KbRecord => ({
  id: recordId({ file, url }),
  kind: "note",
  url,
  title,
  topic,
  tags,
  headers,
  line,
  gist: firstParagraph(note.body),
  body: note.body,
  gotchas: gotchasOf(note.body),
  status: freshnessOf(note.status),
  rawStatus: note.status,
  fetched: note.fetched || undefined,
  published: note.published,
  file,
  noteFile: note.file,
});

const toItem = (record: KbRecord): Item =>
  record.kind === "note"
    ? {
        url: record.url,
        text: record.title,
        tags: record.tags,
        type: "note",
        note: record.noteFile,
        status: record.rawStatus,
        content: content({ text: record.body!, file: record.noteFile! }),
      }
    : {
        url: record.url,
        text: record.title,
        tags: record.tags,
        ...(record.gist ? { content: record.gist } : {}),
      };

// A `[[note]]` line resolves to the note in the link file's `_notes/` folder first, then its
// own folder, then any note of that name. A `[title](url)` line whose url is a note's source
// is enriched by that note. A note neither linked nor referenced becomes its own record.
export const records = async (): Promise<KbRecord[]> => {
  const fileNames = await mdFiles();
  const notesBySource = new Map<string, Note>();
  const notesByFile = new Map<string, Note>();
  const links: { fileName: string; link: Link }[] = [];

  await Promise.all(
    fileNames.map(async (fileName) => {
      const { data, body } = frontmatter<NoteKey>(await $`cat ${vaultPath(fileName)}`.text());
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
  const items = links.flatMap(({ fileName, link: { headers, line, gist, note: name, ...link } }): KbRecord[] => {
    const tags = [...fileNameToTag(fileName), ...headers];
    const topic = pathTags(fileName).join("/");
    if (name !== undefined) {
      const note = resolve({ fileName, name });
      if (!note) {
        console.warn(`${fileName}:${line}: [[${name}]] points at no note`);
        return [];
      }
      matched.add(note);
      return [noteRecord({ note, file: fileName, url: note.source, title: note.title, topic, tags, headers, line })];
    }
    const note = notesBySource.get(shape(link.url));
    if (note) {
      matched.add(note);
      return [noteRecord({ note, file: fileName, url: link.url, title: link.text, topic, tags, headers, line })];
    }
    return [
      {
        id: recordId({ file: fileName, url: link.url }),
        kind: "link",
        url: link.url,
        title: link.text,
        topic,
        tags,
        headers,
        gist,
        file: fileName,
        line,
      },
    ];
  });

  const orphans = [...notesByFile.values()]
    .filter((note) => !matched.has(note))
    .map((note): KbRecord => {
      const path = pathTags(note.file);
      return noteRecord({
        note,
        file: note.file,
        url: note.source,
        title: note.title,
        topic: path.slice(0, -1).join("/"),
        tags: path.length > 1 ? path.slice(0, -1) : path,
        headers: [],
      });
    });

  return [...items, ...orphans];
};

export const list = async (): Promise<Item[]> => (await records()).map(toItem);
