---
source: https://github.com/anthropics/claude-code/tree/main/mods/agents-md
fetched: 2026-10-20
status: fresh
---
A built-in Claude Code plugin that loads `AGENTS.md` files the way the engine loads `CLAUDE.md`, as `project` instruction files. One option, `instructionFiles`, picks the mode. Reach for it when a repo carries `AGENTS.md` and you want Claude Code to read it, alone or beside `CLAUDE.md`.

## how
Modes of `instructionFiles`:
- `claude-md`: only `CLAUDE.md`, the plugin adds nothing.
- `claude-md-or-agents-md` (default): `AGENTS.md` files load only when the project has no `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` of its own on the path from root to working directory.
- `claude-md-and-agents-md`: every `AGENTS.md` loads beside `CLAUDE.md`; a file `CLAUDE.md` already `@`-imports or links to is not loaded twice.
- `managed-only`: project, local and user instruction files are dropped; the organization's managed `CLAUDE.md` and memory stay.

Set it in user settings, `--settings` or managed settings (the `/config` row is "Project instructions"):
```json
{
  "pluginConfigs": {
    "agents-md@builtin": {
      "options": { "instructionFiles": "claude-md-and-agents-md" }
    }
  }
}
```
Nested `AGENTS.md` files in subdirectories attach on a `Read` under that directory, unless a `CLAUDE.md` there claims it. Test with `claude plugin test mods/agents-md`.

## gotchas
- A project's `.claude/settings.json` is not read for plugin options.
- The old key `projectInstructions` (`claude`, `agents-fallback`, `both`, `none`) is still honoured until `instructionFiles` is set to a non-default value.
- Nested files attach on text `Read` only, not for `@`-mentioned files, IDE selections, notebooks, images or PDFs.
- `--add-dir` directories contribute no `AGENTS.md`.
- `/memory` and the `#` shortcut do not know `AGENTS.md` files.
- `/plugin` can turn the plugin off, but no hooks setting or CLI mode does; where the engine loads no instruction files (`--bare` without `--add-dir`, `--safe-mode`, `CLAUDE_CODE_DISABLE_CLAUDE_MDS`) it adds none.
