---
source: https://lihautan.com/extract-parameters-type-from-string-literal-types-with-typescript
fetched: 2026-09-10
published: 2022-03-27
status: fresh
---
A template-literal-type recipe that derives a route handler's `params` type straight from the route string itself (e.g. `/purchase/[shopid]/[itemid]/args/[...args]`), so the handler needs no hand-written matching type. Reach for it when building a typesafe router and you want parameter names — and whether one is a rest param — to fall out of the path string.

## how
Split the path into parts, keep only the bracketed ones, then map them into an object type: numbers by default, `string[]` for a `...rest` param.
```typescript
type IsParameter<Part> = Part extends `[${infer ParamName}]` ? ParamName : never;

type FilteredParts<Path> = Path extends `${infer PartA}/${infer PartB}`
  ? IsParameter<PartA> | FilteredParts<PartB>
  : IsParameter<Path>;

type ParamValue<Key> = Key extends `...${infer Anything}` ? string[] : number;

type RemovePrefixDots<Key> = Key extends `...${infer Name}` ? Name : Key;

type Params<Path> = {
  [Key in FilteredParts<Path> as RemovePrefixDots<Key>]: ParamValue<Key>;
};

type CallbackFn<Path> = (req: { params: Params<Path> }) => void;

function get<Path extends string>(path: Path, callback: CallbackFn<Path>) {
  // implementation
}
```
Given `app.get('/purchase/[shopid]/[itemid]/args/[...args]', (req) => {...})`, `req.params` infers as `{ shopid: number; itemid: number; args: string[] }`.

Relies on template literal types plus `infer` for the conditional extraction, and mapped-type key remapping (`as`) to strip the `...` prefix off rest-param names.
