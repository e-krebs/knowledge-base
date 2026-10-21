---
source: https://stackoverflow.com/questions/57103834/typescript-omit-a-property-from-all-interfaces-in-a-union-but-keep-the-union-s
fetched: 2026-09-10
published: 2019-07-18
status: fresh
---
Reach for this when you need to drop a key from every member of a union type without collapsing the union into its common structure. Plain `Omit<Union, K>` only keeps keys present in *all* members, losing the per-member shape — `DistributiveOmit` preserves each member's distinct fields.

## how
Given:
```typescript
interface A { toRemove: string; key1: "this1"; key2: number; }
interface B { toRemove: string; key1: "this2"; key3: string; }
type C = A | B;
```
`Omit<C, "toRemove">` collapses to `Pick<A|B, "key1">` — it loses `key2` and `key3`.

Top answer (jcalz, 118 votes) — force distribution with a conditional type keyed on `T extends any`:
```typescript
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

type CC = DistributiveOmit<C, "toRemove">;
// type CC = Pick<A, "key1" | "key2"> | Pick<B, "key1" | "key3">
```
`T extends any` (or `T extends unknown`) is what triggers TypeScript to distribute the conditional across each union member.

## gotchas
- `keyof any` can be replaced with `PropertyKey`.
- `T extends T` is not equivalent to how the standard library models it; stay with `T extends any` or `T extends unknown`.
- A second answer restating `Omit` as `Without<T, K>` and applying it per-interface was rejected by the OP — it still requires touching each member manually.
