import { Remarkable } from "remarkable";
import type {
  Token,
  LinkOpenToken,
  BlockContentToken,
  TextToken,
  HeadingOpenToken,
  HeadingCloseToken,
} from "remarkable/lib";
import type { Link } from "./types";

const md = new Remarkable("default", {});

const isBlockContentToken = (token: Token): token is BlockContentToken => "children" in token;
const isLinkOpenToken = (token: Token): token is LinkOpenToken => token.type === "link_open";
const isTextToken = (token: Token): token is TextToken => token.type === "text";
const isHeadingOpenToken = (token: Token): token is HeadingOpenToken =>
  token.type === "heading_open";
const isHeadingCloseToken = (token: Token): token is HeadingCloseToken =>
  token.type === "heading_close";

export const parse = (text: string) => {
  const links: Link[] = [];
  const tokens = md.parse(text, {});
  let headers: { level: number; text: string }[] = [];
  let headerLevel = 0;
  let isHeaderOpen = false;

  tokens.forEach((token) => {
    if (isHeadingOpenToken(token)) {
      headers = headers.filter(({ level }) => level < token.hLevel);
      headerLevel = token.hLevel;
      isHeaderOpen = true;
    }
    if (isHeadingCloseToken(token)) isHeaderOpen = false;

    if (token.type !== "inline" || !isBlockContentToken(token)) return;
    if (!Array.isArray(token.children)) return;

    if (isHeaderOpen) {
      const header = token.children
        .filter(isTextToken)
        .map(({ content }) => content)
        .join("");
      if (header) headers.push({ level: headerLevel, text: header });
      return;
    }

    token.children.forEach((child, index) => {
      if (!isLinkOpenToken(child)) return;
      const url = child.href;
      let text: string = url;
      const nextChild = token.children![index + 1];
      if (isTextToken(nextChild) && nextChild.content) {
        text = nextChild.content;
      }
      links.push({ url, text, headers: headers.map(({ text }) => text) });
    });
  });

  return links;
};
