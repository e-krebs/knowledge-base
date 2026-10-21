---
source: https://chrisloy.dev/post/2025/09/28/the-ai-coding-trap
fetched: 2026-09-13
published: 2025-09-28
status: fresh
---
AI coding agents write code far faster than humans, but code-writing was never software delivery's bottleneck - the real work is understanding requirements, testing, and integration, which is why marketing's "10x faster" framing diverges from the roughly 10% productivity gains seen in practice. The fix is to manage AI-driven coding the way a tech lead manages a fast, unpredictable junior engineer: put process around every stage of the SDLC instead of just generating code. Reach for this checklist when a team is scaling up AI-assisted delivery and needs guardrails against the "vibe coding" failure mode.

## how
This treats AI coding agents as junior engineers: fast and tireless, but able to improve only through better context engineering or a new model, never through experience the way a human junior does.
AI-driven engineering (all six practices below) trades some raw speed for sustainability; vibe coding skips them and works until the codebase gets too complex for AI to scale alone.

Bring AI into every stage of the SDLC, not just code generation:
- Specification: explore, analyse, and refine feature specs to cover edge cases and narrow focus.
- Documentation: generate and review docs up front as reusable guardrails and lasting evidence.
- Modular Design: scaffold modular architecture to control context scope and maximise comprehension.
- Test-Driven Development: generate extensive test cases before implementation to guide it and prevent regressions.
- Coding Standards: apply house style and best practice through context engineering.
- Monitoring & Introspection: analyse logs and extract insights faster than a human could.

## gotchas
- Mollycoddling AI the way a tech lead mollycoddles a junior - keeping the hard work for yourself instead of building process - accelerates delivery short-term but hits the same failure wall as vibe coding.
