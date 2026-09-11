---
source: https://allthingssmitty.com/2025/07/14/modern-async-iteration-in-javascript-with-array-fromasync/
fetched: 2026-09-11
published: 2025-07-14
status: fresh
---
`Array.fromAsync()` converts an async (or sync) iterable into an array, resolving to the result as a promise. Reach for it instead of a manual `for await...of` accumulation loop when collecting items from an async generator, paginated API, or a Web Stream.

## how

```js
Array.fromAsync(source[, mapFn[, thisArg]]) // Returns a Promise<Array>

async function* generateNumbers() {
  yield 1; yield 2; yield 3;
}

// plain collection
await Array.fromAsync(generateNumbers()); // [1, 2, 3]

// with a (sync or async) mapping function
await Array.fromAsync(generateNumbers(), x => x * 2); // [2, 4, 6]
await Array.fromAsync(generateNumbers(), async x => x * 10); // [10, 20, 30]
```

It also collects a Web Stream once wrapped in an async generator (`reader.read()` in a loop), and replaces manual `for await...of` accumulation or paginated-fetch loops with one line.

Errors thrown during iteration or mapping (sync or async) propagate normally — wrap the call in `try...catch`.

## gotchas
- Supported in Chrome 121+, Firefox 115+, Safari 16.4+, Edge 121+, and Node 22+, and as of today has crossed into Baseline widely available.
