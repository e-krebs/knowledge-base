---
source: https://www.aihero.dev/5-agent-skills-i-use-every-day
fetched: 2026-09-13
published: 2026-03-16
status: fresh
---
Matt Pocock encodes his engineering process as a set of Claude Code agent skills, so that agents without memory still have a strict path to follow every time. Install the kit with `npx skills@latest add mattpocock/skills`, then reach for each skill at its point in the workflow: idea, spec, tickets, implementation, and codebase upkeep.

## grill-me: flesh out an idea
Interviews the user relentlessly about every aspect of a plan, walking each branch of the "design tree" (per Frederick Brooks' *The Design of Design*) and resolving dependencies between decisions one by one — exploring the codebase instead of asking when a question can be answered that way. The skill itself is three sentences long. Run it first, before Claude Code jumps into plan mode and spits out a plan before both sides actually understand each other; a real session can run to 30-50 questions on a complex feature.

## to-spec: from conversation to document
Writes the shared understanding already reached in conversation into a spec (a PRD), grounding it by exploring the repo, sketching the seams where the feature will be tested, and publishing from a template to the issue tracker. It does not interview — that already happened in `/grill-me`. Run it right after the grilling session, once there's a shared understanding to write down. (Formerly named `/to-prd`.)

## to-tickets: breaking the destination into a journey
Takes a spec and turns it into a Kanban board of independently-grabbable tickets: gather context from the conversation or a pointed-at spec, explore the codebase, then draft vertical slices — tracer-bullet tickets that cut through every integration layer rather than one layer at a time — and set blocking relationships between them. Run it after `/to-spec`, especially when several agents will pick up tickets in parallel. (Formerly `/to-issues`.)

## tdd: increasing code quality
Forces a red-green-refactor loop: confirm which interface changes and behaviors need testing, design interfaces for testability, write one test at a time, implement to make it pass, then look for refactoring candidates. It carries philosophy on refactoring, mocking, and what a "deep module" is. Run it during implementation — it's the most consistent lever the author has found for improving agent output, and it works best once the codebase already has large modules with thin interfaces rather than many tiny undifferentiated ones.

## improve-codebase-architecture: making code agent-friendly
Explores the codebase looking for confusions — concepts that require bouncing between many small files, pure functions extracted only for testability while real bugs hide in how they're called, tightly coupled modules creating integration risk — then presents candidates for deepening shallow modules. Run it about once a week, or after a surge of development, since a badly structured codebase makes agent output garbage regardless of the skills layered on top.

## gotchas
- Two of the five have been renamed since first shipping: `/to-prd` → `/to-spec`, `/to-issues` → `/to-tickets`.
- These are 5 of 7 skills in the kit; `grill-with-docs`, `domain-modeling`, and `triage` round out the rest at the same source.
