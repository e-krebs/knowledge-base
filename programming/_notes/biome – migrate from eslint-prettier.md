---
source: https://biomejs.dev/guides/migrate-eslint-prettier/
fetched: 2026-09-13
published: 2024-04-15
status: fresh
---
Biome ships two subcommands, `migrate eslint` and `migrate prettier`, that read an existing ESLint or Prettier config and port its settings into `biome.json`. Reach for these when moving a project off ESLint/Prettier onto Biome instead of hand-translating rule names and formatter options.

## how
Run both migrations (writes `biome.json`):

```
biome migrate eslint --write
biome migrate prettier --write
```

`migrate eslint`:
- Reads legacy and flat ESLint config, including `extends`, shared configs, and plugin configs (handles TypeScript ESLint, ESLint JSX A11y, ESLint React, ESLint Unicorn)
- Needs Node.js to resolve plugins/extends; for flat config it only searches `.js`/`.cjs`/`.mjs` files
- Also migrates `.eslintignore`
- Maps kebab-case ESLint rule names to Biome's camelCase equivalents
- Skips "inspired" rules (similar but not identical to an ESLint rule) by default; add `--include-inspired` to migrate them too
- Doesn't support YAML-based config

`migrate prettier`:
- Reads `.prettierrc*` and ports formatter options (quotes, tabs vs spaces, trailing commas, etc.) into Biome's formatter config
- Needs Node.js to load JS-based config like `.prettierrc.js`
- Doesn't support JSON5, TOML, or YAML config

Both commands: enable Biome's VCS integration afterward, since ESLint/Prettier take VCS ignore files into account and Biome should too.

## gotchas
- Some plugins/shared configs export objects with cyclic references that Biome fails to load; comment out the suspect plugin/config entries, run the migration, then re-enable them one at a time to find the culprit.
- Expect behavior differences from ESLint: Biome doesn't implement every rule option and sometimes deviates from the original rule.
- Vault link previously pointed at the Biome 1.7 release post (2024-04-15); now points at this live migration guide.
