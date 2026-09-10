import { Glob } from "bun";

interface Row {
  n: number;
  heading: string;
  title: string;
  url: string;
  verdict: string;
  fresh: string;
  published: string;
  size: string;
  reason: string;
}

interface Fresh {
  n: number;
  verdict: string;
  evidence: string;
  evidence_url: string;
  published: string | null;
  replacement: string | null;
}

interface Extra {
  note: string;
  heading: string;
}

const [scratchArg, vaultFile] = Bun.argv.slice(2);
if (!scratchArg || !vaultFile) {
  console.log("usage: bun review.ts <scratch-dir> <vault-file>");
  process.exit(1);
}

const scratch = scratchArg.endsWith("/") ? scratchArg : `${scratchArg}/`;

const rows: Row[] = JSON.parse(await Bun.file(`${scratch}classify.json`).text());

const freshnessNames = (await Array.fromAsync(new Glob("freshness-*.json").scan({ cwd: scratch }))).sort();
const fresh: Fresh[] = (
  await Promise.all(freshnessNames.map((name) => Bun.file(`${scratch}${name}`).text()))
).flatMap((text) => JSON.parse(text));
const freshByN = new Map(fresh.map((f) => [f.n, f]));

const extrasFile = Bun.file(`${scratch}extras.json`);
const extras: Extra[] = (await extrasFile.exists()) ? JSON.parse(await extrasFile.text()) : [];

const cell = (s: string | null | undefined) => (s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const action: Record<string, string> = { extract: "📝 note", "link + gist": "link — gist", link: "link — gist" };

const freshness = (row: Row) => {
  const f = freshByN.get(row.n);
  if (!f) return row.verdict === "extract" ? "not checked" : "not checked (link)";
  return f.verdict === "fresh" ? "fresh ✓" : `**${f.verdict}**: ${cell(f.evidence)}`;
};

const headings = [...new Set(rows.map((r) => r.heading))];
const sections = headings.map((h) => {
  const lines = rows
    .filter((r) => r.heading === h)
    .map(
      (r) =>
        `| ${String(r.n).padStart(2, "0")} | [${cell(r.title)}](${r.url}) | ${action[r.verdict]} | ${freshness(r)} | ${cell(r.published || freshByN.get(r.n)?.published)} | ${cell(r.reason)} |`
    );
  return [`## ${h}`, "", "| # | link | becomes | live freshness check | published | classifier reason |", "| --- | --- | --- | --- | --- | --- |", ...lines].join("\n");
});

const flagged = fresh.filter((f) => f.verdict !== "fresh");
const counts = rows.reduce((acc, r) => ({ ...acc, [r.verdict]: (acc[r.verdict] ?? 0) + 1 }), {} as Record<string, number>);

// Joins ["a"] -> "a", ["a", "b"] -> "a and b", ["a", "b", "c"] -> "a, b and c".
const englishList = (items: string[]): string =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

const extrasBlock: string[] =
  extras.length === 0
    ? []
    : [
        "",
        `Also in this pass: the existing prose file${extras.length > 1 ? "s" : ""} ${englishList(
          extras.map((e) => `\`${e.note}.md\` (linked under \`${e.heading}\`)`)
        )} ${extras.length > 1 ? "are" : "is"} converted to the note schema.`,
      ];

const doc = [
  `# ${vaultFile} — extraction review`,
  "",
  `${rows.length} links: ${counts["extract"] ?? 0} become notes, ${(counts["link"] ?? 0) + (counts["link + gist"] ?? 0)} stay links with a one-line gist. ` +
    `The live freshness check (web search per technique, Baseline status from MDN or caniuse) covered the ${fresh.length} notes and flagged gists; a plain link is not checked.`,
  ...extrasBlock,
  "",
  "## flagged by the live check",
  "",
  "| # | link | verdict | evidence | replacement | proposed handling |",
  "| --- | --- | --- | --- | --- | --- |",
  ...flagged.map((f) => {
    const r = rows.find((x) => x.n === f.n)!;
    const handling =
      f.verdict === "superseded"
        ? "you decide: gist saying `superseded by …`, or remove the line"
        : r.verdict === "extract"
          ? "note keeps the technique and names the successor in `## gotchas`"
          : "gist names the successor and its support status";
    return `| ${String(f.n).padStart(2, "0")} | [${cell(r.title)}](${r.url}) | **${f.verdict}** | ${cell(f.evidence)} ([source](${f.evidence_url})) | ${cell(f.replacement) || "—"} | ${handling} |`;
  }),
  "",
  ...sections.flatMap((s) => [s, ""]),
  "## how to answer",
  "",
  "Reply with row numbers and the change: `12 → link`, `20 → note`, `17 → remove`. Anything not named is applied as shown.",
].join("\n");

await Bun.write(`${scratch}review.md`, doc);
console.log(`${rows.length} rows, ${flagged.length} flagged → ${scratch}review.md`);
