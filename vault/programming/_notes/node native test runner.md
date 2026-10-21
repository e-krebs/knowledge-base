---
source: https://pawelgrzybek.com/you-might-not-need-jest-the-node-js-native-test-runner-is-great/
fetched: 2026-09-13
published: 2023-07-12
status: fresh
---
`node:test` is Node's built-in test runner (experimental since Node 18, stable since Node 20), giving `describe`/`test`, mocking/spying, hooks, and watch mode without any external framework. Reach for it in basic scenarios where a full framework like Jest or Vitest would be overkill.

## how
```js
import test from "node:test";
import { deepEqual } from "node:assert";

test("passing test", () => {
  deepEqual(1 + 1, 2);
});
```

Grouping, hooks, and mocking:

```js
import { describe, test, mock, before, after } from "node:test";

describe("msg", () => {
  before(() => console.log("I run before a test suite."));
  after(() => console.log("I run after a test suite."));

  test("generates message (mocked data)", () => {
    const osCpusMock = mock.method(os, "cpus", () => ({ length: 666 }));
    deepEqual(msg("Dan"), "Dan, your computer has 666 CPUs.");
    deepEqual(osCpusMock.mock.callCount(), 1);
  });
});
```

Run with `node --test`, which matches files in a `test` directory, `test.{js,mjs,cjs}`, `test-*.{js,mjs,cjs}`, and `*.test.{js,mjs,cjs}` (plus `-test`/`_test` variants). Watch mode: `node --test --watch`.

## gotchas
- watch mode for the test runner was still experimental as of this article (added in Node 19.2)
- the default `spec` reporter can be swapped for the compact `dot` format, an npm reporter, or a custom TAP-based one
