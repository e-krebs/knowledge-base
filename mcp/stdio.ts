import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { records } from "../scripts/list";
import { createKb } from "./kb/kb";
import { createServer } from "./server";
import { fileSink, usagePath } from "./usage/file-sink";

const clientCwd = process.cwd();
const sink = fileSink({ path: usagePath() });
process.chdir(resolve(import.meta.dir, ".."));

const kb = createKb({ records: await records(), now: () => new Date() });
const serverSession = randomUUID();

console.error(`knowledge-base: ${kb.records.length} records`);
serveStdio(() => createServer({ kb, sink, serverSession, clientCwd }));
