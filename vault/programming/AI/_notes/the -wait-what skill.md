---
source: https://www.aihero.dev/skills-wait-what
fetched: 2026-09-13
published: 2026-08-24
status: fresh
---
`/wait-what` is a Claude Code agent skill you type when the agent's last message didn't land: it re-pitches what it just said, adding the context you were missing, in plain English, using the vocabulary from the project's `CONTEXT.md`. Reach for it the moment you notice you're skimming — the agent drifted into invented jargon, stacked acronyms, or explained a decision whose premise you never saw.

## how
Install: `npx skills@latest add mattpocock/skills --skill=wait-what`, then type `/wait-what` in the coding agent.

The skill is deliberately three lines long — that's the design, not an unfinished draft. It only ever fires on request: you invoke it, the agent never reaches for it on its own, because only you know when you stopped following. It re-pitches "that", not "the last message" — the agent decides how far back the confusion started.

Rationale: every popular fix for verbosity names the *output* — `/tldr`, `/no-fluff`, `/talk-normal` — and the model over-corrects into a terser, no-clearer register, because "be concise" is an instruction about what to cut. `wait` names the *listener's state* instead — comprehension failed here — so the agent backs up and explains rather than clipping words. A skill fighting verbosity by growing (a four-hundred-line concision skill) still fails, because the model reads the volume, not the plea; one precise leading word is what carries.

It reuses whatever vocabulary already exists in the project's `CONTEXT.md`, so invoking it isn't a new instruction — it's a reminder of one the agent already agreed to.

It's working if:
- the re-pitch is shorter and clearer, not shorter and blunter
- it adds the premise you were missing, instead of only deleting words
- project nouns replace invented ones — the terms in `CONTEXT.md` come back
- you can use it twice in a row and it doesn't degrade into terseness

## gotchas
- Without a `CONTEXT.md` (or a `CONTEXT-MAP.md` pointing to one), the skill still works but loses the domain-vocabulary half of the fix.
