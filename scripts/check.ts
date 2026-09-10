import { $ } from "bun";
import { mdFiles } from "./list";
import { parse } from "./parse";
import { frontmatter } from "./frontmatter";
import { checkUrl, wayback, type Check } from "./checkUrl";
import type { NoteKey } from "./types";

interface Found {
  url: string;
  text: string;
  file: string;
  line: number;
}

type Result = Found & Check & { archived?: string };

const CONCURRENCY = 8;
const HOST_INTERVAL = 500;

const outPath = process.argv[2] ?? `${Bun.env.TMPDIR ?? "/tmp"}/dead-links.md`;

// A note is checked by its source alone: the links in its body are citations.
const found = (
  await Promise.all(
    (await mdFiles()).map(async (file): Promise<Found[]> => {
      const text = await $`cat ${file}`.text();
      const { data } = frontmatter<NoteKey>(text);
      if (data.source) {
        const at = text.split(/\r?\n/).findIndex((l) => l.trimStart().startsWith("source:"));
        return [{ url: data.source, text: file, file, line: at === -1 ? 1 : at + 1 }];
      }
      return parse(text).map(({ url, text, line }) => ({ url, text, file, line }));
    })
  )
).flat();

// Same URL in several files: check it once, report every place it appears.
const byUrl = new Map<string, Found[]>();
found.forEach((f) => byUrl.set(f.url, [...(byUrl.get(f.url) ?? []), f]));
const urls = [...byUrl.keys()].filter((url) => url.startsWith("http"));

const lastCallByHost = new Map<string, number>();
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// One request per host every HOST_INTERVAL, or the host rate-limits us into false deaths.
const spaceOut = async (url: string) => {
  const { hostname } = new URL(url);
  const wait = (lastCallByHost.get(hostname) ?? 0) + HOST_INTERVAL - Date.now();
  lastCallByHost.set(hostname, Date.now() + Math.max(wait, 0));
  if (wait > 0) await sleep(wait);
};

let cursor = 0;
const results: Result[] = [];

const worker = async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++]!;
    await spaceOut(url);
    const check = await checkUrl(url).catch((error) => ({
      verdict: "unverified" as const,
      detail: error instanceof Error ? error.message : String(error),
    }));
    byUrl.get(url)!.forEach((place) => results.push({ ...place, ...check }));
  }
};

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const section = ({ title, rows }: { title: string; rows: Result[] }): string => {
  const files = [...new Set(rows.map(({ file }) => file))].sort();
  const groups = files.map((file) => {
    const lines = rows
      .filter((r) => r.file === file)
      .sort((a, b) => a.line - b.line)
      .map(
        ({ text, url, line, detail, movedTo, archived }) =>
          `- [ ] line ${line}: [${text}](${url}) — ${detail}` +
          (movedTo ? `\n      now at ${movedTo}` : "") +
          (archived ? `\n      archived at ${archived}` : "")
      );
    return [`### ${file}`, ...lines].join("\n");
  });
  return [`## ${title} (${rows.length})`, "", ...groups].join("\n");
};

// One at a time: the archive rate-limits a burst, and every refusal loses a suggestion.
const dead = await results
  .filter(({ verdict }) => verdict === "dead")
  .reduce(
    async (chain, row) => [...(await chain), { ...row, archived: await wayback(row.url) }],
    Promise.resolve([] as Result[])
  );
const moved = results.filter(({ verdict }) => verdict === "moved");
const unverified = results.filter(({ verdict }) => verdict === "unverified");

const report =
  dead.length || moved.length
    ? [
        `Checked ${urls.length} links across ${new Set(found.map(({ file }) => file)).size} files.`,
        "",
        ...(dead.length ? [section({ title: "dead", rows: dead }), ""] : []),
        ...(moved.length ? [section({ title: "moved", rows: moved }), ""] : []),
        `${unverified.length} links could not be checked, usually a bot challenge or a rate limit. They are in the workflow log, not here, because a block proves nothing.`,
      ].join("\n")
    : "";

await Bun.write(outPath, report);

console.log(
  `checked ${urls.length} links: ${dead.length} dead, ${moved.length} moved, ${unverified.length} unverified`
);
console.log(`report: ${outPath}`);
if (unverified.length) {
  console.log("\nunverified:");
  console.log(
    unverified.map(({ file, line, url, detail }) => `  ${file}:${line} ${url} — ${detail}`).join("\n")
  );
}
