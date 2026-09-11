---
source: https://allthingssmitty.com/2026/01/12/stop-turning-everything-into-arrays-and-do-less-work-instead/
fetched: 2026-09-11
published: 2026-01-12
status: fresh
---
Iterator helpers are chainable methods (`map`, `filter`, `take`, `drop`, `flatMap`, `find`/`some`/`every`, `reduce`, `toArray`) on iterator objects rather than arrays — call them on `.values()`/`.keys()`/`.entries()` or a generator to build a lazy pipeline that only pulls values as needed. Reach for them over an eager `.filter().map().slice()` chain when you only need the first N results from a large or streamed dataset, since eager array chains allocate a new intermediate array at every step even when most items are discarded.

## how
```js
const visibleItems = items
  .values()
  .filter(isVisible)
  .map(transform)
  .take(10)
  .toArray();
```
Works on async iterables too, for paginated fetches:
```js
async function* fetchPages() {
  let page = 1;
  while (true) {
    const res = await fetch(`/api/items?page=${page++}`);
    if (!res.ok) return;
    yield* await res.json();
  }
}

const firstTen = await fetchPages().filter(isValid).take(10).toArray();
```

## gotchas
- One-shot: once an iterator pipeline is consumed, it can't be reused
- Lazy execution means nothing runs until consumption pulls a value, so side effects (including `console.log`) can appear "missing" or change what runs
- No random access (`items[5]`) — sequential only, so skip these when you need indexing or heavy mutation
- Baseline newly available across Chrome, Firefox and Safari as of March 2025, and still gaining methods (e.g. `Iterator.concat` in 2026)
