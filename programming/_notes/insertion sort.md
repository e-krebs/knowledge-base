---
source: https://kyleshevlin.com/algorithms-insertion-sort
fetched: 2026-09-13
published: 2023-01-22
status: fresh
---
Insertion sort treats a growing prefix of the array as already sorted and inserts each new item into its correct spot in that prefix, splicing it out of its old position and back in at the new one. It avoids the wasted late-stage comparisons that bubble sort makes, since the sorted portion is never re-scanned once built.

## how
- Treat the first item as a sorted list of one.
- Starting from the second item, loop through the rest of the array.
- For each item, loop through the sorted portion so far and compare.
- When the outer item is less than an inner item, splice it out of its current position and splice it back in at the inner position.

```js
function insertionSort(items) {
  let i
  let j

  for (i = 1; i < items.length; i++) {
    for (j = 0; j < i; j++) {
      if (items[i] < items[j]) {
        const [item] = items.splice(i, 1)
        items.splice(j, 0, item)
      }
    }
  }

  return items
}
```

## gotchas
- The page gives no formal complexity notation, only an empirical comparison: in testing, insertion sort made roughly half as many comparisons as bubble sort on the same shuffled arrays.
- V8 uses insertion sort internally for `Array.prototype.sort()` on arrays of 10 or fewer elements, so it's still a reasonable choice for small arrays.
