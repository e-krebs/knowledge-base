---
source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
fetched: 2026-09-14
status: fresh
---
`Object.groupBy(items, callbackFn)` groups elements of an iterable into a plain object keyed by the string or symbol the callback returns, one array per group. `Map.groupBy()` does the same but returns a `Map`, so the callback can use any value, including an object, as the group key, which is useful when the key may change over time. Reach for `Object.groupBy()` when group names fit as strings, and `Map.groupBy()` when you need arbitrary values, especially objects, as keys.

## how
```js
Object.groupBy(items, callbackFn)
Map.groupBy(items, callbackFn)
```

```js
const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 0 },
  { name: "cherries", type: "fruit", quantity: 5 },
];

const result = Object.groupBy(inventory, ({ type }) => type);
// { vegetables: [...], fruit: [...] }
```

```js
const restock = { restock: true };
const sufficient = { restock: false };
const result = Map.groupBy(inventory, ({ quantity }) =>
  quantity < 6 ? restock : sufficient,
);
result.get(restock); // [{ name: "bananas", type: "fruit", quantity: 0 }]
```

## gotchas
- `Object.groupBy()` returns a null-prototype object, not a plain object.
- Both callbacks are called with `(element, index)`.
- `Map.groupBy()` lets the callback return any value, including an object, as the group key.
- A `Map.groupBy()` result can only be looked up with the exact key object originally used, not a lookalike with the same shape.
- `items` must be an iterable, such as an `Array`.
- The grouped elements are the original ones, not deep copies, so a change shows in both places.
- Early browser builds shipped these as `Array.prototype.group()` and `groupToMap()`, dropped for web compatibility.
- Baseline widely available since 2026-09-05 for both methods.
