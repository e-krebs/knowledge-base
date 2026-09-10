export {};

type Entry = number | { note: string };

interface CrossFile {
  n: number;
  file: string;
  heading: string;
  folder: string;
}

interface Layout {
  file: string;
  notesFolder: string;
  layout: [string, Entry[]][];
  crossFile: CrossFile[];
  removed: number[];
}

interface Row {
  n: number;
  title: string;
  url: string;
  verdict: string;
}

interface Gist {
  n: number;
  gist: string | null;
}

const [scratchArg, layoutPath, flag] = Bun.argv.slice(2);
if (!scratchArg || !layoutPath) {
  console.log("usage: bun apply.ts <scratch-dir> <layout.json> [--write]");
  process.exit(1);
}

const scratch = scratchArg.endsWith("/") ? scratchArg : `${scratchArg}/`;
const vault = process.cwd().endsWith("/") ? process.cwd() : `${process.cwd()}/`;

const { file, notesFolder, layout, crossFile, removed }: Layout = JSON.parse(await Bun.file(layoutPath).text());
const FILE = `${vault}${file}`;

const rows: Row[] = JSON.parse(await Bun.file(`${scratch}classify.json`).text());
const gists: Gist[] = JSON.parse(await Bun.file(`${scratch}gists.json`).text());
const byN = new Map(rows.map((r) => [r.n, r]));
const gistByN = new Map(gists.map(({ n, gist }) => [n, gist]));

const sanitize = (title: string) => title.replace(/[/\\:*?"<>|]/g, "-");

const noteLine = (title: string) => {
  const f = sanitize(title);
  return `📝 [[${f === title ? f : `${f}|${title}`}]]`;
};

const lineFor = (entry: Entry): string => {
  if (typeof entry !== "number") return noteLine(entry.note);
  const row = byN.get(entry);
  if (!row) throw new Error(`no row ${entry}`);
  if (row.verdict === "extract") return noteLine(row.title);
  const gist = gistByN.get(entry);
  if (!gist) throw new Error(`no gist for ${entry} (${row.title})`);
  if (gist.includes("—")) throw new Error(`em dash in gist ${entry}`);
  return `[${row.title}](${row.url}) — ${gist}`;
};

// Every row lands exactly once: in the layout, in a cross-file move, or in the removed list.
const placed = [...layout.flatMap(([, e]) => e.filter((x): x is number => typeof x === "number")), ...crossFile.map((c) => c.n), ...removed];
const missing = rows.filter((r) => !placed.includes(r.n)).map((r) => r.n);
const twice = placed.filter((n, i) => placed.indexOf(n) !== i);
if (missing.length || twice.length) throw new Error(`missing ${missing}, twice ${twice}`);

// Notes: every extract row needs its file in <scratch>/notes, and lands in the folder of its link file.
const extracts = rows.filter((r) => r.verdict === "extract" && !removed.includes(r.n));
const copies = extracts.map((r) => {
  const name = `${sanitize(r.title)}.md`;
  const folder = crossFile.find((c) => c.n === r.n)?.folder ?? notesFolder;
  return { from: `${scratch}notes/${name}`, to: `${vault}${folder}${name}`, folder };
});
const absent = (await Promise.all(copies.map((c) => Bun.file(c.from).exists()))).map((ok, i) => (ok ? null : copies[i]!.from)).filter(Boolean);
if (absent.length) throw new Error(`notes missing:\n${absent.join("\n")}`);

const body = layout.map(([heading, entries]) => [heading, ...entries.map(lineFor)].join("\n")).join("\n\n") + "\n";

if (flag !== "--write") {
  process.stdout.write(body);
  console.error(`${extracts.length} notes, ${copies.filter((c) => c.folder !== notesFolder).length} outside ${notesFolder}`);
  process.exit(0);
}

await Promise.all(copies.map(async (c) => Bun.write(c.to, await Bun.file(c.from).text())));
await Bun.write(FILE, body);

// Cross-file: append under the named heading, before the next heading or the end.
for (const move of crossFile) {
  const path = `${vault}${move.file}`;
  const text = await Bun.file(path).text();
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.trim() === move.heading);
  if (start === -1) throw new Error(`${move.file}: no ${move.heading}`);
  let end = lines.findIndex((l, i) => i > start && l.startsWith("#"));
  if (end === -1) end = lines.length;
  while (end > start + 1 && lines[end - 1]!.trim() === "") end -= 1;
  lines.splice(end, 0, lineFor(move.n));
  await Bun.write(path, lines.join("\n"));
}
console.log("written");
