---
source: https://matthewbrown.io/2025/09/04/node-test-runner
fetched: 2026-09-13
published: 2025-09-04
status: fresh
---
Node's native `node:test` runner can replace Jest/Mocha/Vitest for basic TypeScript and React component tests, combining `node --test` with a JSX/TS loader and `global-jsdom` for a DOM, plus React Testing Library for rendering. No config files are needed, and TypeScript runs directly without a build step.

## how
Current form on Node 24 LTS — type stripping itself needs no flag, but JSX still needs a loader, and module mocking is still experimental:

```json
{
  "scripts": {
    "test": "node --import global-jsdom/register --import tsx --experimental-test-module-mocks --test"
  }
}
```

- `--import tsx`: transforms JSX (native TS type stripping alone can't handle it)
- `--import global-jsdom/register`: provides a DOM environment for React components
- `--experimental-test-module-mocks`: enables module mocking
- `--test`: activates Node's test runner

React component test:

```js
import { render, fireEvent } from "@testing-library/react";
import { Toggle } from "./Toggle";

test("calls onToggleClick when clicked", () => {
  let callCount = 0;
  const { getByText } = render(
    <Toggle options={["On", "Off"]} selected="On" onToggleClick={() => callCount++} />
  );
  fireEvent.click(getByText("On"));
  assert.equal(callCount, 1);
});
```

## gotchas
- the 2025 article's original script used `--experimental-transform-types` to strip TypeScript types
- on Node 24 LTS, plain TS type stripping is stable and needs no flag at all, so this note drops `--experimental-transform-types` per the freshness check
- `--experimental-transform-types` is removed entirely in Node 26
