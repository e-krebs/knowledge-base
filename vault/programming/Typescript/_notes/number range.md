---
source: https://catchts.com/range-numbers
fetched: 2026-09-10
status: fresh
---
A TypeScript recipe for generating a literal union type of numbers (e.g. `0 | 1 | ... | 999`) purely at the type level, using tail-recursive conditional types available since TS 4.5. Reach for it when you need a numeric type bounded to a range — like an RGB channel (0-255) — without hand-writing a giant union.

## how
```ts
type MAXIMUM_ALLOWED_BOUNDARY = 999
type ComputeRange<N extends number, Result extends Array<unknown> = []> =
  Result['length'] extends N ? Result : ComputeRange<N, [...Result, Result['length']]>
// 0, 1, 2 ... 998
type NumberRange = ComputeRange<MAXIMUM_ALLOWED_BOUNDARY>[number]
// bound an RGB channel to 0-255
type Octal = ComputeRange<256>[number]
```

For a range with a min, max and step, add two arrays to sum them, then recurse until past max:
```ts
type Add<A extends number, B extends number> = [...ComputeRange<A>, ...ComputeRange<B>]['length']
type Last<T extends any[]> = T extends [...infer _, infer Last] ? Last extends number ? Last : never : never
type RemoveLast<T extends any[]> = T extends [...infer Rest, infer _] ? Rest : never
type IsLiteralNumber<N> = N extends number ? number extends N ? false : true : false
type IsGreater<A extends number, B extends number> =
  IsLiteralNumber<[...ComputeRange<B>][Last<[...ComputeRange<A>]>]> extends true ? false : true

type AddIteration<
  Min extends number,
  Max extends number,
  ScaleBy extends number,
  Result extends Array<unknown> = [Min]
> = IsGreater<Last<Result>, Max> extends true
  ? RemoveLast<Result>
  : AddIteration<Min, Max, ScaleBy, [...Result, Add<Last<Result>, ScaleBy>]>
// [5, 13, 21, 29, 37]
type Result = AddIteration<5, 40, 8>
```

## gotchas
- Default the recursion's result array to `[Min]`, not `[]` — an empty default hits "Type instantiation is excessively deep and possibly infinite".
- Spread `ComputeRange<B>` as `[...ComputeRange<B>]` rather than passing it bare, to dodge the same excessively-deep error.
- Skip the final `RemoveLast` and the range overshoots by one step past `Max`.
