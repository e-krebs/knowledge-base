---
source: https://www.totaltypescript.com/how-to-create-an-npm-package
fetched: 2026-09-13
published: 2025-07-11
status: fresh
---
Full walkthrough for publishing a production-ready TypeScript package to npm from an empty directory, using Prettier, Vitest, GitHub Actions and Changesets. Reach for it as a checklist when scaffolding a new package or auditing an existing one against a modern npm/TS/CI baseline.

## how
- Git: `git init`, ignore `node_modules`, initial commit, `gh repo create <name> --source=. --public`, push.
- package.json essentials: `"files": ["dist"]` (only files installed besides README/package.json/LICENSE by default), `"type": "module"` (ECMAScript modules, not CommonJS), `"main": "dist/index.js"` (entry point), plus `name`, `version`, `license`, `repository`, `homepage`, `bugs`.
- tsconfig.json essentials:
```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "module": "NodeNext",
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  }
}
```
- Source files import each other with a `.js` extension even though the files are `.ts` (required by NodeNext module resolution).
- Scripts: `build: tsc`, `format: prettier --write .`, `check-format: prettier --check .`, `test: vitest run`, `dev: vitest`, `ci: npm run build && npm run check-format && npm run test`.
- CI: GitHub Actions workflow triggered on `pull_request` and push to `main`, with a `concurrency` group and `cancel-in-progress: true`; steps are checkout, setup-node, `npm install`, `npm run ci`.
- Publish flow with Changesets: `npm install --save-dev @changesets/cli` → `npx changeset init` → set `"access": "public"` and `"commit": true` in `.changeset/config.json` → add `local-release: "changeset version && changeset publish"` and `prepublishOnly: "npm run ci"` scripts → `npx changeset` to record a changeset → commit → `npm run local-release` to version, publish, and generate `CHANGELOG.md`.

## gotchas
- Keeping `prepublishOnly` (runs CI) separate from `local-release` guards against someone accidentally running a plain `npm publish` that skips the release script.
