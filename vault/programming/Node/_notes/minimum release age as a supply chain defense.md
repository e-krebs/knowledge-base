---
source: https://daniakash.com/posts/simplest-supply-chain-defense
fetched: 2026-09-13
published: 2026-03-30
status: stale
---
A minimum-release-age setting refuses to install any dependency version published within the last N days, which blocks most short-lived malicious-publish supply-chain attacks (axios, Solana web3.js, ua-parser-js — all caught and yanked within hours) without any scanning tool. Reach for it as a cheap, opt-in layer alongside lockfiles and provenance checks, not as a replacement for them.

## how
- Bun (seconds), `bunfig.toml`:
```toml
[install]
minimumReleaseAge = 604800
```
- npm (v11.10+, days), `.npmrc`:
```
min-release-age=7
```
- pnpm (v10.16+, minutes), `pnpm-workspace.yaml`:
```yaml
minimumReleaseAge: 10080
```
- Yarn 4 (v4.10+, duration string), `.yarnrc.yml`:
```yaml
npmMinimalAgeGate: "7d"
```
- uv (v0.9.17+), `pyproject.toml`:
```toml
[tool.uv]
exclude-newer = "7d"
```
- pip (v26.0+, absolute timestamp only): `pip install --uploaded-prior-to=2026-03-24T00:00:00Z package-name`
- Deno: `deno update --minimum-dependency-age=7d`
- Renovate/Dependabot have their own delay knobs (`minimumReleaseAge`, `cooldown`) and both bypass it automatically for security updates.

## gotchas
- pnpm 11 (released ~April 2026) turned `minimumReleaseAge` on by default at 1440 minutes (1 day); the article's pnpm example above, describing it as opt-in on 10.16+, is now stale.
- Doesn't catch long-running infiltrations (XZ Utils, 2+ years), maintainer sabotage (colors/faker, node-ipc), or build-system/CDN compromises (SolarWinds, 3CX, Polyfill.io) — the attacker isn't racing a clock in those cases.
- Not a substitute for lockfiles + `--frozen-lockfile`, `--ignore-scripts` in CI, SHA-pinned Actions, or provenance/Socket.dev — treat it as one layer in defense-in-depth.
- Needs a bypass allowlist for your own internal packages, and for emergency security patches.
- Go, Maven/Gradle, and Composer have no support at all.
