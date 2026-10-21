---
source: https://julesblom.com/writing/running-promises-in-parallel
fetched: 2026-09-11
published: 2023-05-25
status: fresh
---
`Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any` are the four static methods for running independent async tasks concurrently instead of awaiting them one by one in a loop. They split along two axes — whether they fail fast on the first rejection, and whether they resolve with a single value or with every result — so picking the right one depends on whether you need all results and whether one failure should abort the rest.

## how
- **Promise.all** — fails fast, returns all. Resolves with an array of fulfillment values once every promise fulfills; rejects immediately with the first rejection reason. Use when all results are required to proceed, e.g. fetching everything needed to render a page.
- **Promise.allSettled** — does not fail fast, returns all. Always resolves (never rejects), with an array of per-promise outcome objects. Use when partial failure is acceptable, e.g. each result renders into its own independent panel.
- **Promise.race** — fails fast, returns single. Settles with whichever promise settles first, fulfilled or rejected. Its main real use case is racing a task against a timeout/"sleep" promise to short-circuit it.
- **Promise.any** — does not fail fast, returns single. Fulfills with the first promise to fulfill, ignoring rejections; only rejects, with an `AggregateError`, if every promise rejects. Use for reading from redundant sources (cache vs. server) and taking the fastest, or for checking that at least one of several health endpoints responds.

## gotchas
- This is concurrency, not true parallelism — JavaScript is single-threaded; only Worker threads give real parallel execution.
- Awaiting promises sequentially instead of using one of these four combinators is the common mistake that silently serializes independent work; ESLint's `no-await-in-loop` rule catches it.
