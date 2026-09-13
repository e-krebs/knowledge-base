---
source: https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models
fetched: 2026-09-13
published: 2026-07-24
status: fresh
---
Anthropic rewrote Claude Code's system prompt for Claude 5-generation models, cutting it by over 80% with no measurable loss on coding evals, and generalizes what it learned into a set of shifts for context engineering — the system prompt, CLAUDE.md, skills, and other material assembled around every request. Reach for these when deciding what belongs in a system prompt versus CLAUDE.md versus a skill versus an inline reference, or when an agent harness feels overconstrained.

## how
**Rules -> judgement.** Drop rigid instructions ("never write multi-line comments") that were only needed to avoid worst-case outcomes on older models. State the intent instead: "Write code that reads like the surrounding code: match its comment density, naming, and idiom."

**Examples -> interface design.** Usage examples narrow the model into one exploration path. Spend that effort on the tool's parameters instead — e.g. an enum `status` field (`pending`/`in_progress`/`completed`) plus a rule like "keep one item in_progress" does more work than a worked example.

**Upfront -> progressive disclosure.** Move code-review and verification instructions out of the system prompt into their own skills, loaded only when needed. Apply the same idea to tools: mark some as "deferred loading" so the agent fetches their full definition via a search tool only when it's about to use them, and to CLAUDE.md/SKILL.md: split into a tree of files instead of one central repository of every practice.

**Repetition -> tool descriptions.** Delete repeated tool-usage guidance from the system prompt and put it once, in the tool's own description — earlier models needed the repetition because they weighted instructions near the end of context more; newer ones don't.

**CLAUDE.md memory -> auto-memory.** Stop hand-writing memories into CLAUDE.md; Claude now saves relevant memories automatically.

**Simple specs -> rich references.** Prefer high-fidelity references over plain markdown specs: HTML artifacts, code, a test suite, or a rubric that lets Claude verify taste (e.g. "what does good API design look like") with a verifier agent.

Anthropic ships these as a `/doctor` command in Claude Code, to rightsize your own skills and CLAUDE.md files.

## gotchas
- These shifts assume a newer, higher-judgement model (Opus 5 / Fable 5 class); the source is explicit that removing the same guardrails from older models produced wrong output in many cases.
