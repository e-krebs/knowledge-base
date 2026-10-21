import MiniSearch from "minisearch";
import type { KbRecord } from "../../scripts/types";

export interface Doc {
  id: string;
  title: string;
  tags: string;
  gist: string;
  body: string;
}

export const FIELD_BOOST = { title: 3, tags: 2, gist: 1.5, body: 1 } as const;

const toDoc = (record: KbRecord): Doc => ({
  id: record.id,
  title: record.title,
  tags: record.tags.join(" "),
  gist: record.gist ?? "",
  body: record.body ?? "",
});

export const buildIndex = (records: KbRecord[]): MiniSearch<Doc> => {
  const index = new MiniSearch<Doc>({ idField: "id", fields: ["title", "tags", "gist", "body"] });
  index.addAll(records.map(toDoc));
  return index;
};
