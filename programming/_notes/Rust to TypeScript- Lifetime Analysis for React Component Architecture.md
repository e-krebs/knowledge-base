---
source: https://valand.dev/blog/post/from-rust-to-typescript-lifetime-analysis
fetched: 2026-09-13
published: 2022-01-26
status: fresh
---
Borrows Rust's ownership/lifetime analysis as a heuristic for deciding which React component should own a given piece of state. Reach for it when two or more components need the same plain object and it's unclear who should hold it — the analysis turns that architectural call into a table instead of a debate.

## how
Ask three questions per pair of related objects (a React component and a plain value, or two components):
1. Compare object-A's lifetime to object-B's lifetime: longer, equal, or shorter? (`lifetime-A [> / < / =] lifetime-B`)
2. If A's lifetime > B's lifetime: compare A's lifetime to B's constructor's lifetime — can two or more B relate to one A ("has many" vs "has one")?
3. If two or more B relate to one A, is that happening at the same time (parallel) or not (sequential)?

Build an owner/ownee table for every component-object pair, e.g. for a Channel Page + Edit Modal:

| Owner (React component) | Lifetime Relationship | Ownee (Ownable plain object) |
| --- | --- | --- |
| Channel Page | = | isModalOpen |
| Channel Page | = | currentSubscriptions |
| Channel Page | > | filter |
| Edit Modal | < | isModalOpen |
| Edit Modal | = | filter |

Notes on the relationship column:
- `=` (lives equally long): the owner needs the ownee to exist in order to operate.
- `>` (lives longer): the owner does not need the ownee to exist to operate.
- `<` (lives shorter): the ownee needs to exist for the owner to exist/be determined — mark these unusable.

Then process the table: drop every `<` row as unusable, and keep only the `=` rows — those are the owner-ownee pairs to actually implement. Rows where the same object shows up as `=` under two different owners are a dupe: resolve by sharing one reference, letting one owner pass a copy down, or having the other owner acquire its own copy.

## gotchas
- Only `=` pairs get used; `>` and `<` rows exist only to be filtered out, not implemented.
- A dupe `=` row (two owners, one object) still needs an explicit choice — shared reference, copy passed down, or independent acquisition — the table doesn't pick one for you.
- The heuristic is manual and doesn't account for concurrent operations beyond a simple parallel/sequential check; the author calls it "an extremely simplified version" of Rust's real lifetime analysis.
