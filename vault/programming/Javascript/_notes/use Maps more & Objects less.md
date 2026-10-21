---
source: https://www.builder.io/blog/maps
fetched: 2026-09-11
published: 2023-02-08
status: fresh
---
Plain objects are fine for fixed-shape data, but for a hashmap that gains and loses keys at runtime, a `Map` is faster and avoids a set of object-specific footguns. Reach for `Map`/`Set` (and their `Weak-` variants) whenever keys are dynamic, arbitrary-typed, or need to avoid leaking memory; keep plain objects for records with a known, stable set of keys.

## why Map over Object
- **Delete performance**: `delete` on an object breaks the JS engine's hidden-class/shape optimization and is notoriously slow; `Map.delete()` is built for exactly this churn.
- **No built-in-keys pollution**: a plain object inherits `valueOf`, `toString`, `hasOwnProperty`, etc., so naive iteration or lookups can collide with them. A `Map` starts genuinely empty.
- **Clean iteration**: objects need `for...in` + `hasOwnProperty` guards, `Object.hasOwn`, or `Object.entries().forEach`; a `Map` iterates directly with destructuring:
  ```js
  for (const [key, value] of myMap) {
    // clean
  }
  ```
- **Key ordering & destructuring**: Maps preserve insertion order of keys, which enables things like an O(1) LRU cache.
- **Any key type**: Map keys aren't coerced to strings (object keys are), and can be any type at all — objects, DOM nodes, functions — useful for attaching metadata to a value without mutating it.

## converting between them
```js
const myMap = new Map(Object.entries(myObj))          // object -> map
const makeMap = <V = unknown>(obj: Record<string, V>) =>
  new Map<string, V>(Object.entries(obj))              // typed helper
```

## WeakMap / WeakSet for metadata
Holding extra state in a regular `Map` keyed by an object reference prevents that object from ever being garbage collected. Use `WeakMap`/`WeakSet` instead — they hold a weak reference, so the entry disappears once nothing else references the key:
```js
const metadata = new WeakMap()
metadata.set(myTodo, { focused: true }) // no leak
```

## serializing Map/Set with JSON
`JSON.stringify`/`parse` support custom types via the replacer/reviver arguments; tag values so both sides round-trip correctly when objects and maps/sets are mixed in the same tree:
```js
function replacer(key, value) {
  if (value instanceof Map) return { __type: 'Map', value: Object.fromEntries(value) }
  if (value instanceof Set) return { __type: 'Set', value: Array.from(value) }
  return value
}
function reviver(key, value) {
  if (value?.__type === 'Set') return new Set(value.value)
  if (value?.__type === 'Map') return new Map(Object.entries(value.value))
  return value
}
```

## when to use what
```js
// Structured, fixed-shape data -> Object
const event = { title: 'Conf', date: new Date() }
// Dynamic hashmap -> Map
const eventsMap = new Map(); eventsMap.set(event.id, event)
// Ordered list, duplicates allowed -> Array
const myArray = [1, 2, 3, 2, 1]
// Unordered unique list -> Set
const set = new Set([1, 2, 3])
```

## gotchas
- Benchmarks here are micro-benchmarks (Chrome v109) — the article itself says to verify on real production code, not take them at face value.
