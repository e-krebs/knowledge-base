export interface Link {
  url: string;
  text: string;
}

export interface Item extends Link {
  tags: string[];
}
