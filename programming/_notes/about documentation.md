---
source: https://newsletter.posthog.com/p/what-nobody-tells-developers-about
fetched: 2026-09-13
published: 2025-04-17
status: fresh
---
A five-point checklist for writing developer docs as a busy engineer rather than a technical writer. Reach for it when starting a docs page from scratch, or when existing docs feel bloated, abstract, or stale.

## how
1. **Start from the start** — write the most basic, obvious doc that gets a user from "nothing" to "something" (what would you send a friend to get them going?). Don't wait for full coverage.

2. **Iterate, don't polish once** — a first draft isn't the final doc; improve it repeatedly using feedback signals: most-viewed pages, session replays of docs usage, comments/questions, support and GitHub issues, and page-helpful votes.

3. **Respect the reader's time** — readers are task-focused, not leisurely. Lead with the key info, use subheadings and short paragraphs (3-4 lines), use lists, hide secondary detail behind `<details>` tags, and add code samples/screenshots/diagrams.

4. **Favor examples over abstractions** — readers care that the problem is solved, not how internally; show a JSON structure instead of describing a data type, a screenshot instead of describing a UI, a diagram instead of narrating a workflow. Explain the underlying abstraction only when decision-makers ask "why", when the same concept keeps needing re-explaining internally, or when support/sales are tired of repeating it.

5. **Treat docs as a product** — focus on users (talk to them, build an ICP), prioritize by analytics/replays instead of guessing, invest in design/navigability, assign clear ownership, and let culture (e.g. bias for action) shape how docs get written.

## gotchas
- Exemplars the source points to: Stripe (interactive elements, product-connected examples), Tailwind (progressively layered concepts, dense per-class examples), Astro (step-by-step install/getting-started), HTMX (single-page skim/searchability), ClickHouse (comprehensive reference + function explanations).
