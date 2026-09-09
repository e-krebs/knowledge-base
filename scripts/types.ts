export interface Link {
  url: string;
  text: string;
  headers: string[];
}

export interface Item extends Omit<Link, "headers"> {
  tags: string[];
}
