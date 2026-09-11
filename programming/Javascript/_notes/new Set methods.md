---
source: https://web.dev/blog/set-methods
fetched: 2026-09-11
published: 2024-06-26
status: fresh
---
The JavaScript `Set` prototype now has built-in set-algebra methods, so reach for these instead of hand-rolling intersection/union/difference logic with `Array.filter`/`includes` loops over a set's members.

## how

```js
const odds = new Set([1, 3, 5, 7, 9]);
const squares = new Set([1, 4, 9]);
const evens = new Set([2, 4, 6, 8]);

odds.intersection(squares);        // Set(2) { 1, 9 } - in both
evens.union(squares);              // Set(6) { 2, 4, 6, 8, 1, 9 } - in either
odds.difference(squares);          // Set(3) { 3, 5, 7 } - in odds, not squares
evens.symmetricDifference(squares); // Set(5) { 2, 6, 8, 1, 9 } - in either, not both

const fours = new Set([4, 8, 12, 16]);
const evens2 = new Set([2, 4, 6, 8, 10, 12, 14, 16, 18]);
fours.isSubsetOf(evens2);   // true - every element of fours is in evens2
evens2.isSupersetOf(fours); // true - every element of fours is in evens2

const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
primes.isDisjointFrom(new Set([1, 4, 9, 16])); // true - no elements in common
```
