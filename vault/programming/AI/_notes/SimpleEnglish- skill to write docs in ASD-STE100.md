---
source: https://github.com/AminBlg/SimpleEnglish/tree/main
fetched: 2026-09-13
status: fresh
---
SimpleEnglish is an agent skill that makes an LLM write like ASD-STE100 Simplified Technical English, the controlled language aerospace has used since 1983 so a tired mechanic can't misread an instruction. It stays layman-readable by default and only applies the full STE vocabulary discipline when you name STE, ASD-STE100, or compliance. Reach for it on any technical writing you want an agent to produce: docs, READMEs, runbooks, error messages, release notes, or even chat replies.

## how
Install (any agent, skills CLI, skill only):
```
npx skills add AminBlg/SimpleEnglish
```
Claude Code plugin, adds the session hook and the `simple-english:simple-english` output style:
```
claude plugin marketplace add AminBlg/SimpleEnglish && claude plugin install simple-english@simple-english
```
Codex plugin, adds the session hook (needs Node.js):
```
codex plugin marketplace add AminBlg/SimpleEnglish
codex plugin add simple-english@simple-english
```
Invoke by asking for technical writing, or saying "rewrite this with simple-english". Without skill support, paste the rule block from `prompts/system-prompt.md` into your system prompt, `AGENTS.md`, or `.cursorrules`.

Rules it enforces, from `SKILL.md`. Reply register (every chat answer):
- prose only: no headers, bullets, bold, tables
- five sentences maximum, list items included
- first sentence answers
- no em-dashes
- define a concept term in a few words
- no contractions, openers, or closers

Document register (docs, READMEs, runbooks, error messages, release notes):
- max 20 words per instruction, 25 per description
- condition before command
- simple tenses, active voice
- no should/would/may/might (can/will/must survive)
- one word = one meaning, whole document
- keep articles, keep "that"
- no bold lead-ins, no heading over two sentences
- state the fact, not its importance

## gotchas
- doesn't make output STE-certified: nothing does, ASD certifies no tool
- the `npx skills` install skips the session hook and output style, so setting `outputStyle` without the Claude Code plugin does nothing
