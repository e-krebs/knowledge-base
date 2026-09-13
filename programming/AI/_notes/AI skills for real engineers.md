---
source: https://www.aihero.dev/skills
fetched: 2026-09-13
status: fresh
---
Catalog of 25 slash-command skills (mattpocock/skills) for coding agents, grouped into six categories by when you reach for them, from one-time repo setup through the idea-to-ship spine to codebase upkeep. Install the ones you want and the agent runs that process the same way every time instead of guessing.

## how
**Getting started**
- `/setup-matt-pocock-skills` - set up one repo so the other skills know how it works
- `/ask-matt` - find out which skill to use for the situation you're in
**Main flow** (idea to ship, in order)
- `/grill-with-docs` - get interviewed about a plan, record the decisions
- `/to-spec` - turn an agreed conversation into a written spec
- `/to-tickets` - split a spec into small tickets an agent can build
- `/implement` - build a finished spec into code, test-first
- `/code-review` - review a diff against your standards and the spec
**Shaping**
- `/wayfinder` - chart a large effort as a map of decisions, and settle them
- `/prototype` - answer a design question with code you then delete
- `/research` - get a cited answer, read from primary sources
**Upkeep**
- `/improve-codebase-architecture` - find the modules worth refactoring, as a visual report
- `/diagnosing-bugs` - diagnose a hard bug, starting from a repro that fails
- `/resolving-merge-conflicts` - finish a merge or rebase conflict, hunk by hunk
- `/triage` - sort raw issues into work someone can pick up
- `/wizard` - generate a script that walks a human through setup
**Productivity**
- `/grill-me` - align on an idea before committing to it
- `/handoff` - write up a long session so another agent can continue it
- `/to-questionnaire` - turn open questions into a doc someone else fills in
- `/teach` - learn a topic across many sessions that build on each other
- `/wait-what` - ask the agent to say that again, in plain English
- `/writing-for-agents` - how to write skills and other documents agents read
**Reference**
- `/codebase-design` - the vocabulary for designing deep modules
- `/domain-modeling` - sharpen the words a project uses, and write them down
- `/grilling` - the interview other skills run to stress-test a plan
- `/tdd` - the rules of the red-green-refactor loop

Install:
```
npx skills@latest add mattpocock/skills
```
Or as a managed, read-only Claude Code plugin, updates automatically: `claude plugins install mattpocock-skills`

## gotchas
- plain files, not a lock-in platform: works in Claude Code, Cursor, Codex, Amp, Copilot
