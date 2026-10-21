import { z } from "zod";
import { listTopics } from "../kb/query";
import { listOutcome, type ToolDeps } from "./shared";

export const register = ({ server, kb }: ToolDeps): void =>
  server.register(
    {
      name: "list_topics",
      description:
        "List the topic tree of the knowledge base, with the number of items under each topic. Use it to see which subjects the user has covered, or to find the topic path to pass to search_kb or list_links.",
      inputSchema: z.object({}),
    },
    () =>
      listOutcome({
        lines: listTopics({ kb }).map(({ topic, count }) => `${topic} · ${count}`),
        ids: [],
        empty: "The knowledge base has no topics.",
      })
  );
