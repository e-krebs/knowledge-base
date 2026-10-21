import { z } from "zod";
import { detail, summary } from "../kb/format";
import { getItem } from "../kb/query";
import { listOutcome, type Outcome, type ToolDeps } from "./shared";

const inputSchema = z.object({
  ref: z.string().min(1).describe("An item id from search_kb or list_links, a full URL, or an exact title."),
});

export const register = ({ server, kb }: ToolDeps): void =>
  server.register(
    {
      name: "get_item",
      description:
        "Fetch one saved item in full: its metadata, freshness, gotchas and, for a note, the body. Use it after search_kb, list_links or find_related to read a hit. Pass the id from those results. A bare link has no body, only its metadata.",
      inputSchema,
    },
    ({ ref }): Outcome => {
      const lookup = getItem({ kb, ref });
      if (lookup.type === "none") {
        return {
          text: `No item matches "${ref}". Call search_kb to find its id.`,
          isError: true,
          resultCount: 0,
          topIds: [],
          truncated: false,
        };
      }
      if (lookup.type === "one") {
        const { text, truncated } = detail(lookup.item);
        return { text, resultCount: 1, topIds: [lookup.item.id], truncated };
      }
      const outcome = listOutcome({
        lines: lookup.items.map(summary),
        ids: lookup.items.map((item) => item.id),
        empty: "",
      });
      return {
        ...outcome,
        text: [`${lookup.items.length} items match "${ref}". Call get_item with one id:`, outcome.text].join("\n"),
      };
    }
  );
