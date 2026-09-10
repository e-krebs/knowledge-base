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
