export interface Link {
  url: string;
  text: string;
  header?: string;
}

export interface Item extends Omit<Link, "header"> {
  tags: string[];
}
