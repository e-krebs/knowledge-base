import { describe, expect, test } from "bun:test";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import type { KbRecord } from "../scripts/types";
import fixture from "./fixtures/records.json";
import { createKb, type Kb } from "./kb/kb";
import { createServer } from "./server";
import type { UsageEvent, UsageSink } from "./usage/log";

const NOW = new Date("2026-10-21T00:00:00Z");
const now = () => NOW;
const records = fixture as KbRecord[];
const kb = createKb({ records, now });

interface Reply {
  content: { type: string; text: string }[];
  isError?: boolean;
}

const connect = async ({ kb, sink }: { kb: Kb; sink: UsageSink }) => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer({ kb, sink, serverSession: "test-session", clientCwd: "/work/elsewhere" });
  await server.connect(serverTransport);

  const pending = new Map<number, (message: any) => void>();
  let nextId = 1;
  clientTransport.onmessage = (message: any) => pending.get(message.id)?.(message);
  await clientTransport.start();

  const request = (method: string, params: object = {}): Promise<any> =>
    new Promise((resolve) => {
      const id = nextId++;
      pending.set(id, (message) => {
        pending.delete(id);
        resolve(message.result ?? message);
      });
      clientTransport.send({ jsonrpc: "2.0", id, method, params } as any);
    });

  await request("initialize", {
    protocolVersion: "2025-11-25",
    capabilities: {},
    clientInfo: { name: "test-client", version: "9.9.9" },
  });
  await clientTransport.send({ jsonrpc: "2.0", method: "notifications/initialized" } as any);

  return {
    listTools: async () => (await request("tools/list")).tools as { name: string; annotations?: any }[],
    call: (name: string, args: object): Promise<Reply> => request("tools/call", { name, arguments: args }),
    close: () => clientTransport.close(),
  };
};

const withSink = async (run: (events: UsageEvent[], sink: UsageSink) => Promise<void>) => {
  const events: UsageEvent[] = [];
  await run(events, { write: (event) => events.push(event) });
};

const text = (reply: Reply) => reply.content[0]!.text;

describe("tools over an in-memory client", () => {
  test("lists six read-only tools", async () => {
    await withSink(async (_events, sink) => {
      const client = await connect({ kb, sink });
      const tools = await client.listTools();
      expect(tools.map((tool) => tool.name).sort()).toEqual(
        ["find_related", "get_item", "list_by_freshness", "list_links", "list_topics", "search_kb"].sort()
      );
      expect(tools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(true);
      await client.close();
    });
  });

  test("search_kb returns one line per hit and writes one event", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      const reply = await client.call("search_kb", { query: "popover" });
      expect(reply.isError).toBeFalsy();
      expect(text(reply).split("\n")[0]).toStartWith("p01 · Popover API");
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        tool: "search_kb",
        serverSession: "test-session",
        clientCwd: "/work/elsewhere",
        client: { name: "test-client", version: "9.9.9" },
        args: { query: "popover" },
        isError: false,
        truncated: false,
      });
      expect(events[0]!.topIds[0]).toBe("p01");
      expect(events[0]!.resultCount).toBeGreaterThan(0);
      await client.close();
    });
  });

  test("a search with no hits is not an error and is logged as zero results", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      const reply = await client.call("search_kb", { query: "zzqqxx" });
      expect(reply.isError).toBeFalsy();
      expect(text(reply)).toContain('No items match "zzqqxx"');
      expect(events).toHaveLength(1);
      expect(events[0]!.resultCount).toBe(0);
      await client.close();
    });
  });

  test("search_kb caps text at 8000 characters and says how many were cut", async () => {
    const big = Array.from({ length: 60 }, (_, i) => ({
      ...records[0]!,
      id: `big${i}`,
      url: `https://example.com/${i}`,
      title: `Popover ${i}`,
      gist: `popover ${"x".repeat(400)}`,
    }));
    await withSink(async (events, sink) => {
      const client = await connect({ kb: createKb({ records: big, now }), sink });
      const reply = await client.call("search_kb", { query: "popover", limit: 25 });
      expect(text(reply).length).toBeLessThanOrEqual(8000);
      expect(text(reply)).toMatch(/… \d+ more, narrow the query$/);
      expect(events[0]!.truncated).toBe(true);
      await client.close();
    });
  });

  test("get_item returns the full note with its gotchas and writes one event", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      const reply = await client.call("get_item", { ref: "p01" });
      expect(reply.isError).toBeFalsy();
      expect(text(reply)).toContain("id: p01");
      expect(text(reply)).toContain("gotchas:");
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({ tool: "get_item", args: { ref: "p01" }, topIds: ["p01"], resultCount: 1 });
      await client.close();
    });
  });

  test("get_item caps a long body at 20000 characters and marks it", async () => {
    const long = { ...records[0]!, id: "long1", body: "y".repeat(25000) };
    await withSink(async (events, sink) => {
      const client = await connect({ kb: createKb({ records: [long], now }), sink });
      const reply = await client.call("get_item", { ref: "long1" });
      expect(text(reply)).toMatch(/\[truncated: \d+ more characters\]$/);
      expect(text(reply).length).toBeLessThanOrEqual(20000);
      expect(events[0]!.truncated).toBe(true);
      await client.close();
    });
  });

  test("get_item is not marked truncated when the body only quotes the marker", async () => {
    const quoted = { ...records[0]!, id: "quoted1", body: "see [truncated: 3 more characters] here" };
    await withSink(async (events, sink) => {
      const client = await connect({ kb: createKb({ records: [quoted], now }), sink });
      await client.call("get_item", { ref: "quoted1" });
      expect(events[0]!.truncated).toBe(false);
      await client.close();
    });
  });

  test("get_item with an unknown ref is an error that points to search_kb", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      const reply = await client.call("get_item", { ref: "nope" });
      expect(reply.isError).toBe(true);
      expect(text(reply)).toContain("search_kb");
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({ tool: "get_item", isError: true });
      await client.close();
    });
  });

  test("list_topics lists the tree and writes one event", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      const reply = await client.call("list_topics", {});
      expect(text(reply)).toContain("programming/css");
      expect(events.map((event) => event.tool)).toEqual(["list_topics"]);
      await client.close();
    });
  });

  test("list_links lists one topic in file order and writes one event", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      await client.call("list_links", { topic: "programming/css" });
      const inTopic = (id: string) => records.find((record) => record.id === id)!.topic.startsWith("programming/css");
      expect(events[0]!.topIds.length).toBeGreaterThan(0);
      expect(events[0]!.topIds.every(inTopic)).toBe(true);
      expect(events.map((event) => event.tool)).toEqual(["list_links"]);
      await client.close();
    });
  });

  test("list_by_freshness lists the stale bucket and writes one event", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      const reply = await client.call("list_by_freshness", { bucket: "stale" });
      expect(text(reply)).toContain("a02");
      expect(events.map((event) => event.tool)).toEqual(["list_by_freshness"]);
      expect(events[0]!.topIds).toContain("a02");
      await client.close();
    });
  });

  test("find_related excludes the item itself and writes one event", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      const reply = await client.call("find_related", { id: "p01" });
      expect(reply.isError).toBeFalsy();
      expect(text(reply).split("\n").some((line) => line.startsWith("p01 "))).toBe(false);
      expect(events.map((event) => event.tool)).toEqual(["find_related"]);
      await client.close();
    });
  });

  test("find_related with an unknown id is an error", async () => {
    await withSink(async (events, sink) => {
      const client = await connect({ kb, sink });
      const reply = await client.call("find_related", { id: "nope" });
      expect(reply.isError).toBe(true);
      expect(events[0]!.isError).toBe(true);
      await client.close();
    });
  });
});
