import { Remarkable } from "remarkable";
import type { Token, LinkOpenToken, BlockContentToken, TextToken } from "remarkable/lib";
import type { Link } from "./types";

const md = new Remarkable("default", {});

const isBlockContentToken = (token: Token): token is BlockContentToken => "children" in token;
const isLinkOpenToken = (token: Token): token is LinkOpenToken => token.type === "link_open";
const isTextToken = (token: Token): token is TextToken => token.type === "text";

export const parse = (text: string) => {
  const links: Link[] = [];
  const tokens = md.parse(text, {});

  tokens.forEach((token) => {
    if (token.type !== "inline" || !isBlockContentToken(token)) return;
    if (!Array.isArray(token.children)) return;
    token.children.forEach((child, index) => {
      if (isLinkOpenToken(child)) {
        const url = child.href;
        let text: string = url;
        const nextChild = token.children![index + 1];
        if (isTextToken(nextChild) && nextChild.content) {
          text = nextChild.content;
        }
        links.push({ url, text });
      }
    });
  });

  return links;
};
