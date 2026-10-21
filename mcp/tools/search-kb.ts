import { z } from "zod";
import { summary } from "../kb/format";
import { search } from "../kb/query";
import { listOutcome, type ToolDeps } from "./shared";

const inputSchema = z.object({
  query: z.string().min(1).describe("Words to match in titles, tags, gists and note bodies, e.g. `popover light dismiss`."),
  topic: z
    .string()
    .optional()
    .describe("Only items under this topic path, e.g. `programming/css`. Includes everything below it."),
  status: z
    .enum(["fresh", "stale", "emerging"])
    .optional()
    .describe("Only notes with this freshness status. Links with no status never match."),
  form: z
    .enum(["note", "gist", "bare"])
    .optional()
    .describe("`note` for extracted notes, `gist` for links with a summary, `bare` for links with only a title."),
  sort: z
    .enum(["relevance", "fetched"])
    .optional()
    .describe("`relevance` (default) ranks by match. `fetched` lists the oldest-fetched first."),
  limit: z.number().int().min(1).max(25).optional().describe("Maximum hits to return. Default 10."),
});

export const register = ({ server, kb }: ToolDeps): void =>
  server.register(
    {
      name: "search_kb",
      description:
        "Search the user's saved knowledge base of links and notes by keyword. Use it first, before a web search, when the user asks what they have saved or noted on a subject, wants a link, article or reference, or asks whether they already have something. Returns one line per hit: id · title · url · status · fetched · gist. Call get_item with an id for the full note.",
      inputSchema,
    },
    (args) => {
      const hits = search({
        kb,
        query: args.query,
        topic: args.topic,
        status: args.status,
        form: args.form,
        sort: args.sort,
        limit: args.limit ?? 10,
      });
      return listOutcome({
        lines: hits.map(summary),
        ids: hits.map((hit) => hit.id),
        empty: `No items match "${args.query}". Try different or fewer words, or drop the filters.`,
      });
    }
  );
