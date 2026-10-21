---
source: https://addyo.substack.com/p/leading-effective-engineering-teams-c9b
fetched: 2026-09-13
published: 2025-03-19
status: fresh
---
A leadership playbook for running an engineering team once AI writes a meaningful share of the code: the leader's job shifts from hands-on code oversight to setting direction, upskilling the team, and enforcing verification. Reach for it when defining team-wide norms for AI-assisted work, not when reviewing a single PR.

## how
- Treat AI output as a junior engineer's first draft - "trust but verify": review and test every AI-generated change with the same rigor as human-written code.
- Plan for the "70% problem": AI gets a task most of the way fast, but edge cases, integration, and performance tuning still take about as much human effort as writing it from scratch - budget for that when estimating.
- Watch the "knowledge paradox": AI accelerates engineers who can already judge its output, but can let juniors accept wrong solutions they can't debug - pair juniors with a senior who reviews the AI's suggestions in real time, not just the final diff.
- Upskill deliberately: build baseline AI literacy for everyone, run mentorship/"AI buddy" pairings, and rotate people onto work AI can't do (talking to stakeholders, writing design docs) so core skills don't erode.
- Keep humans accountable: an AI-introduced bug is still the team's bug; treat "the AI did it" as a process failure to fix in the post-mortem, not an excuse.
- Write explicit policies before an incident forces one: what data can go into an AI tool, which code paths are off-limits to AI (security-critical, regulatory logic), and when an AI-heavy PR needs an extra review sign-off.
- Measure impact beyond speed: track code quality, maintainability, and knowledge retention alongside delivery velocity, so AI gains don't quietly become tech debt.
- Foster a growth mindset: celebrate wins that used AI well, and treat a failed AI suggestion as a blameless learning moment, not grounds for a blame culture.
- Address job-displacement fears directly, with data: AI is reshaping which skills matter, not eliminating headcount - let that framing come from you before speculation fills the gap.

## gotchas
- The tools and models the article treats as current (Cursor, Windsurf, Cline, Claude Sonnet 3.5/3.7) are two generations behind as of the September 2026 freshness check; the leadership advice itself still holds.
