---
source: https://github.com/unjs/magicast
fetched: 2026-09-13
published: 2023-02-15
status: fresh
---
Magicast programmatically modifies JS/TS source code with a simple, familiar syntax, built on the AST parsed by recast and babel. It preserves the original formatting (quotes, tabs, etc.) while editing, and can manipulate imports/exports and function-call arguments like `defineConfig()`. Reach for it when you need to update a static-ish config file (add an export, push into an array, wrap a call) without hand-rolling AST traversal.

## how
```js
import { loadFile, writeFile } from "magicast";

const mod = await loadFile("config.js");
mod.exports.default.foo.push("b");
await writeFile(mod, "config.js");
```

```js
const mod = parseModule(`export default { }`);
mod.exports.default.foo ||= [];
mod.exports.default.foo.push("b");
mod.exports.default.foo.unshift("a");
const { code, map } = generateCode(mod);
```

```js
const mod = parseModule(`export default defineConfig({ foo: 'bar' })`);
const options = mod.exports.default.$type === "function-call"
  ? mod.exports.default.$args[0]
  : mod.exports.default;
```

```js
const options = (mod.exports.default.list = builders.functionCall("create", [1, 2, 3]));
```

```js
import { parseModule } from "magicast/core";
```

## gotchas
- JS is very dynamic; Magicast's convention cannot cover every possible case — wrap edits in `try/catch` (any operation may throw depending on the input code).
- The high-level helpers in `magicast/helpers` (e.g. `addNuxtModule`, `addVitePlugin`, `deepMergeObject`) are experimental and may move to a separate package.
- The main `magicast` export bundles filesystem utilities, so import from `magicast/core` for browser/worker use.
