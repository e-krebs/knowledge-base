---
source: https://github.com/BuilderIO/skills
fetched: 2026-09-13
status: fresh
---
Builder.io's `skills` repo is a catalog of small, composable skills for coding agents (Claude Code, Codex, Cursor, Copilot/VS Code, and similar), mostly built around Agent-Native apps and orchestration conventions. Install the recommended set, or pick individual skills, through one CLI installer or as a Claude Code / Cowork plugin marketplace.

## how
- `/an` - open and operate Agent-Native apps beside the conversation
- `/webmcp` - open web apps in the built-in browser and use MCP tools first
- `/visual-plan` - turn text plans into rich visual plans
- `/visual-recap` - turn diffs into interactive visual recaps
- `/visual-edit` - open a running local app for visual editing
- `/rewind` - recover recent local screen context through Clips Desktop
- `/agent-watchdog` - audit another agent's work
- `/plan-arbiter` - compare competing plans and choose a direction
- `/plow-ahead` - keep working through ordinary ambiguity
- `/efficient-fable` - orchestrate Fable with cheaper helper agents
- `/efficient-frontier` - preserve high-cost models for judgment
- `/stay-within-limits` - track usage limits before long-running work
- `/quick-recap` - end work with a clear status signal
- `/read-the-damn-docs` - check authoritative docs before guessing
- `/turn-into-app` - turn the current thread or a skill into a runnable Agent-Native app

Install (full picker, recommended skills preselected):
```
npx @agent-native/skills@latest add
```
Skip the picker for one skill:
```
npx @agent-native/skills@latest add --skill quick-recap
```
Claude Code plugin (all skills, updatable, namespaced `/builder-skills:*`):
```
/plugin marketplace add BuilderIO/skills
/plugin install builder-skills@builder-skills
```
Plain skill-folder copy via Vercel's `skills` CLI (no managed AGENTS.md/CLAUDE.md blocks, no GitHub Action):
```
npx skills@latest add BuilderIO/skills --skill quick-recap
```

## gotchas
- `/rewind` needs macOS and the signed Clips Desktop app; the installer won't install or enable capture silently, it asks permission first
- the plain-copy `skills` CLI can't configure Rewind's local `clips-screen-memory` connection; use `@agent-native/skills` or `@agent-native/core` instead
- treat Rewind as unavailable until `screen_memory_status` succeeds
