import { z } from "zod";
import { summary } from "../kb/format";
import { listLinks } from "../kb/query";
import { listOutcome, type ToolDeps } from "./shared";

const inputSchema = z.object({
  topic: z
    .string()
    .min(1)
    .describe("Topic path, e.g. `programming/css`. Matches that folder and everything below it, ignoring case."),
  limit: z.number().int().min(1).max(50).optional().describe("Maximum items to return. Default 50."),
});

export const register = ({ server, kb }: ToolDeps): void =>
  server.register(
    {
      name: "list_links",
      description:
        "List the items filed under one topic, in the order they appear in the vault. Use it to browse a subject the user names. To match a keyword instead, use search_kb. Get topic paths from list_topics.",
      inputSchema,
    },
    ({ topic, limit }) => {
      const items = listLinks({ kb, topic, limit });
      return listOutcome({
        lines: items.map(summary),
        ids: items.map((item) => item.id),
        empty: `No items under "${topic}". Call list_topics to see the topic paths.`,
      });
    }
  );
