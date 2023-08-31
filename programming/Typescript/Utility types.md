> extract from [this article](https://www.builder.io/blog/utility-types)

## General stuff
When Promise → `Awaited<T>`
When `T | null | undefined` → `NonNullable<T>`
Make properties optional → `Partial<T>`
Make properties mandatory → `Required<T>`

## Subset
### Interface / Type
`interface { name: string, age: number }`
Get certain keys → `Pick<T, 'name'>`
Omit certain keys → `Omit<T, 'age'>`

### Union
`type License = 'DC' | 'Marvel'`
Get value from union → `Extract<License, 'DC'>`
Omit value from union → `Exclude<License, 'Marvel'>`

## Function & Class
Get function parameters → `Parameters<typeof function>`
Get class constructor parameters → `ConstructorParameters<Class>`
Get class type → `InstanceType<typeof Class>`

## Readonly / DeepReadonly
to force non-modifiable → `Readonly<T>`
> ⚠️ only applies to top-level properties

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
