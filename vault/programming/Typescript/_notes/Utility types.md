---
source: https://www.builder.io/blog/utility-types
fetched: 2026-09-13
published: 2023-02-03
status: fresh
---
TypeScript ships a set of built-in utility types that derive a new type from an existing one instead of retyping it by hand — useful whenever a package doesn't export the exact type you need, or a value's shape needs a small transformation (optional, readonly, subset, pulled from a function signature). This is a cheat sheet of the common ones and when to reach for each.

## how
General:
- When `Promise<T>` → `Awaited<T>`
- When `T | null | undefined` → `NonNullable<T>`
- Make properties optional → `Partial<T>`
- Make properties mandatory → `Required<T>`
Subset — interface/type (`interface { name: string, age: number }`):
- Get certain keys → `Pick<T, 'name'>`
- Omit certain keys → `Omit<T, 'age'>`
Subset — union (`type License = 'DC' | 'Marvel'`):
- Get value from union → `Extract<License, 'DC'>`
- Omit value from union → `Exclude<License, 'Marvel'>`
Function & class:
- Get function parameters → `Parameters<typeof function>`
- Get class constructor parameters → `ConstructorParameters<Class>`
- Get class instance type → `InstanceType<typeof Class>`
Readonly / DeepReadonly:
- Force non-modifiable (top-level only) → `Readonly<T>`
- Force non-modifiable, nested too → hand-rolled `DeepReadonly<T>`:
```ts
export type DeepReadonly<T> =
  T extends Primitive ? T :
  T extends Array<infer U> ? DeepReadonlyArray<U> :
  DeepReadonlyObject<T>
type Primitive =
  string | number | boolean | undefined | null
interface DeepReadonlyArray<T>
  extends ReadonlyArray<DeepReadonly<T>> {}
type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}
```

## gotchas
- `Readonly<T>` only applies to top-level properties — nested objects and arrays are still mutable through it.
- `NoInfer<T>` (TypeScript 5.4) is the only built-in utility type added since this article.
