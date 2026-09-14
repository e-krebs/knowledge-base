export {};

interface Row {
  n: number;
  title: string;
  url: string;
  verdict: string;
  file: string;
  heading: string;
}

interface Gist {
  n: number;
  gist: string | null;
}

const [scratchArg, flag] = Bun.argv.slice(2);
if (!scratchArg) {
  console.log("usage: bun add.ts <scratch-dir> [--write]");
  process.exit(1);
}
const scratch = scratchArg.endsWith("/") ? scratchArg : `${scratchArg}/`;
const write = flag === "--write";

const rows: Row[] = JSON.parse(await Bun.file(`${scratch}classify.json`).text());
const gists: Gist[] = JSON.parse(await Bun.file(`${scratch}gists.json`).text());
const gistByN = new Map(gists.map(({ n, gist }) => [n, gist]));

const kept = rows.filter((r) => r.verdict !== "remove");
const bad = kept.filter((r) => typeof r.n !== "number" || !r.file?.endsWith(".md") || typeof r.heading !== "string" || /^new: /.test(r.heading));
if (bad.length) throw new Error(`rows need a numeric n, a .md file and a settled heading: ${bad.map((r) => r.n).join(", ")}`);

const sanitize = (title: string) => title.replace(/[/\\:*?"<>|]/g, "-");
const dirName = (file: string) => file.split("/").slice(0, -1).join("/");
const notesFolder = (file: string) => `${dirName(file) ? `${dirName(file)}/` : ""}_notes/`;

const noteLine = (title: string) => {
  const f = sanitize(title);
  return `📝 [[${f === title ? f : `${f}|${title}`}]]`;
};

const lineFor = (row: Row): string => {
  if (row.verdict === "extract") return noteLine(row.title);
  const gist = gistByN.get(row.n);
  if (!gist) throw new Error(`no gist for ${row.n} (${row.title})`);
  if (gist.includes("—")) throw new Error(`em dash in gist ${row.n}`);
  return `[${row.title}](${row.url}) — ${gist}`;
};

// A note lands in the _notes folder next to its link file, and never over an existing one.
const notes = await Promise.all(
  kept
    .filter((r) => r.verdict === "extract")
    .map(async (r) => {
      const name = `${sanitize(r.title)}.md`;
      const from = `${scratch}notes/${name}`;
      const to = `${notesFolder(r.file)}${name}`;
      if (!(await Bun.file(from).exists())) throw new Error(`note missing: ${from}`);
      if (await Bun.file(to).exists()) throw new Error(`note exists already: ${to}`);
      return { from, to };
    })
);

// Insert lines under a heading, before the next heading; a missing heading is appended at
// the end, and the untitled block ("") sits before the first heading.
const place = ({ lines, heading, added }: { lines: string[]; heading: string; added: string[] }): string[] => {
  const trimEnd = (end: number, start: number) => {
    while (end > start && lines[end - 1]!.trim() === "") end -= 1;
    return end;
  };
  const isHeading = (l: string) => /^#{1,6} /.test(l);
  if (heading === "") {
    const first = lines.findIndex(isHeading);
    const end = trimEnd(first === -1 ? lines.length : first, 0);
    return [...lines.slice(0, end), ...added, ...lines.slice(end)];
  }
  const start = lines.findIndex((l) => l.trim() === heading);
  if (start === -1) {
    const end = trimEnd(lines.length, 0);
    return [...lines.slice(0, end), ...(end ? [""] : []), heading, ...added];
  }
  const next = lines.findIndex((l, i) => i > start && isHeading(l));
  const end = trimEnd(next === -1 ? lines.length : next, start + 1);
  return [...lines.slice(0, end), ...added, ...lines.slice(end)];
};

const files = [...new Set(kept.map((r) => r.file))].sort();
const plan = await Promise.all(
  files.map(async (file) => {
    const exists = await Bun.file(file).exists();
    let lines = exists ? (await Bun.file(file).text()).replace(/\n+$/, "").split("\n") : [];
    if (!exists) lines = [];
    const headings = [...new Set(kept.filter((r) => r.file === file).map((r) => r.heading))];
    const report: string[] = [`${file}${exists ? "" : " (new file)"}`];
    headings.forEach((heading) => {
      const added = kept.filter((r) => r.file === file && r.heading === heading).map(lineFor);
      const known = heading === "" || lines.some((l) => l.trim() === heading);
      report.push(`  ${heading || "(untitled block)"}${known ? "" : " (new heading)"}`, ...added.map((l) => `    ${l}`));
      lines = place({ lines, heading, added });
    });
    return { file, text: lines.join("\n") + "\n", report };
  })
);

console.log(plan.map((p) => p.report.join("\n")).join("\n"));
console.log(`${kept.length} lines into ${files.length} files, ${notes.length} notes, ${rows.length - kept.length} removed`);
if (!write) process.exit(0);

await Promise.all(notes.map(async (n) => Bun.write(n.to, await Bun.file(n.from).text())));
await Promise.all(plan.map((p) => Bun.write(p.file, p.text)));
console.log(`written: ${files.join(" ")}`);
