import type { KbRecord } from "../../scripts/types";
import { buildIndex, type Doc } from "./search";
import type MiniSearch from "minisearch";

export type Clock = () => Date;

export interface Kb {
  records: KbRecord[];
  byId: Map<string, KbRecord>;
  topicsByUrl: Map<string, string[]>;
  index: MiniSearch<Doc>;
  now: Clock;
}

const describe = (record: KbRecord): string => `${record.file}:${record.line ?? "-"} "${record.title}"`;

export const createKb = ({ records, now }: { records: KbRecord[]; now: Clock }): Kb => {
  const byId = new Map<string, KbRecord>();
  const topicSets = new Map<string, Set<string>>();
  for (const record of records) {
    const twin = byId.get(record.id);
    if (twin) throw new Error(`duplicate record id ${record.id}: ${describe(twin)} and ${describe(record)}`);
    byId.set(record.id, record);
    topicSets.set(record.url, (topicSets.get(record.url) ?? new Set()).add(record.topic));
  }
  const topicsByUrl = new Map([...topicSets].map(([url, topics]) => [url, [...topics].sort()]));
  return { records, byId, topicsByUrl, index: buildIndex(records), now };
};

const SNAPSHOT_VERSION = 1;

export const toSnapshot = (kb: Kb): string => JSON.stringify({ version: SNAPSHOT_VERSION, records: kb.records });

export const fromSnapshot = ({ snapshot, now }: { snapshot: string; now: Clock }): Kb => {
  const parsed = JSON.parse(snapshot) as { version: number; records: KbRecord[] };
  if (parsed.version !== SNAPSHOT_VERSION) throw new Error(`unsupported snapshot version ${parsed.version}`);
  return createKb({ records: parsed.records, now });
};
