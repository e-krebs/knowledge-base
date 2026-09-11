---
source: https://allthingssmitty.com/2025/09/08/finally-safe-array-methods-in-javascript/
fetched: 2026-09-11
published: 2025-09-08
status: fresh
---
`toSorted()`, `toReversed()`, and `toSpliced()` are ES2023 array methods that return a modified copy instead of mutating the array in place. Reach for them anywhere you'd normally use `.sort()`, `.reverse()`, or `.splice()` but need the original array left untouched — most notably with React or other state that relies on immutability to trigger updates.

## how
```js
const numbers = [3, 1, 2];
const sorted = numbers.toSorted();
console.log(sorted);  // [1, 2, 3]
console.log(numbers); // [3, 1, 2] — original untouched

const names = ['Kristen', 'David', 'Ben'];
console.log(names.toReversed()); // ['Ben', 'David', 'Kristen']

const items = ['a', 'b', 'c', 'd'];
console.log(items.toSpliced(1, 1));      // ['a', 'c', 'd']    — remove
console.log(items.toSpliced(2, 0, 'x')); // ['a', 'b', 'x', 'c', 'd'] — insert
```
`toSorted()` also takes a custom compare function, same as `.sort()`. In React, prefer these over mutating state directly:
```js
// ✅ Using toSorted (good)
const sortedItems = state.items.toSorted();
setState({ items: sortedItems }); // triggers re-render
```

## gotchas
- Baseline widely available since all engines shipped these methods by July 2023, well past three years ago — no polyfill needed in modern targets
