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
const hasContent = (token: Token): token is TextToken =>
  isTextToken(token) || token.type === "code";

// The text after a link, on its line, when it opens with the ` — ` delimiter. Obsidian
// wikilinks come through remarkable as plain text, so they are stripped here.
const gistOf = ({ children, index }: { children: Token[]; index: number }): string | undefined => {
  const close = children.findIndex((child, i) => i > index && child.type === "link_close");
  if (close === -1) return undefined;
  const trailing = children.slice(close + 1);
  const stop = trailing.findIndex(({ type }) => ["softbreak", "hardbreak", "link_open"].includes(type));
  const after = (stop === -1 ? trailing : trailing.slice(0, stop))
    .filter(hasContent)
    .map(({ content }) => content)
    .join("")
    .replace(/\[\[[^\]]*\]\]/g, "")
    .trim();
  if (!after.startsWith("—")) return undefined;
  return after.slice(1).trim() || undefined;
};

const WIKILINK = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;

// An Obsidian `[[note]]` reaches remarkable as plain text, split over several text tokens,
// so each line's text is joined before the match. The record it yields has no url of its
// own: list.ts resolves it to the note's source.
const wikilinksOf = ({
  children,
  headers,
  firstLine,
}: {
  children: Token[];
  headers: string[];
  firstLine: number;
}): Link[] => {
  const links: Link[] = [];
  let offset = 0;
  let buffer = "";
  const flush = () => {
    [...buffer.matchAll(WIKILINK)].forEach((match) => {
      const note = match[1]!.trim();
      links.push({ url: "", text: note, headers, line: firstLine + offset, note });
    });
    buffer = "";
  };
  children.forEach((child) => {
    if (child.type === "softbreak" || child.type === "hardbreak") {
      flush();
      offset += 1;
      return;
    }
    if (isTextToken(child)) buffer += child.content;
  });
  flush();
  return links;
};

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

    const children = token.children;
    children.forEach((child, index) => {
      if (!isLinkOpenToken(child)) return;
      const url = child.href;
      let text: string = url;
      const nextChild = children[index + 1];
      if (isTextToken(nextChild) && nextChild.content) {
        text = nextChild.content;
      }
      const softbreaks = children.slice(0, index).filter(({ type }) => type === "softbreak").length;
      const gist = gistOf({ children, index });
      links.push({
        url,
        text,
        headers: headers.map(({ text }) => text),
        line: (token.lines?.[0] ?? 0) + softbreaks + 1,
        ...(gist ? { gist } : {}),
      });
    });
    links.push(
      ...wikilinksOf({
        children,
        headers: headers.map(({ text }) => text),
        firstLine: (token.lines?.[0] ?? 0) + 1,
      })
    );
  });

  return links;
};
