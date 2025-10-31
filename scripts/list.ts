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

export const list = async (): Promise<Item[]> => {
  const glob = new Glob("**/*.md");

  const fileNames = (await Array.fromAsync(glob.scan("."))).filter(
    (f) => !f.startsWith("node_modules") && !f.startsWith("README.md")
  );

  const urls = (
    await Promise.all(
      fileNames.slice(0, 1).map(
        async (fileName) =>
          await $`cat ${fileName}`
            .text()
            .then(parse)
            .then((links) =>
              links.map(
                (link) =>
                  ({
                    ...link,
                    tags: [...fileNameToTag(fileName), link.header].filter((t) => t !== undefined),
                  } as Item)
              )
            )
      )
    )
  ).flatMap((x) => x);

  return urls;
};
