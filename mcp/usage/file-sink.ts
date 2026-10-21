import { appendFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { nullSink, type UsageSink } from "./log";

export const usagePath = (env: Record<string, string | undefined> = process.env): string | undefined => {
  const override = env["KB_MCP_LOG"];
  if (override === "off") return undefined;
  if (override !== undefined) return resolve(override);
  return join(homedir(), ".local", "state", "knowledge-base-mcp", "usage.jsonl");
};

export const fileSink = ({ path }: { path: string | undefined }): UsageSink => {
  if (path === undefined) return nullSink;
  try {
    mkdirSync(dirname(path), { recursive: true });
  } catch (error) {
    console.error(`usage log disabled: ${(error as Error).message}`);
    return nullSink;
  }
  return {
    write(event) {
      try {
        appendFileSync(path, `${JSON.stringify(event)}\n`);
      } catch (error) {
        console.error(`usage log write failed: ${(error as Error).message}`);
      }
    },
  };
};
