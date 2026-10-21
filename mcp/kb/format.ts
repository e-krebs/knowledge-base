import type { View } from "./query";

const DETAIL_CAP = 20000;

const oneLine = (text: string): string => text.replace(/\s+/g, " ").trim();
const ago = (days: number | undefined): string => (days === undefined ? "" : ` (${days} days ago)`);

export const summary = (item: View): string =>
  [item.id, item.title, item.url, item.status ?? "unchecked", item.fetched ?? "-", oneLine(item.gist ?? "")].join(
    " · "
  );

// The marker's own length depends on how much is cut, so the kept length is settled by iterating.
const capTotal = (text: string): { text: string; truncated: boolean } => {
  if (text.length <= DETAIL_CAP) return { text, truncated: false };
  let keep = DETAIL_CAP;
  for (;;) {
    const marker = `\n[truncated: ${text.length - keep} more characters]`;
    const next = DETAIL_CAP - marker.length;
    if (next === keep) return { text: `${text.slice(0, keep)}${marker}`, truncated: true };
    keep = next;
  }
};

export const detail = (item: View): { text: string; truncated: boolean } => {
  const meta = [
    `id: ${item.id}`,
    `title: ${item.title}`,
    `url: ${item.url}`,
    `kind: ${item.kind}, form: ${item.form}`,
    `topic: ${item.topic}`,
    `tags: ${item.tags.join(", ")}`,
    `headers: ${item.headers.join(" > ") || "-"}`,
    `status: ${item.status ?? "unchecked"}`,
    `fetched: ${item.fetched ?? "-"}${ago(item.fetchedAgeDays)}`,
    `published: ${item.published ?? "-"}${ago(item.publishedAgeDays)}`,
    `file: ${item.file}${item.line === undefined ? "" : `:${item.line}`}`,
  ];
  if (item.noteFile) meta.push(`note: ${item.noteFile}`);
  if (item.gist) meta.push(`gist: ${oneLine(item.gist)}`);
  if (item.gotchas) meta.push(`gotchas:\n${item.gotchas}`);
  const head = meta.join("\n");
  return capTotal(item.body === undefined ? head : `${head}\n---\n${item.body}`);
};
