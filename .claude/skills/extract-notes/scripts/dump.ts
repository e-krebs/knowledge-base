import { list } from "../../../../scripts/list";

type Item = Awaited<ReturnType<typeof list>>[number];

const [outPath, beforePath] = Bun.argv.slice(2);
if (!outPath) {
  console.log("usage: bun dump.ts <out.json> [<before.json>]");
  process.exit(1);
}

const lastTag = (item: Item): string | undefined => item.tags.at(-1);
const bytesOf = (item: Item): number => new TextEncoder().encode(JSON.stringify(item)).length;

const items = await list();
const sorted = [...items].sort((a, b) => a.url.localeCompare(b.url) || a.tags.join("/").localeCompare(b.tags.join("/")));

await Bun.write(outPath, JSON.stringify(sorted, null, 2));
console.log(`${sorted.length} records`);

if (!beforePath) process.exit(0);

const before: Item[] = JSON.parse(await Bun.file(beforePath).text());
// The same URL can sit in two files, so a record is keyed by its url and its file path tags.
const key = (i: { url: string; tags: string[] }) => `${i.url}|${i.tags.slice(0, 3).join("/")}`;
const beforeByUrl = new Map(before.map((i) => [key(i), i]));
const afterByUrl = new Map(sorted.map((i) => [key(i), i]));

const urlsLost = before.filter((i) => !afterByUrl.has(key(i))).map((i) => i.url);
const urlsAdded = sorted.filter((i) => !beforeByUrl.has(key(i))).map((i) => i.url);

const tagsChanged = sorted.flatMap((item) => {
  const prev = beforeByUrl.get(key(item));
  if (!prev) return [];
  const from = lastTag(prev);
  const to = lastTag(item);
  if (from === to) return [];
  return [`${item.text}: ${from} → ${to}`];
});

const largest = sorted.reduce<{ text: string; url: string; bytes: number } | undefined>((max, item) => {
  const bytes = bytesOf(item);
  return !max || bytes > max.bytes ? { text: item.text, url: item.url, bytes } : max;
}, undefined);

const missingUrlOrTags = sorted.filter((item) => !item.url || !item.tags || item.tags.length === 0).map((item) => item.text);

console.log(
  JSON.stringify(
    {
      before: before.length,
      after: sorted.length,
      urlsLost,
      urlsAdded,
      tagsChanged,
      notes: sorted.filter((i) => i.type === "note").length,
      stale: sorted.filter((i) => i.status === "stale").length,
      largest,
      missingUrlOrTags,
    },
    null,
    2
  )
);
