---
source: https://code.claude.com/docs/en/sub-agents
fetched: 2026-09-13
status: fresh
---
Subagents are Markdown files with YAML frontmatter that give Claude Code a specialized worker with its own context window, system prompt, and tool access. Reach for one when a side task would flood the main conversation with search results or logs you won't reference again, or when you keep spawning the same kind of worker with the same instructions.

## how
File locations (priority order, highest first):
- Managed settings - org-wide, deployed via managed settings.
- `--agents` CLI flag - current session only, passed as JSON at launch.
- `.claude/agents/` - current project; check into version control to share with the team.
- `~/.claude/agents/` - all your projects (personal).
- A plugin's `agents/` directory - wherever the plugin is enabled.

Frontmatter fields (only `name` and `description` are required):
- `name` - unique identifier, lowercase letters and hyphens, no `:`.
- `description` - when Claude should delegate to this subagent.
- `tools` - tools the subagent can use; inherits all if omitted.
- `disallowedTools` - tools to deny from the inherited/specified list.
- `model` - `sonnet`, `opus`, `haiku`, `fable`, a full model ID, or `inherit`.
- `permissionMode` - `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`, or `manual`.
- `maxTurns` - max agentic turns before the subagent stops (resumable).
- `skills` - skills to preload in full into the subagent's context at startup.
- `mcpServers` - MCP servers available to this subagent.
- `hooks` - lifecycle hooks scoped to this subagent.
- `memory` - persistent memory scope: `user`, `project`, or `local`.
- `background` - `true` to keep it running in the background.
- `effort` - `low`, `medium`, `high`, `xhigh`, or `max`, overriding the session's level.
- `isolation` - `worktree` to run in a temporary, auto-cleaned git worktree.
- `color` - display color in the task list/transcript.
- `initialPrompt` - auto-submitted first user turn when run as the main session agent.
- `experimental` - map of experimental options (e.g. `cacheTtl`).
Minimal example (`.claude/agents/code-reviewer.md`):
```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```
