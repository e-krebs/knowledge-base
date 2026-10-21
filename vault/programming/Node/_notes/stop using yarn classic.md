---
source: https://charpeni.com/blog/stop-using-yarn-classic
fetched: 2026-09-13
published: 2026-05-07
status: fresh
---
Yarn Classic (1.x) is frozen and has no way to re-resolve a single transitive dependency across the lockfile without side effects, which makes patching transitive CVEs — a routine, near-weekly task — needlessly painful. Reach for this when deciding whether to migrate a Classic project to Yarn Berry, pnpm, or Bun.

## how
- Yarn Classic's latest release is `1.22.22` (March 2024); all further features, fixes and security work happen on Yarn Berry (4.x), per the `yarnpkg/yarn` README itself.
- What doesn't work on Classic for a transitive CVE fix:
  - `yarn upgrade <package>` may leave the vulnerable transitive version completely unchanged.
  - `yarn upgrade <package>@<version>` re-resolves it but can promote a transitive dependency into direct `dependencies` — an unwanted `package.json` change.
  - A permanent `resolutions` entry works but accumulates and can hold back later upgrades; the workable-but-manual alternative is a temporary narrow `resolutions` entry (add it, `yarn install`, remove it, `yarn install` again).
- Yarn Berry's equivalent is one command, `package.json` untouched:
```
yarn up minimatch --recursive
```
- Migrating to Berry (keeps `node_modules`, no PnP commitment required):
```
corepack enable
yarn set version berry
yarn install
```
- Alternatives if open to switching package managers entirely: pnpm (`pnpm update`, `pnpm.overrides`, `minimumReleaseAge`, strict `node_modules` catches phantom deps) or Bun (`bun update`, `overrides`/`resolutions`, `install.minimumReleaseAge` since 1.3+).

## gotchas
- Yarn Berry, pnpm and Bun all also ship a minimum-release-age install gate that Classic has no equivalent for.
