import type { Freshness, KbRecord } from "../../scripts/types";
import { FIELD_BOOST } from "./search";
import type { Kb } from "./kb";

export type Form = "note" | "gist" | "bare";
export type Bucket = "stale" | "emerging" | "old-fetched" | "unchecked";
export type View = KbRecord & { form: Form; fetchedAgeDays?: number; publishedAgeDays?: number };
export type Hit = View & { score: number; topics: string[] };
export type Lookup = { type: "one"; item: View } | { type: "many"; items: View[] } | { type: "none" };

export const BUCKETS: readonly Bucket[] = ["stale", "emerging", "old-fetched", "unchecked"];
export const OLD_FETCHED_DAYS = 180;
const DAY_MS = 86_400_000;

const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

const formOf = (record: KbRecord): Form => (record.kind === "note" ? "note" : record.gist ? "gist" : "bare");

const ageDays = ({ iso, now }: { iso?: string; now: Date }): number | undefined => {
  if (iso === undefined) return undefined;
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return undefined;
  return Math.max(0, Math.floor((now.getTime() - time) / DAY_MS));
};

const view = ({ record, now }: { record: KbRecord; now: Date }): View => ({
  ...record,
  form: formOf(record),
  fetchedAgeDays: ageDays({ iso: record.fetched, now }),
  publishedAgeDays: ageDays({ iso: record.published, now }),
});

const bucketOf = ({ record, now }: { record: KbRecord; now: Date }): Bucket | undefined => {
  if (record.status === undefined) return "unchecked";
  if (record.status === "stale" || record.status === "emerging") return record.status;
  const age = ageDays({ iso: record.fetched, now });
  if (record.fetched !== undefined && age === undefined) return "unchecked";
  return record.status === "fresh" && age !== undefined && age > OLD_FETCHED_DAYS ? "old-fetched" : undefined;
};

const normalizeTopic = (topic: string): string => topic.toLowerCase().replace(/^\/+|\/+$/g, "");

const inTopic = ({ topic, prefix }: { topic: string; prefix: string }): boolean =>
  topic === prefix || topic.startsWith(`${prefix}/`);

// Undated records sort last.
const byFetched = (a: KbRecord, b: KbRecord): number =>
  compare(a.fetched ?? "￿", b.fetched ?? "￿");

const boostOf = (record: KbRecord | undefined): number => {
  if (!record) return 1;
  return (record.kind === "note" ? 1.2 : 1) * (record.status === "stale" ? 0.7 : 1);
};

export interface SearchInput {
  kb: Kb;
  query: string;
  topic?: string;
  status?: Freshness;
  form?: Form;
  sort?: "relevance" | "fetched";
  limit?: number;
}

export const search = ({ kb, query, topic, status, form, sort = "relevance", limit = 10 }: SearchInput): Hit[] => {
  const now = kb.now();
  const prefix = topic === undefined ? undefined : normalizeTopic(topic);
  const keep = (record: KbRecord | undefined): boolean =>
    record !== undefined &&
    (prefix === undefined || inTopic({ topic: record.topic, prefix })) &&
    (status === undefined || record.status === status) &&
    (form === undefined || formOf(record) === form);
  const options = {
    prefix: true,
    fuzzy: 0.2,
    boost: FIELD_BOOST,
    boostDocument: (id: string) => boostOf(kb.byId.get(id)),
    filter: ({ id }: { id: string }) => keep(kb.byId.get(id)),
  };
  const andResults = kb.index.search(query, { ...options, combineWith: "AND" });
  const results = andResults.length > 0 ? andResults : kb.index.search(query, { ...options, combineWith: "OR" });

  const bestByUrl = new Map<string, Hit>();
  for (const { id, score } of results) {
    const record = kb.byId.get(id)!;
    if (bestByUrl.has(record.url)) continue;
    bestByUrl.set(record.url, {
      ...view({ record, now }),
      score,
      topics: kb.topicsByUrl.get(record.url) ?? [record.topic],
    });
  }

  const hits = [...bestByUrl.values()];
  if (sort === "fetched") hits.sort((a, b) => byFetched(a, b) || b.score - a.score || compare(a.id, b.id));
  else hits.sort((a, b) => b.score - a.score || compare(a.id, b.id));
  return hits.slice(0, limit);
};

export const getItem = ({ kb, ref }: { kb: Kb; ref: string }): Lookup => {
  const now = kb.now();
  const key = ref.trim();
  const byId = kb.byId.get(key);
  if (byId) return { type: "one", item: view({ record: byId, now }) };
  const title = key.toLowerCase();
  const matches = kb.records.filter((record) => record.url === key || record.title.toLowerCase() === title);
  if (matches.length === 0) return { type: "none" };
  if (matches.length === 1) return { type: "one", item: view({ record: matches[0]!, now }) };
  return { type: "many", items: matches.map((record) => view({ record, now })) };
};

// Every prefix of each topic, counting the records at or below it.
export const listTopics = ({ kb }: { kb: Kb }): { topic: string; count: number }[] => {
  const counts = new Map<string, number>();
  for (const { topic } of kb.records) {
    const segments = topic.split("/");
    segments.forEach((_, depth) => {
      const path = segments.slice(0, depth + 1).join("/");
      counts.set(path, (counts.get(path) ?? 0) + 1);
    });
  }
  return [...counts].map(([topic, count]) => ({ topic, count })).sort((a, b) => compare(a.topic, b.topic));
};

export const listLinks = ({ kb, topic, limit = 50 }: { kb: Kb; topic: string; limit?: number }): View[] => {
  const now = kb.now();
  const prefix = normalizeTopic(topic);
  return kb.records
    .filter((record) => inTopic({ topic: record.topic, prefix }))
    .sort((a, b) => compare(a.file, b.file) || (a.line ?? 0) - (b.line ?? 0))
    .slice(0, limit)
    .map((record) => view({ record, now }));
};

export const listByFreshness = ({ kb, bucket, limit = 50 }: { kb: Kb; bucket?: Bucket; limit?: number }): View[] => {
  const now = kb.now();
  return kb.records
    .flatMap((record) => {
      const found = bucketOf({ record, now });
      return found === undefined || (bucket !== undefined && found !== bucket) ? [] : [{ record, found }];
    })
    .sort(
      (a, b) =>
        BUCKETS.indexOf(a.found) - BUCKETS.indexOf(b.found) ||
        byFetched(a.record, b.record) ||
        compare(a.record.title, b.record.title) ||
        compare(a.record.id, b.record.id)
    )
    .slice(0, limit)
    .map(({ record }) => view({ record, now }));
};

// Title plus the two rarest tags, so a common tag such as `css` does not drown the query.
export const findRelated = ({ kb, id, limit = 5 }: { kb: Kb; id: string; limit?: number }): Hit[] => {
  const record = kb.byId.get(id);
  if (!record) return [];
  const frequency = new Map<string, number>();
  for (const { tags } of kb.records) for (const tag of tags) frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
  const rarest = [...new Set(record.tags)]
    .sort((a, b) => frequency.get(a)! - frequency.get(b)! || compare(a, b))
    .slice(0, 2);
  return search({ kb, query: [record.title, ...rarest].join(" "), limit: kb.records.length })
    .filter((hit) => hit.url !== record.url)
    .slice(0, limit);
};
