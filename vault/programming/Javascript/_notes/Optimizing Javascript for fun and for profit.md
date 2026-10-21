---
source: https://romgrk.com/posts/optimizing-javascript/
fetched: 2026-09-11
published: 2024-03-21
status: fresh
---
A grab-bag of independent JS performance techniques, mostly about giving V8 (and similar engines) a shape it can specialize for and keeping memory access cheap. None of these are free — the tradeoff is usually readability — so apply them only after benchmarking shows a real hot path, on production-shaped code and data, not isolated microbenchmarks.

## how

### Avoid work
Before optimizing anything, skip work entirely via memoization, laziness, or incremental computation — in React, that's `memo()` / `useMemo()`. The fastest code is code that never runs.

### Avoid string comparisons
`===` on strings is O(n) character comparison, not free — unlike integer comparison. Replace string-based enums with integer enums; TypeScript enums default to integers, so this is close to a free win.

### Avoid different shapes
Engines cache an object's key layout (its "shape") and generate specialized code per shape: monomorphic (1 shape) is fast, megamorphic (5+ shapes) is drastically slower. Keep property order and value types identical across objects passed into the same function — even reordering React props, or later storing a float where an int used to be, changes the shape.

### Avoid array/object methods
`.map/.filter/.reduce` chains and `Object.values/keys/entries` each allocate a fresh array and loop the collection once per call. A single `for` loop does the same work in one pass with no extra allocations to free later.

### Avoid indirection
Proxies, chained `.`/`[]` property access, and function calls each cost more than they look like — Proxy traps in particular tend to fall back from the JIT to the interpreter. Flatten deep access paths (`this.state.circle.center.point.x`) and prefer statically-known function calls the engine can inline.

### Avoid cache misses
CPUs prefetch sequential memory and cache recently used data in L1/L2/L3; random-order access, or a working set bigger than cache, is much slower. Access data sequentially, keep the working set small, and prefer flat `TypedArray`s over arrays of objects for numeric data.

### Avoid large objects
Once an object's shape grows too large, the engine falls back to a hashmap, whose entries are scattered in memory — straight into the cache-miss problem above. Prefer arrays over large ID-keyed objects, and store the ID on each record so `Object.values()` works without indexing back through the key.

### Use eval
`eval()` / `new Function()` can remove JIT-hostile patterns, like building an object with a dynamic key, by compiling a specialized creator function once instead of paying that cost per call. Usual caveats apply: never eval untrusted input, and some environments (CSP-restricted pages) block it outright.

### Use strings, carefully
V8 represents concatenated and sliced strings as pointers into the original bytes — `+` and `.slice()` don't copy. Any mutation (`.trim()`, `.replace()`) forces a copy, so prefer concatenation over mutating methods, and watch for a small slice of a huge string keeping that whole string alive in memory.

### Use specialization
Branch once, ahead of time, on the condition that's usually true for your real data (e.g. "tags are usually empty"), and run a simpler path for that case. Gives moderate gains on top of shape/memory fixes, but re-check it if the usual shape of your data changes.

### Data structures
Picking the right structure beats most micro-optimizations — `Set.has()` beats `Array.includes()` for membership checks, and swapping an array for a linked list took one real case from 5s to 22ms. Learn `Map`/`Set` plus linked lists, priority queues, and trees for cases arrays don't fit.

### Benchmarking
Optimize whatever function dominates total runtime first — anything else wastes effort. Benchmark against production-shaped code and data rather than isolated microbenchmarks (engines specialize differently under real-world polymorphism), and doubt any "100x faster" result until you've tried to disprove it.

### Profiling & tools
Profile in a clean browser profile — extensions, React DevTools included, skew measurements. Browser profilers are sample-based and under-report very short, frequent functions; pair them with the `deoptexplorer-vscode` extension to read V8 deopt logs, or a debug engine build for bytecode-level detail.

## gotchas
- Firefox trails Chromium engines in most of this article's benchmarks — don't treat Firefox numbers as representative of engines generally.
- Micro-benchmarks (including the ones here) can mislead; validate any win against real, production-shaped code before keeping it.
