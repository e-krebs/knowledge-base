---
source: https://web.archive.org/web/20260506175608/https://2ality.com/2024/06/ecmascript-2024.html
fetched: 2026-09-11
published: 2024-06-26
status: stale
---
ECMAScript 2024 (approved 26 June 2024) added a handful of small but broadly useful language features. Reach for `Map.groupBy`/`Object.groupBy` to bucket an iterable by a computed key, and for the others when the specific problem (async promise creation, Unicode regex sets, resizable buffers, string well-formedness, async shared-memory waits) comes up.

## how

### Grouping synchronous iterables
`Map.groupBy()` groups items into `Map` entries keyed by a callback; `Object.groupBy()` does the same into a plain object.

```js
Map.groupBy([0, -5, 3, -4, 8, 9], x => Math.sign(x));
// Map { 0 → [0], -1 → [-5,-4], 1 → [3,8,9] }

Object.groupBy([0, -5, 3, -4, 8, 9], x => Math.sign(x));
// { '0': [0], '-1': [-5,-4], '1': [3,8,9], __proto__: null }
```

### `Promise.withResolvers()`
Creates a promise together with its `resolve`/`reject` functions in one call, instead of capturing them from inside the executor.

```js
const { promise, resolve, reject } = Promise.withResolvers();
```

### Regular expression flag `/v`
`.unicodeSets` mode adds Unicode string-property escapes, `\q{}` string literals in character classes, and set operations (union/difference) between character classes.

```js
/^\p{RGI_Emoji}$/v.test('😵‍💫');      // true
/^[\q{abc|def}]$/v.test('abc');              // true
/^[\w--[a-g]]$/v.test('a');                  // false
```

### ArrayBuffer / SharedArrayBuffer resizing
`ArrayBuffer`s can now be created resizable and resized in place, and gain a `.transfer()` method. `SharedArrayBuffer`s can grow (never shrink) but aren't transferable.

```js
const buf = new ArrayBuffer(2, { maxByteLength: 4 });
buf.resize(4);
```

### Well-formed strings
`String.prototype.isWellFormed()` checks a string has no lone UTF-16 surrogates; `.toWellFormed()` returns a copy with lone surrogates replaced by U+FFFD.

### `Atomics.waitAsync()`
Waits asynchronously for a change to shared memory.

## gotchas
- `Atomics.waitAsync()` only reached full three-engine support once Firefox shipped it in Firefox 145 (2026) — at this article's June 2024 publish date, Firefox didn't yet support it.
