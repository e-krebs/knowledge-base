export interface Frontmatter<K extends string> {
  data: Partial<Record<K, string>>;
  body: string;
}

// Flat `key: value` lines only, which is all a note carries.
export const frontmatter = <K extends string>(text: string): Frontmatter<K> => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { data: {}, body: text };

  const data: Partial<Record<string, string>> = {};
  match[1]!.split(/\r?\n/).forEach((line) => {
    const colon = line.indexOf(":");
    if (colon === -1) return;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^(["'])(.*)\1$/, "$2");
    if (key && value) data[key] = value;
  });

  return { data, body: text.slice(match[0].length) };
};
