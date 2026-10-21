import { describe, expect, test } from "bun:test";
import type { KbRecord } from "../../scripts/types";
import fixture from "../fixtures/records.json";
import { createKb, fromSnapshot, toSnapshot, type Kb } from "./kb";
import { detail, summary } from "./format";
import { findRelated, getItem, listByFreshness, listLinks, listTopics, search, type View } from "./query";

const NOW = new Date("2026-10-21T00:00:00Z");
const now = () => NOW;
const records = fixture as KbRecord[];
const kb: Kb = createKb({ records, now });
const ids = (hits: { id: string }[]) => hits.map((hit) => hit.id);
const byId = (id: string): KbRecord => records.find((record) => record.id === id)!;
const viewOf = (id: string, target: Kb = kb): View => {
  const lookup = getItem({ kb: target, ref: id });
  if (lookup.type !== "one") throw new Error(`no single item for ${id}`);
  return lookup.item;
};

describe("createKb", () => {
  test("fixture ids are unique", () => {
    expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
  });

  test("a duplicate id throws naming both records", () => {
    const twin = { ...byId("p01"), id: "p01" };
    expect(() => createKb({ records: [byId("p01"), twin], now })).toThrow(/duplicate record id p01.*Popover API.*Popover API/);
  });
});

describe("search", () => {
  test("popover returns the expected ids in order", () => {
    expect(ids(search({ kb, query: "popover" }))).toEqual(["p01", "l09"]);
  });

  test("AND finds nothing, so OR falls back", () => {
    expect(ids(search({ kb, query: "popover snap" })).sort()).toEqual(["l08", "l09", "p01"]);
  });

  test("status and form filters restrict hits", () => {
    expect(ids(search({ kb, query: "anchor", status: "stale" }))).toEqual(["a02"]);
    expect(ids(search({ kb, query: "anchor", status: "fresh" }))).toEqual([]);
    expect(ids(search({ kb, query: "css", form: "bare" }))).toEqual(["l07"]);
  });

  test("topic filter matches by prefix", () => {
    const hits = search({ kb, query: "css", topic: "programming/css" });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((hit) => hit.topic.startsWith("programming/css"))).toBe(true);
  });

  test("stale demotes a hit", () => {
    const fresh = { ...byId("a02"), id: "a02f", status: "fresh" as const, rawStatus: "fresh" };
    const freshKb = createKb({ records: records.map((record) => (record.id === "a02" ? fresh : record)), now });
    const staleScore = search({ kb, query: "anchor" })[0]!.score;
    const freshScore = search({ kb: freshKb, query: "anchor" })[0]!.score;
    expect(staleScore).toBeLessThan(freshScore);
  });

  test("a note outranks an otherwise identical link", () => {
    const twin = { ...byId("l08"), id: "twin", kind: "note" as const, noteFile: "twin.md", status: "fresh" as const };
    const twinKb = createKb({ records: [...records, twin], now });
    expect(ids(search({ kb: twinKb, query: "snap" }))[0]).toBe("twin");
  });

  test("results group by url and list every topic", () => {
    const hits = search({ kb, query: "simple icons" });
    expect(ids(hits)).toEqual(["l05"]);
    expect(hits[0]!.topics).toEqual(["programming/svg/general", "programming/svg/icons"]);
  });

  test("fetched sort puts the oldest first", () => {
    expect(ids(search({ kb, query: "css", sort: "fetched" })).slice(0, 2)).toEqual(["o04", "a02"]);
  });
});

describe("getItem", () => {
  test("by id", () => {
    expect(getItem({ kb, ref: "p01" })).toMatchObject({ type: "one", item: { id: "p01" } });
  });

  test("by url with several records returns candidates", () => {
    const lookup = getItem({ kb, ref: "https://simpleicons.org" });
    expect(lookup.type === "many" && lookup.items.map((item) => item.id).sort()).toEqual(["l05", "l06"]);
  });

  test("by case-insensitive title", () => {
    expect(getItem({ kb, ref: "css grid" })).toMatchObject({ type: "one", item: { id: "l07" } });
  });

  test("unknown ref", () => {
    expect(getItem({ kb, ref: "nope" })).toEqual({ type: "none" });
  });
});

describe("listings", () => {
  test("buckets", () => {
    const ofBucket = (bucket: Parameters<typeof listByFreshness>[0]["bucket"]) =>
      ids(listByFreshness({ kb, bucket }));
    expect(ofBucket("stale")).toEqual(["a02"]);
    expect(ofBucket("emerging")).toEqual(["e03"]);
    expect(ofBucket("old-fetched")).toEqual(["o04"]);
    expect(ofBucket("unchecked")).toEqual(["j10", "l07", "w12", "l09", "l08", "l05", "l06"]);
  });

  test("view carries ages from the clock", () => {
    expect(getItem({ kb, ref: "p01" })).toMatchObject({ item: { fetchedAgeDays: 50 } });
  });

  test("topics count every record at or below each prefix", () => {
    const counts = Object.fromEntries(listTopics({ kb }).map(({ topic, count }) => [topic, count]));
    expect(counts["programming"]).toBe(11);
    expect(counts["programming/css"]).toBe(7);
  });

  test("links keep file order", () => {
    expect(ids(listLinks({ kb, topic: "programming/svg" }))).toEqual(["l06", "l05"]);
  });

  test("related excludes the item and its own url", () => {
    const related = ids(findRelated({ kb, id: "l05" }));
    expect(related).not.toContain("l05");
    expect(related).not.toContain("l06");
  });
});

describe("format and snapshot", () => {
  test("snapshot round trip keeps search results", () => {
    const restored = fromSnapshot({ snapshot: toSnapshot(kb), now });
    expect(ids(search({ kb: restored, query: "popover" }))).toEqual(["p01", "l09"]);
  });

  test("summary is one line with the fields in order", () => {
    expect(summary(viewOf("l05"))).toBe("l05 · Simple Icons · https://simpleicons.org · unchecked · - · Brand icons as SVG files.");
  });

  test("detail caps the whole output, metadata included, and marks the truncation", () => {
    const longKb = createKb({ records: [{ ...byId("o04"), body: "x".repeat(25000) }], now });
    const out = detail(viewOf("o04", longKb));
    expect(out.truncated).toBe(true);
    expect(out.text.length).toBeLessThanOrEqual(20000);
    expect(out.text).toMatch(/\n\[truncated: \d+ more characters\]$/);
  });

  test("detail is not truncated when a body only mentions the marker", () => {
    const quoted = createKb({ records: [{ ...byId("o04"), body: "see [truncated: 3 more characters] here" }], now });
    expect(detail(viewOf("o04", quoted)).truncated).toBe(false);
  });

  test("detail of a bare link has no body section", () => {
    expect(detail(viewOf("l07")).text).not.toContain("\n---\n");
  });

  test("getItem trims a url ref before comparing", () => {
    expect(getItem({ kb, ref: "  https://simpleicons.org \n" })).toMatchObject({ type: "many" });
  });

  test("a future fetched date is age zero, not negative", () => {
    const future = createKb({ records: [{ ...byId("p01"), fetched: "2026-10-25T00:00:00Z" }], now });
    expect(viewOf("p01", future).fetchedAgeDays).toBe(0);
  });

  test("an unparseable fetched date has no age and falls in unchecked", () => {
    const broken = createKb({ records: [{ ...byId("p01"), fetched: "not a date" }], now });
    expect(viewOf("p01", broken).fetchedAgeDays).toBeUndefined();
    expect(ids(listByFreshness({ kb: broken, bucket: "unchecked" }))).toContain("p01");
  });
});
