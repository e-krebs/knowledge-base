import { z } from "zod";
import { summary } from "../kb/format";
import { findRelated } from "../kb/query";
import { listOutcome, type Outcome, type ToolDeps } from "./shared";

const inputSchema = z.object({
  id: z.string().min(1).describe("Item id from an earlier search_kb, list_links or get_item result."),
  limit: z.number().int().min(1).max(10).optional().describe("Maximum related items to return. Default 5."),
});

export const register = ({ server, kb }: ToolDeps): void =>
  server.register(
    {
      name: "find_related",
      description:
        "Find items on the same subject as one saved item, matched on its title and rarest tags. Use it when the user asks what else they have on the same topic as a given item, or for neighbours of a note they are reading. Pass an id from earlier results.",
      inputSchema,
    },
    ({ id, limit }): Outcome => {
      if (!kb.byId.has(id)) {
        return {
          text: `Unknown id "${id}". Call search_kb to find an id.`,
          isError: true,
          resultCount: 0,
          topIds: [],
          truncated: false,
        };
      }
      const hits = findRelated({ kb, id, limit });
      return listOutcome({
        lines: hits.map(summary),
        ids: hits.map((hit) => hit.id),
        empty: `No related items for "${id}".`,
      });
    }
  );
