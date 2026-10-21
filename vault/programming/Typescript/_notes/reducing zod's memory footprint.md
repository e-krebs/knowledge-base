---
source: https://zod.dev/blog/reducing-memory-footprint
fetched: 2026-09-10
published: 2026-08-26
status: fresh
---
Zod 4.5 cuts schema memory use by an order of magnitude via "method memoization." Reach for this when you're instantiating many Zod schemas (large `z.object`/`z.union` trees, per-request validation) and memory is a concern — a basic `z.string()` schema drops from 7.5kb to 784 bytes (9.8x smaller).

## how
The problem: Zod's auto-bound methods (so `const { parse } = z.string()` keeps working) used to be bound closures stored as own properties on every instance, so instances couldn't share methods via the prototype chain.

The fix — methods become getters on the shared prototype:
1. Methods are defined as getters on the standard prototype.
2. On first access, the getter returns a bound method and assigns it as an own property on the instance.
3. Subsequent accesses resolve directly from the own property, skipping the getter.
4. Unused methods are never materialized at all.

Results:
- `z.string()`: 7.5kb -> 784b (9.8x smaller)
- `z.object({...})` with 10 keys: 82.0kb -> 11.0kb (7.5x smaller)
- `z.union([...])` with 2 options: 17.5kb -> 2.1kb (8.3x smaller)

V8 uses tiered backing stores for object properties (<13 props = 128 bytes, 13+ = 848 bytes, 21+ = 1,616 bytes). Older Zod versions created 49 own properties per string schema, forcing the largest tier; the new approach keeps only six eager properties, with the rest resolved lazily off the memoizing prototype.

