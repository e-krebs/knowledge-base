---
source: https://nolanlawson.com/2026/05/25/using-ai-to-write-better-code-more-slowly/
fetched: 2026-09-13
published: 2026-05-25
status: stale
---
A PR-review skill that throws several different models at the same diff to find bugs, on the insight that the more different models you run over a PR, the less likely any single one's hallucination survives into the final report. Use it when a PR is complex enough that a solo or single-model review would miss real bugs, not for small changes - it trades review speed for a near-zero false-positive rate, so expect to burn tokens and time rather than ship faster.

## how
The skill (paraphrased): run a Claude sub-agent, Codex, and Cursor Bugbot to find bugs in this PR ranked critical/high/medium/low; once they're all done, review their findings, do your own research to rule out false positives, and write a final report. Don't let the main agent start its own research until every sub-agent has returned, or the first result biases the rest.

Define what counts as a "bug" for the skill: on top of correctness and security, add KISS/DRY violations, inaccessible HTML/JSX, and missing indexes on SQL queries.
Expect a wide severity range in the results, from critical security/correctness bugs down to low-level "this comment is misleading" nits - budget triage time accordingly.

Typical workflow after the report:
- Fix all criticals and highs (with guidance on the right solution), repeat until none remain.
- Skip highs/mediums where the fix isn't worth the effort.
- Abandon the PR if the critical count reveals the whole approach was wrong.

## gotchas
- Opus 4.7 and GPT-5.5, the models the workflow names, are superseded frontier generations as of Sept 2026 (Claude Fable 5.1, GPT-6 Astra/GPT-5.6 Sol); the multi-model review workflow itself still holds.
