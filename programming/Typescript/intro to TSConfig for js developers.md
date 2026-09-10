---
source: https://deno.com/blog/intro-to-tsconfig
fetched: 2026-09-10
published: 2024-04-17
status: fresh
---
`tsconfig.json` configures the TypeScript compiler for a project — TypeScript itself is a JS superset ("super powered linter") that adds type safety while staying compatible with existing editors, build tools, package managers, test frameworks and CI/CD. Reach for this as a refresher on what each `compilerOptions` field actually controls before hand-tuning a tsconfig.

## how
- `target` — ECMAScript version for emitted JS; set to the lowest version you need or `ESNext` for the latest proposed features (ES3 is rejected since TS 7.0).
- `module` — module system (`CommonJS`, `AMD`, `ES6`, ...); most modern projects use `ES6`/`ESNext`.
- `outDir` — output directory for compiled JS, typically `dist`.
- `strict` — enables the full set of strict type-checking options.
- `alwaysStrict` — auto-enabled by `strict`; parses code in JS strict mode.
- `esModuleInterop` — smooths ESM/CJS interop; recommended when mixing both.
- `lib` — which standard library declarations are included for type-checking.
- `sourceMap` — emits `.map` files mapping compiled JS back to TS source.
- `jsx` — how JSX is emitted (`preserve`, `react`, `react-native`).
- `removeComments` — strips comments from compiled output.
- `sourceRoot` — where the debugger should look for TS source.
- `include` — glob patterns for files to compile (e.g. `"src/**/*.ts"`); defaults to all `.ts`/`.tsx`/`.d.ts` if unspecified.
- `exclude` — glob patterns to skip, typically `node_modules`.
- `declarationMap` — emits `.d.ts.map` files alongside `.d.ts` for better debugging.
- Watch mode: `tsc --watch` recompiles on file changes.
- Incremental builds only rebuild changed parts, speeding up large projects.
- Per-file overrides via `// @ts-ignore` / `// @ts-nocheck` comment directives.
- [tsconfig/bases](https://github.com/tsconfig/bases) has community-maintained starting configs per runtime.
- Deno supports TypeScript natively with zero config: `deno run yourfile.ts`.

