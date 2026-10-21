---
source: https://jrsinclair.com/articles/2024/how-to-compose-functions-that-take-multiple-parameters-epic-guide/
fetched: 2026-09-11
published: 2024-06-10
status: fresh
---
Only unary functions compose cleanly with `compose()`/`flow()` pipelines. Reach for one of these five techniques when a function you want in a pipeline needs more than one argument, so you can wrap or curry it down to a single parameter without losing the rest of the data.

## how

### Composite data structures
Wrap a multi-arg function so it destructures a single array or object argument instead.

```js
const el = (tag, contents) => `<${tag}>${contents}</${tag}>`;
const elComposable = ([tag, contents]) => el(tag, contents);
// generic helper:
const arrayifyArgs = (fn) => (args) => fn(...args);
```

### Partial application
Fix one argument ahead of time, via a wrapper or `.bind()`, so what's left is unary.

```js
const ul = el.bind(null, 'ul');
const li = el.bind(null, 'li');
```
Put the least-volatile parameter first in your function signature — `.bind()`/currying can only fix from the left.

### Currying
Nest single-argument functions so each call fixes one parameter and returns the next function, until all arguments are supplied.

```js
const elCurried = (tag) => (contents) => `<${tag}>${contents}</${tag}>`;
const listify = compose(el('ul'), join(''), map(el('li')));
```

### Using `ap()` for the get/set problem
Get a value out of an object, transform it, and write the result back in — in one composable step.

```js
const ap = (binaryCurriedFn) => (unaryFn) => (value) =>
  binaryCurriedFn(value)(unaryFn(value));

const getSet = (setter) => (getter) => (transform) =>
  ap(setter)(compose(transform, getter));
```

### Using `flatMap()` for the config problem
Thread the same extra argument (e.g. a shared config object) through several binary curried functions in one pipeline.

```js
const flatMap = (binaryCurriedFn) => (unaryFn) =>
  (x) => binaryCurriedFn(unaryFn(x))(x);

const transformTempObjs = compose(
  flatMap(addTempDiff),
  flatMap(addSensorName),
  addReadableDate
);
```

## gotchas
- With `.bind()` or currying, parameter order matters — fix the argument that changes least, or the technique doesn't help.
- Sprinkling combinators (`ap`, `flatMap`, `flip`) through a codebase can make it harder for teammates to follow; composite data structures alone usually suffice.
