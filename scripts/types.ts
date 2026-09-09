export interface Link {
  url: string;
  text: string;
  headers: string[];
  line: number;
}

export interface Item extends Omit<Link, "headers" | "line"> {
  tags: string[];
}
