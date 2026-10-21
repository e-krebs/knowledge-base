export interface Link {
  url: string;
  text: string;
  headers: string[];
  line: number;
  gist?: string;
  note?: string;
}

export type NoteKey = "source" | "fetched" | "published" | "status";

export interface Note {
  source: string;
  title: string;
  body: string;
  status: string;
  fetched: string;
  published?: string;
  file: string;
}

export interface Item extends Omit<Link, "headers" | "line" | "gist"> {
  tags: string[];
  type?: "note";
  content?: string;
  note?: string;
  status?: string;
}

export type Freshness = "fresh" | "stale" | "emerging";

export interface KbRecord {
  id: string;
  kind: "note" | "link";
  url: string;
  title: string;
  topic: string;
  tags: string[];
  headers: string[];
  gist?: string;
  body?: string;
  gotchas?: string;
  status?: Freshness;
  rawStatus?: string;
  fetched?: string;
  published?: string;
  file: string;
  line?: number;
  noteFile?: string;
}
