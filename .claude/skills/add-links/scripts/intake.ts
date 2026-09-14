import { $ } from "bun";
import { mdFiles } from "../../../../scripts/list";
import { parse } from "../../../../scripts/parse";
import { frontmatter } from "../../../../scripts/frontmatter";
import { urlShape } from "../../../../scripts/checkUrl";
import type { NoteKey } from "../../../../scripts/types";

interface Row {
  n: number;
  url: string;
  title: string;
  folder?: string;
  tags?: string;
  excerpt?: string;
  created?: string;
  from: string;
}

const [scratchArg, ...inputs] = Bun.argv.slice(2);
if (!scratchArg || inputs.length === 0) {
  console.log("usage: bun intake.ts <scratch-dir> <input>...  (a raindrop .csv, or a text file of urls / [title](url) lines)");
  process.exit(1);
}
const scratch = scratchArg.endsWith("/") ? scratchArg : `${scratchArg}/`;

// Tracking parameters make two copies of one page look different, so they go before the
// shape is compared and before the URL reaches the vault.
const TRACKING = /^(utm_.*|ref|ref_src|fbclid|gclid|mc_cid|mc_eid|si)$/;
const clean = (url: string): string => {
  try {
    const u = new URL(url);
    [...u.searchParams.keys()].filter((k) => TRACKING.test(k)).forEach((k) => u.searchParams.delete(k));
    return u.toString();
  } catch {
    return url;
  }
};

const shape = (url: string): string => {
  try {
    return urlShape(clean(url));
  } catch {
    return url;
  }
};

// RFC 4180: a quoted field may hold commas, newlines and doubled quotes.
const csv = (text: string): string[][] => {
  const rows: string[][] = [[]];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") rows.at(-1)!.push(field), (field = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      rows.at(-1)!.push(field), (field = ""), rows.push([]);
    } else field += c;
  }
  rows.at(-1)!.push(field);
  return rows.filter((r) => r.some((f) => f !== ""));
};

const fromCsv = (text: string, from: string): Omit<Row, "n">[] => {
  const [header, ...lines] = csv(text);
  const col = (name: string) => header!.findIndex((h) => h.trim().toLowerCase() === name);
  const at = (line: string[], name: string) => line[col(name)]?.trim() || undefined;
  if (col("url") === -1) throw new Error(`${from}: no url column in ${header!.join(",")}`);
  return lines.map((line) => ({
    url: at(line, "url") ?? "",
    title: at(line, "title") ?? "",
    folder: at(line, "folder"),
    tags: at(line, "tags"),
    excerpt: at(line, "excerpt") ?? at(line, "note"),
    created: at(line, "created")?.slice(0, 10),
    from,
  }));
};

const fromText = (text: string, from: string): Omit<Row, "n">[] =>
  text.split(/\r?\n/).flatMap((line) => {
    const md = line.match(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/);
    if (md) return [{ title: md[1]!.trim(), url: md[2]!, from }];
    const bare = line.match(/https?:\/\/\S+/);
    return bare ? [{ title: "", url: bare[0]!, from }] : [];
  });

const incoming = (
  await Promise.all(
    inputs.map(async (input) => {
      const text = await Bun.file(input).text();
      const from = input.split("/").at(-1)!;
      return input.endsWith(".csv") ? fromCsv(text, from) : fromText(text, from);
    })
  )
).flat();

// Where every URL already sits in the vault: a link line, or a note's source.
const held = new Map<string, string>();
const headings = new Map<string, string[]>();
await Promise.all(
  (await mdFiles()).map(async (file) => {
    const text = await $`cat ${file}`.text();
    const { data, body } = frontmatter<NoteKey>(text);
    if (data.source) {
      held.set(shape(data.source), file);
      return;
    }
    parse(body).forEach(({ url }) => url && held.set(shape(url), file));
    headings.set(file, text.split(/\r?\n/).filter((l) => /^#{1,6} /.test(l)));
  })
);

const seen = new Set<string>();
const rows: Row[] = [];
const dupes: string[] = [];
incoming.forEach((row) => {
  const key = shape(row.url);
  const where = held.get(key) ?? (seen.has(key) ? "this batch" : undefined);
  if (where) return void dupes.push(`${row.url} (${where})`);
  seen.add(key);
  rows.push({ n: rows.length + 1, ...row, url: clean(row.url) });
});

const targets = [...headings.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([file, hs]) => `- ${file}${hs.length ? `: ${hs.join(", ")}` : " (no heading)"}`)
  .join("\n");

await Bun.write(`${scratch}intake.json`, JSON.stringify(rows, null, 2) + "\n");
await Bun.write(`${scratch}targets.md`, `# link files and their headings\n\n${targets}\n`);

console.log(`${incoming.length} incoming, ${rows.length} new, ${dupes.length} already held → ${scratch}intake.json, targets.md (${headings.size} files)`);
if (dupes.length) console.log(`already held:\n  ${dupes.join("\n  ")}`);
