---
source: https://addyo.substack.com/p/applied-software-engineering-at-google
fetched: 2026-09-13
published: 2025-03-06
status: fresh
---
Distills "Software Engineering at Google" into practices any team, not just Google-scale ones, can adopt. Reach for this list when setting up or auditing an engineering culture — testing, review, docs, dependencies, rollouts, incidents, tech debt, and psychological safety — rather than copying Google's tooling wholesale.

## how
- **Testing culture**: test what matters first, not 100% coverage overnight (Pareto: ~20% of code carries ~80% of risk). Write tests before/alongside code (TDD or test-along). Automate execution via CI on every change. Favor the test pyramid: many fast unit tests, fewer brittle E2E tests (SWEG suggests roughly 80% unit / 20% broader-scoped).
- **Code review**: require pre-merge review, no exceptions. Keep changes small — smaller diffs are easier to review, understand, and test, and reduce bug risk. Treat review as mentorship, not gatekeeping. Aim for turnaround within 24 hours so it doesn't block flow.
- **Documentation**: write it alongside the code, not after. Explain the *why* behind decisions, not just the *what*. Store docs next to the code (e.g. Markdown in-repo). Review and maintain docs with the same rigor as code — outdated docs are worse than none.
- **Knowledge sharing**: write design docs for significant changes and review them for early feedback. Run blameless postmortems focused on systemic causes, not blame. Hold regular internal tech talks or informal sessions to spread expertise and keep a searchable, centralized knowledge base.
- **Dependency management**: be deliberate before adding a dependency (security, licensing, maintenance cost). Pin versions with SemVer and explicit declarations. Regularly audit with tools like `npm audit` or Dependabot. Vendor critical dependencies when availability matters.
- **Progressive rollouts & feature flags**: ship to a small percentage of users first, then widen while watching metrics. Gate features by configuration, not by deploy. Automate rollback so a bad flag is cheap to reverse.
- **Incident response**: assign clear incident-commander and communicator roles. Log everything — what happened, decisions made, actions taken. Run blameless postmortems and track action items through to completion.
- **Technical debt**: make debt visible (issue trackers, dedicated tooling) instead of letting it stay implicit. Allocate recurring time for it rather than only shipping features. Prefer incremental refactors over big-bang rewrites.
- **Psychological safety**: Google's Project Aristotle found it the top predictor of team effectiveness. Build it by normalizing dissent, admitting mistakes as a leader, and running structured, regular feedback loops.

## gotchas
- The article's 2025 AI-assistance section is left out because it aged (freshness-a.json).
