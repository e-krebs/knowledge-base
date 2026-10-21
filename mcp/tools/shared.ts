import type { z } from "zod";
import type { Kb } from "../kb/kb";

export const TEXT_CAP = 8000;
const MARKER_RESERVE = 80;

export interface Outcome {
  text: string;
  isError?: boolean;
  resultCount: number;
  topIds: string[];
  truncated: boolean;
}

export interface ToolSpec<S extends z.ZodObject> {
  name: string;
  description: string;
  inputSchema: S;
}

export interface ToolHost {
  register<S extends z.ZodObject>(spec: ToolSpec<S>, handler: (args: z.infer<S>) => Outcome | Promise<Outcome>): void;
}

export interface ToolDeps {
  server: ToolHost;
  kb: Kb;
}

export const fitLines = (lines: string[]): { text: string; truncated: boolean } => {
  const kept: string[] = [];
  let size = 0;
  for (const line of lines) {
    if (size + line.length + 1 > TEXT_CAP - MARKER_RESERVE) break;
    kept.push(line);
    size += line.length + 1;
  }
  if (kept.length === lines.length) return { text: kept.join("\n"), truncated: false };
  const more = lines.length - kept.length;
  return { text: [...kept, `… ${more} more, narrow the query`].join("\n"), truncated: true };
};

export const listOutcome = ({ lines, ids, empty }: { lines: string[]; ids: string[]; empty: string }): Outcome => {
  if (lines.length === 0) return { text: empty, resultCount: 0, topIds: [], truncated: false };
  const { text, truncated } = fitLines(lines);
  return { text, resultCount: lines.length, topIds: ids.slice(0, 5), truncated };
};
