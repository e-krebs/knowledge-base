---
source: https://colinhacks.com/essays/live-types-typescript-monorepo
fetched: 2026-09-10
published: 2024-05-30
status: fresh
---
"Live types" means source changes in one monorepo package are visible to consumers instantly, without a build step, because TypeScript's static module resolution and Node's runtime resolution are pointed at the same source files. Reach for this when wiring internal monorepo packages together and you want type-checking and running code to both track edits live.

## how
Ranked approaches, from weakest to the author's recommendation:
1. **Project References** (`tsconfig.json#references`) — per-package typechecking, static-only (no runtime effect), and not inherited through `extends`.
2. **`publishConfig` in `package.json`** (pnpm-specific) — dev config points at `.ts`, `publishConfig` overrides it for the published build.
3. **`compilerOptions.paths`** — redirects TypeScript's resolution to source; runtime still needs extra tooling (`tsx`, `vite-tsconfig-paths`).
4. **`tshy` with `liveDev`** — hardlinks TS source into the dist directories for automatic discovery.
5. **Custom export conditions (recommended)** — declare a custom condition in `package.json#exports`, then teach tooling to recognize it:

```json
{
  "exports": {
    "*": {
      "import": {
        "@colinhacks/source": "./src/index.ts",
        "default": "./lib/index.js"
      }
    }
  }
}
```
```json
{
  "compilerOptions": {
    "customConditions": ["@colinhacks/source"]
  }
}
```

This is "clean, easy to configure, and works well with modern tooling," and package-manager agnostic.

## gotchas
- Project references must be kept in sync with `package.json` dependencies by hand — they aren't inherited through `extends`.
- `compilerOptions.paths` only affects TypeScript's own resolution; Node still needs `tsx` or `vite-tsconfig-paths` to resolve the same way at runtime, and the TypeScript team is skeptical of the pattern.
- `tshy`'s `liveDev` requires the build tool to be running, and re-run whenever new files are created.
