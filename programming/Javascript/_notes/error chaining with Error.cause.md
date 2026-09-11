---
source: https://allthingssmitty.com/2025/11/10/error-chaining-in-javascript-cleaner-debugging-with-error-cause/
fetched: 2026-09-11
published: 2025-11-10
status: fresh
---
The `cause` option on the `Error` constructor (ES2022) lets you wrap a new error around an original one without losing its stack trace or type. Reach for it when re-throwing across a layered call stack (services calling services, wrapper functions) instead of string-concatenating the message or bolting on a custom `.originalError` property.

## how
```js
try {
  try {
    JSON.parse('{ bad json }');
  } catch (err) {
    throw new Error('Something went wrong', { cause: err });
  }
} catch (err) {
  console.error(err.stack);
  console.error('Caused by:', err.cause.stack);
}
```
Custom error classes just forward it via `super`:
```js
class DatabaseError extends Error {
  constructor(message, { cause } = {}) {
    super(message, { cause });
    this.name = 'DatabaseError';
  }
}
```
Walk a multi-layer chain:
```js
function logErrorChain(err, level = 0) {
  if (!err) return;
  console.error(' '.repeat(level * 2) + `${err.name}: ${err.message}`);
  if (err.cause instanceof Error) logErrorChain(err.cause, level + 1);
  else if (err.cause) console.error(' '.repeat((level + 1) * 2) + String(err.cause));
}
```

## gotchas
- `cause` is non-enumerable, so it won't show up in `for...in` or clutter logs unless accessed explicitly
- `console.error(err)` only prints the top-level error — the cause chain isn't shown automatically; log `err.cause` yourself or walk the chain
- TypeScript needs `"target": "es2022"` (and matching `lib`) in tsconfig, or passing `{ cause }` to `Error` is a type error
- Baseline: supported since Chrome 93/Firefox 91/Safari 15 (2021), well past the widely-available threshold, and remains the standard mechanism
