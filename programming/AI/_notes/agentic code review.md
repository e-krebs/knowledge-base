---
source: https://www.oreilly.com/radar/agentic-code-review/
fetched: 2026-09-13
published: 2026-06-26
status: fresh
---
As agents made writing code cheap, the bottleneck moved downstream to deciding whether to trust it, so review needs to be tiered by blast radius rather than applied uniformly to every PR. Reach for this checklist when deciding how much human and AI review a given change needs — a solo weekend project and a decade-old system serving many users are not solving the same problem.

## how
**Size up the blast radius.** Three variables set how much review a change needs: what breaks if it's wrong, how long the code will live, and how many people need to understand it.

**Tier by risk, not by author.** A config change earns a linter and a glance. A payments path earns the full stack: types, tests, two differently-built AI reviewers, a human who owns that system, and a security pass.

**Fast-fail the expensive tail.** Agents are good at small, well-defined changes — around 28% of agent PRs merge almost instantly — but tend to "ghost" the moment they get subjective feedback. Build a circuit breaker that predicts high-maintenance PRs from cheap signals (file types, patch size) before a human looks, so no one sinks an hour into a change the agent will abandon.

**Raise the bar for what you'll even review.** Require, before review: a statement of what the change is for, a diff that isn't thousands of lines with no comments, the test output, and proof the tests were actually run. This pushes intent-reconstruction work back onto whoever submitted the change, where it's cheap.

**Keep PRs small, deliberately.** Reviewer engagement is one of the strongest predictors that a PR merges at all; a large, unreviewable PR gets rejected outright or rubber-stamped. Instruct agents to produce small commits.

**Read the test changes before the code.** Watch for the failure mode where an agent changes behavior, then "fixes" the test by rewriting the assertion to match the new, broken behavior. Treat any diff that rewrites many tests as a flag, and reach for mutation testing — coverage only proves a line ran, not that a wrong value would be caught.

**Treat CI as the wall that doesn't move.** Watch for removed tests, skipped lint, lowered coverage thresholds, a duplicated helper that already exists elsewhere, and untrusted input flowing into a prompt (a fresh source of injection that isn't visible in the diff itself).

**A human owns the merge.** Treat every AI review as a sensor, not a verdict. A model can't be paged at 3am, so whoever clicks merge is accountable for what shipped.

## gotchas
- This whole checklist scales with blast radius: solo, with no users, tiering + the test-change discipline + CI is most of what's needed — the rest is overhead until people show up.
