---
source: https://romgrk.com/posts/react-fast-memo/
fetched: 2026-09-11
published: 2024-03-08
status: fresh
---
`React.memo`'s built-in shallow-compare allocates two key arrays per call (via `Object.keys`) and runs checks that a generic "shallow equals" needs but a props comparator doesn't. When you're memoizing something in a hot path and control the shape of the props (no reliance on `'key' in props` or exotic prototypes), a hand-written comparator that iterates keys with `for...in` and counts instead of early-returning benchmarks noticeably faster than React's default. Reach for it only in that kind of hot path — for most components the default comparator is fine.

## how
```js
export function fastCompare(a, b) {
  if (a === b) {
    return true;
  }
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }

  let aLength = 0;
  let bLength = 0;

  for (const key in a) {
    aLength += 1;

    if (!Object.is(a[key], b[key])) {
      return false;
    }
    if (!(key in b)) {
      return false;
    }
  }

  for (const _ in b) {
    bLength += 1;
  }

  return aLength === bLength;
}
```
Pass it as the second argument: `React.memo(Component, fastCompare)`. Counting `b`'s keys in a second loop instead of comparing `a[key]` against `b[key]` there avoids touching `a`'s values a second time, which is the expensive part.

## gotchas
- An `fastCompareUnsafe` variant exists that drops the `instanceof`/null prelude and the `key in b` check for even more speed, but it's only correct when props never rely on the `'key' in props` pattern — and on JavaScriptCore it's actually slower than the safe version.
