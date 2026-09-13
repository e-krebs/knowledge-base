---
source: https://wasp.sh/blog/2023/10/12/on-importance-of-naming-in-programming
fetched: 2026-09-13
published: 2023-10-12
status: fresh
---
Good naming is a diagnostic tool, not decoration: if a function or variable can't be named cleanly, that's a sign the code behind it is doing too much or is poorly designed. Reach for this checklist during code review or whenever a name feels forced, and for the chisel technique whenever you're stuck naming something.

## how
A good name doesn't misdirect, doesn't omit, and doesn't assume. It should tell you what you need to know or where to look next, stay consistent with the rest of the codebase, and not require context the reader won't have.

Checklist when figuring out a name:
- Don't misdirect, omit, or assume.
- Make it reflect the essence of the thing — if it's still ugly, improve the code, not the name.
- Make it play nicely with surrounding names (same "world", same terminology, same conventions, e.g. an `is` prefix for booleans, `ensure` for idempotent setup functions).
- Length follows scope: short-lived, small-scope names can be short (a one-letter `u` in a tight lambda is fine); when in doubt, go longer.
- Stick to the terminology and conventions already used in the codebase (don't mix `server`/`backend`).

The "chisel away" technique, for when you're stuck:
1. Write a plain-language comment above the function/variable describing what it is, as if explaining it to a colleague.
2. Chisel that description down to a name, removing pieces until one more cut would lose meaning.
3. If the resulting name is still too complex or confusing, the code behind it is too complex — refactor it.
4. Strip from the comment everything now captured by the name, arguments, and type signature; remove the comment entirely if nothing is left.

Worked example: a function that procures a machine, sets up a Docker worker on it, then starts a job, forced into one name:
```
async function procureFreeMachineAndSetUpTheDockerWorkerThenStartExecutingTheJob (
  machineType, machineRegion,
  workerDockerImage, workerSetupCmd,
  jobDescription
) {
  ...
}
```
The "and"/"then" in the name and the groupable argument prefixes (`machine`, `worker`) signal the function does too much. Split it instead:
```
async function procureFreeMachine (type, region) { ... }
async function setUpDockerWorker (machineId, dockerImage, setupCmd) { ... }
async function startExecutingJob (workerId, jobDescription) { ... }
```

## gotchas
- A name can't be evaluated in isolation — `verifyOrganizationChainCredentials` or even `a` can be great or terrible depending on the surrounding context and story the code tells.
