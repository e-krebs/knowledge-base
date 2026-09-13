---
source: https://web.archive.org/web/20250830170452/https://2ality.com/2022/08/npm-package-scripts.html
fetched: 2026-09-13
published: 2022-08-31
status: stale
---
npm package scripts run via `cmd.exe` on Windows and `/bin/sh` on Unix, so a script that hardcodes shell syntax breaks on one platform. This is the subset of shell constructs (paths, quoting, chaining, exit codes, piping) that work unmodified on both, plus small `node` snippets and helper packages for the rest.

## how
- Paths: use `/`-separated relative paths — Windows accepts slashes too.
- Quoting: double-quote arguments; `cmd.exe` doesn't support single quotes. Escape embedded double quotes: `"dir": "mkdir \"\my dir\""`.
- Chaining: `&&` runs the next command only on success (exit code 0), `||` only on failure. Ignore-exit-code chaining differs: `;` on Unix, `&` on `cmd.exe`.
- Exit codes: `$?` on Unix, `%errorlevel%` on `cmd.exe`. `npm run` exits with the last script's exit code.
- Piping/redirecting works the same on both: `|`, `cmd > out.txt`, `cmd < in.txt`.
- Commands present on both platforms (options differ): `cd`, `echo`, `exit`, `mkdir`, `more`, `rmdir`, `sort`.
- For anything more complex, drop into Node itself:
```
node -p "process.env.USER ?? process.env.USERNAME"   # cross-platform echo
node -p "process.cwd()"
node -e "fs.writeFileSync('file.txt', 'Text content', 'utf-8')"
```
  `fs`, `os`, and other builtins are available as bare globals in `-e`/`-p` snippets.
- Running scripts concurrently: `concurrently "npm run clean" "npm run build"`, or `npm-run-all --parallel lint build` (also does sequential runs and `"watch:*"` wildcards).

## gotchas
- The author flags this post itself as outdated and points to the newer chapter of the same name in the free book "Shell scripting with Node.js" (exploringjs.com/nodejs-shell-scripting).
- 2ality.com and the successor book's site are both offline in 2026 — this note is sourced from the Wayback Machine copy.
- `npm-run-all` has been unmaintained for ~5 years; the community fork `npm-run-all2` is the maintained replacement (requires modern Node).
