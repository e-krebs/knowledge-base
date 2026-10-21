import { z } from "zod";
import { summary } from "../kb/format";
import { listByFreshness } from "../kb/query";
import { listOutcome, type ToolDeps } from "./shared";

const inputSchema = z.object({
  bucket: z
    .enum(["stale", "emerging", "old-fetched", "unchecked"])
    .optional()
    .describe(
      "`stale` notes whose source changed, `emerging` notes, `old-fetched` notes last checked over 180 days ago, `unchecked` links never checked. Omit to list all, stale first."
    ),
  limit: z.number().int().min(1).max(50).optional().describe("Maximum items to return. Default 50."),
});

export const register = ({ server, kb }: ToolDeps): void =>
  server.register(
    {
      name: "list_by_freshness",
      description:
        "List items by freshness: notes whose sources went stale or emerged, notes not re-checked for months, and links never checked. Use it when the user asks what is outdated, what to review or re-check, or what they have not verified. Oldest-checked first within each bucket.",
      inputSchema,
    },
    ({ bucket, limit }) => {
      const items = listByFreshness({ kb, bucket, limit });
      return listOutcome({
        lines: items.map(summary),
        ids: items.map((item) => item.id),
        empty: bucket ? `No items in the ${bucket} bucket.` : "No items have a freshness status.",
      });
    }
  );
