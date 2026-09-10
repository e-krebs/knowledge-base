import { Glob } from "bun";

const files = Bun.argv.slice(2);
if (files.length === 0) {
  console.log("usage: bun wikilinks.ts <vault-file>...");
  process.exit(1);
}

const WIKILINK = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;

const dirName = (file: string): string => file.split("/").slice(0, -1).join("/");

let anyUnresolved = false;

for (const file of files) {
  const text = await Bun.file(file).text();
  const names = [...text.matchAll(WIKILINK)].map((m) => m[1]!.trim());
  const dir = dirName(file);

  const unresolved: string[] = [];
  for (const name of names) {
    const local = dir ? `${dir}/${name}.md` : `${name}.md`;
    if (await Bun.file(local).exists()) continue;
    const hit = await new Glob(`**/${name}.md`).scan(".").next();
    if (!hit.done) continue;
    unresolved.push(name);
  }

  console.log(`${file}: ${names.length} wikilinks, ${unresolved.length} unresolved [${unresolved.join(", ")}]`);
  if (unresolved.length) anyUnresolved = true;
}

if (anyUnresolved) process.exit(1);
