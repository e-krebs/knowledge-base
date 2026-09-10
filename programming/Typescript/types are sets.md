---
source: https://www.rob.directory/blog/a-different-way-to-think-about-typescript
fetched: 2026-09-10
published: 2024-07-27
status: fresh
---
A mental model for TypeScript: treat every type as the (possibly infinite) set of values assignable to it, and TypeScript itself as a functional language that operates on those sets. Reach for this framing when an "advanced" type-level feature — intersections, `extends`, `infer`, mapped types, recursion — feels like a special case; restated as a set operation, it usually isn't.

## how
- `string` is the set of all strings, `number` the set of all numbers — structural typing falls out of checking set membership.
- **Intersection (`&`)**: `{ x: number } & { y: number }` is the set of objects satisfying both constraints, not "field overlap" — `{ y: number }` already means "at least a `y` property."
- **Union (`|`)**: plain set union — `{ x: number } | { y: number }` is the set containing either shape.
- **`extends`**: a subset check, returning a new set for the true/false branch. On a union input, `extends` distributes over each member individually rather than checking the union as a whole; wrap it in a tuple (`[T]`) to suppress that.
- **`infer`**: extracts a type out of a matched pattern, e.g. pulling `number` out of `Array<number>`.
- **Mapped types** iterate a set to build an object:
```typescript
type SetToMapOver = "string" | "bar";
type Foo = { [K in SetToMapOver]: K };
// -> { string: "string"; bar: "bar" }
```
- The type system is Turing-complete, so recursive conditional types can do real work — e.g. capitalizing every word in a sentence type:
```typescript
type FirstLetterUppercase<T extends string> =
  T extends `${infer R}${infer RestWord} ${infer RestSentence}`
    ? `${Uppercase<R>}${RestWord} ${FirstLetterUppercase<RestSentence>}`
    : T extends `${infer R}${infer RestWord}`
    ? `${Uppercase<R>}${RestWord}`
    : never;
```

## gotchas
- `extends` on a union distributes over each member rather than checking the union as a whole — wrap it in `[T]` to check the union itself.
