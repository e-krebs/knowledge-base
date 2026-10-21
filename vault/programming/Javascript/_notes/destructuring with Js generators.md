---
source: https://macarthur.me/posts/destructuring-with-generators
fetched: 2026-09-11
published: 2023-02-25
status: fresh
---
A generator function can back array destructuring, producing values on demand instead of building a whole array upfront. Reach for this when you need an arbitrary number of items pulled from a lazily-generated source (DOM elements, IDs, anything without a natural fixed count) and don't want to specify how many to generate ahead of time.

## how
Any object with a `Symbol.iterator` works with destructuring, but a generator is the terser way to write one — an infinite loop with `yield` is safe because `yield` pauses execution until the next value is actually pulled:

```js
function* getElements(tagName = 'div') {
  while (true) yield document.createElement(tagName);
}

const [el1, el2, el3] = getElements('div');
// el1, el2, el3 are each a fresh HTMLDivElement
```

Compare to the array-based equivalent this replaces:

```js
function getElements(tagName = 'div', number) {
  return new Array(number).fill(null).map(() => document.createElement(tagName));
}
const [el1, el2, el3] = getElements('div', 3);
```

## gotchas
- The generator version drops the `number` parameter entirely — the function signature gets simpler, and you never generate items you end up not using.
- Destructuring past what a generator yields still works like any iterable: a `done: true` result becomes `undefined` for the remaining variables.
