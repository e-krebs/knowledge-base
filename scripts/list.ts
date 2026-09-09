import { $, Glob } from "bun";
import { parse } from "./parse";
import type { Item } from "./types";

const clean = new RegExp(/(?:.\/)?(.*).md$/);

const fileNameToTag = (fileName: string): string[] =>
  clean
    .exec(fileName)![1]
    .replaceAll("_", "")
    .replaceAll(" ", "-")
    .replaceAll("\\", "/")
    .toLowerCase()
    .split("/");

export const mdFiles = async (): Promise<string[]> => {
  const glob = new Glob("**/*.md");

  return (await Array.fromAsync(glob.scan("."))).filter(
    (f) => !f.startsWith("node_modules") && !f.startsWith("README.md")
  );
};

export const list = async (): Promise<Item[]> => {
  const fileNames = await mdFiles();

  const urls = (
    await Promise.all(
      fileNames.map(
        async (fileName) =>
          await $`cat ${fileName}`
            .text()
            .then(parse)
            .then((links) =>
              links.map(
                ({ headers, line, ...link }): Item => ({
                  ...link,
                  tags: [...fileNameToTag(fileName), ...headers],
                })
              )
            )
      )
    )
  ).flatMap((x) => x);

  return urls;
};
