import { describe, expect, test } from "bun:test";
import { mkdtempSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join } from "node:path";
import { usagePath } from "./file-sink";

describe("usagePath", () => {
  test("a relative KB_MCP_LOG is resolved to an absolute path", () => {
    expect(isAbsolute(usagePath({ KB_MCP_LOG: "logs/usage.jsonl" })!)).toBe(true);
  });

  test("a relative KB_MCP_LOG resolves against the cwd at the time of the call", () => {
    const before = process.cwd();
    const elsewhere = realpathSync(mkdtempSync(join(tmpdir(), "kb-usage-")));
    process.chdir(elsewhere);
    try {
      expect(usagePath({ KB_MCP_LOG: "usage.jsonl" })).toBe(join(elsewhere, "usage.jsonl"));
    } finally {
      process.chdir(before);
    }
  });

  test("off disables the log and an unset variable uses the default", () => {
    expect(usagePath({ KB_MCP_LOG: "off" })).toBeUndefined();
    expect(usagePath({})).toMatch(/knowledge-base-mcp\/usage\.jsonl$/);
  });
});
