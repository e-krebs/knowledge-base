---
source: https://nodesource.com/blog/nodejs-features-replacing-npm-packages
fetched: 2026-09-13
published: 2025-10-01
status: stale
---
A survey of npm packages that a recent Node.js version now covers natively, letting you drop the dependency. Reach for this list when auditing a project's dependencies for ones that core Node has since absorbed.

## how
| npm package | native replacement | added in |
|---|---|---|
| `node-fetch` | global `fetch()` | v18.0.0 (stable) |
| `ws` (client) | global `WebSocket` | v21.0.0 |
| `mocha`/`jest`/`tap` | `node:test` | v18.0.0 (experimental), stable v20 |
| `sqlite3`/`better-sqlite3` | `node:sqlite` | experimental module |
| `chalk`/`kleur` | `util.styleText()` | v20.12.0 |
| `ansi-colors`/`strip-ansi` | `util.stripVTControlCharacters()` | — |
| `glob` | `fs.glob()` | v22.0.0 |
| `rimraf` | `fs.rm({ recursive: true })` | v14+ |
| `mkdirp` | `fs.mkdir({ recursive: true })` | v10.12.0 |
| `uuid` (v4) | `crypto.randomUUID()` | v14.17.0 |
| `base64-js`/`atob` polyfills | `Buffer`, `atob`, `btoa` | ~v20.0.0 |
| `url-pattern` | global `URLPattern` | v20.0.0 (experimental) |
| `dotenv` | `--env-file` flag | v20.10.0 (experimental) |
| `event-target-shim` | `EventTarget` | v15.0.0, stable v15.4.0 |
| `tsc` (basic transpile) | `--experimental-strip-types` | v21.x |

## gotchas
- `ws`→`WebSocket`: the article called this still experimental; it's stable since Node 22.4.0.
- `dotenv`→`--env-file`: the article called this still experimental; it's fully stable since Node 22.21.0/24.10.0.
- `tsc`→type stripping: the article called this still experimental; it's stable and unflagged since Node 24.12.0/25.2.0, and the default for `.ts` files on the current LTS.
- `sqlite3`→`node:sqlite`: advanced from experimental to release-candidate (stability 1.2) as of Node 25.7, still not final-stable.
