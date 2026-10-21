import { McpServer } from "@modelcontextprotocol/server";
import type { Kb } from "./kb/kb";
import { listTopics as topicCounts } from "./kb/query";
import type { UsageEvent, UsageSink } from "./usage/log";
import { register as findRelated } from "./tools/find-related";
import { register as getItem } from "./tools/get-item";
import { register as listByFreshness } from "./tools/list-by-freshness";
import { register as listLinks } from "./tools/list-links";
import { register as listTopics } from "./tools/list-topics";
import { register as searchKb } from "./tools/search-kb";
import type { Outcome, ToolHost, ToolSpec } from "./tools/shared";
import type { z } from "zod";

const topicSummary = (kb: Kb): string => {
  const topics = topicCounts({ kb });
  const children = (parent: string) =>
    topics.filter(({ topic }) => topic.startsWith(`${parent}/`) && topic.split("/").length === 2);
  return topics
    .filter(({ topic }) => !topic.includes("/"))
    .map(({ topic, count }) => {
      const sub = children(topic).map((child) => `${child.topic.slice(topic.length + 1)} ${child.count}`);
      return `${topic} ${count}${sub.length > 0 ? ` (${sub.join(", ")})` : ""}`;
    })
    .join("; ");
};

const instructions = (kb: Kb): string =>
  [
    "The user's personal knowledge base: their saved bookmarks, links, articles and reading notes, mostly about programming (CSS, React, JavaScript, TypeScript, Node, AI tooling) plus art, games and design.",
    "Check it before a web search whenever the user asks for a link, article or reference on a subject, asks what they already saved or noted, or asks for their opinion or past findings on a tool or technique. It is the user's curated source and often holds a note with gotchas that a web search lacks.",
    "Start with search_kb for a keyword, and get_item for the full note of a hit. Browse with list_topics and list_links, find outdated items with list_by_freshness, and find neighbours of one item with find_related. Each result line is: id · title · url · status · fetched · gist.",
    `Topics (items): ${topicSummary(kb)}.`,
  ].join(" ");

export interface ServerDeps {
  kb: Kb;
  sink: UsageSink;
  serverSession: string;
  clientCwd: string;
  clientSession?: string;
}

const clientOf = (server: McpServer): UsageEvent["client"] => {
  const info = server.server.getClientVersion();
  return info ? { name: info.name, version: info.version } : undefined;
};

export const createServer = ({ kb, sink, serverSession, clientCwd, clientSession }: ServerDeps): McpServer => {
  const server = new McpServer({ name: "knowledge-base", version: "1.0.0" }, { instructions: instructions(kb) });

  const host: ToolHost = {
    register<S extends z.ZodObject>(spec: ToolSpec<S>, handler: (args: z.infer<S>) => Outcome | Promise<Outcome>) {
      server.registerTool(
        spec.name,
        {
          description: spec.description,
          inputSchema: spec.inputSchema as z.ZodObject,
          annotations: { readOnlyHint: true, openWorldHint: false },
        },
        async (args: Record<string, unknown>) => {
          const started = performance.now();
          const base = {
            ts: new Date().toISOString(),
            serverSession,
            clientSession,
            clientCwd,
            client: clientOf(server),
            tool: spec.name,
            args,
          };
          try {
            const outcome = await handler(args as unknown as z.infer<S>);
            sink.write({
              ...base,
              resultCount: outcome.resultCount,
              topIds: outcome.topIds,
              truncated: outcome.truncated,
              ms: performance.now() - started,
              isError: outcome.isError === true,
            });
            return { content: [{ type: "text", text: outcome.text }], isError: outcome.isError === true };
          } catch (error) {
            sink.write({
              ...base,
              resultCount: 0,
              topIds: [],
              truncated: false,
              ms: performance.now() - started,
              isError: true,
            });
            throw error;
          }
        }
      );
    },
  };

  const deps = { server: host, kb };
  searchKb(deps);
  getItem(deps);
  listTopics(deps);
  listLinks(deps);
  listByFreshness(deps);
  findRelated(deps);
  return server;
};
