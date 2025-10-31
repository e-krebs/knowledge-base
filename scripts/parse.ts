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
  let header: string | undefined = undefined;
  let isHeaderOpen = false;

  tokens.forEach((token) => {
    if (isHeadingOpenToken(token)) isHeaderOpen = true;
    if (isHeadingCloseToken(token)) isHeaderOpen = false;

    if (token.type !== "inline" || !isBlockContentToken(token)) return;
    if (!Array.isArray(token.children)) return;
    token.children.forEach((child, index) => {
      if (isHeaderOpen && isTextToken(child)) {
        header = child.content;
      } else if (isLinkOpenToken(child)) {
        const url = child.href;
        let text: string = url;
        const nextChild = token.children![index + 1];
        if (isTextToken(nextChild) && nextChild.content) {
          text = nextChild.content;
        }
        links.push({ url, text, header });
      }
    });
  });

  return links;
};
