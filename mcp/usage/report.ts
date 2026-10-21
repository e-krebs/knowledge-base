import { readFileSync } from "node:fs";
import type { UsageEvent } from "./log";
import { usagePath } from "./file-sink";

const TOP = 10;

const parseSince = (argv: string[], now: Date): Date | undefined => {
  const at = argv.indexOf("--since");
  if (at === -1) return undefined;
  const match = /^(\d+)d$/.exec(argv[at + 1] ?? "");
  if (!match) throw new Error("--since takes a number of days, e.g. --since 7d");
  return new Date(now.getTime() - Number(match[1]) * 86_400_000);
};

const countBy = (values: string[]): [string, number][] => {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
};

const section = (title: string, rows: string[]): string[] => [`\n${title}`, ...(rows.length ? rows : ["  (none)"])];

export const parseEvents = (raw: string): UsageEvent[] =>
  raw
    .split("\n")
    .filter((line) => line.trim() !== "")
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as UsageEvent];
      } catch {
        return [];
      }
    });

export const report = ({ events, since }: { events: UsageEvent[]; since?: Date }): string => {
  const scoped = since ? events.filter((event) => Date.parse(event.ts) >= since.getTime()) : events;
  if (scoped.length === 0) return "No usage events in range.";

  const searches = scoped.filter((event) => event.tool === "search_kb");
  const queryOf = (event: UsageEvent): string => String((event.args as { query?: string }).query ?? "");
  const refOf = (event: UsageEvent): string => String((event.args as { ref?: string }).ref ?? "");
  const slowest = [...scoped].sort((a, b) => b.ms - a.ms).slice(0, TOP);
  const zeroResults = searches.filter((event) => event.resultCount === 0 && !event.isError);
  const errors = scoped.filter((event) => event.isError);
  const fetched = scoped.filter((event) => event.tool === "get_item" && !event.isError);
  const clients = countBy(scoped.map((event) => (event.client ? `${event.client.name} ${event.client.version}` : "unknown")));

  return [
    `Usage events: ${scoped.length} (${scoped[0]!.ts} to ${scoped[scoped.length - 1]!.ts})`,
    ...section("Calls per tool", countBy(scoped.map((event) => event.tool)).map(([tool, n]) => `  ${tool}: ${n}`)),
    ...section("Calls per day", countBy(scoped.map((event) => event.ts.slice(0, 10))).map(([day, n]) => `  ${day}: ${n}`)),
    ...section("Clients", clients.map(([client, n]) => `  ${client}: ${n}`)),
    ...section(
      "Top queries",
      countBy(searches.map(queryOf))
        .slice(0, TOP)
        .map(([query, n]) => `  ${n}x "${query}"`)
    ),
    ...section(
      "Zero-result queries (recall gaps)",
      countBy(zeroResults.map(queryOf))
        .slice(0, TOP)
        .map(([query, n]) => `  ${n}x "${query}"`)
    ),
    ...section(
      "Most fetched by get_item",
      countBy(fetched.map(refOf))
        .slice(0, TOP)
        .map(([ref, n]) => `  ${n}x ${ref}`)
    ),
    ...section(
      "Slowest calls",
      slowest.map((event) => `  ${event.ms.toFixed(1)} ms ${event.tool} ${JSON.stringify(event.args)}`)
    ),
    ...section(
      "Errors",
      errors.map((event) => `  ${event.ts} ${event.tool} ${JSON.stringify(event.args)}`)
    ),
  ].join("\n");
};

if (import.meta.main) {
  const path = usagePath();
  if (path === undefined) throw new Error("usage logging is off (KB_MCP_LOG=off)");
  const since = parseSince(process.argv.slice(2), new Date());
  const raw = (() => {
    try {
      return readFileSync(path, "utf8");
    } catch {
      return "";
    }
  })();
  console.log(report({ events: parseEvents(raw), since }));
}
