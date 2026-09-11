---
source: https://www.totaltypescript.com/forwardref-with-generic-components
fetched: 2026-09-11
status: stale
---
Wrapping a generic component in `forwardRef` breaks TypeScript's type inference on its generic parameter, because `forwardRef`'s own type signature isn't generic-aware. A thin re-typed wrapper around `forwardRef` restores inference without changing runtime behavior.

## how
A generic component like `Table` normally infers `T` from the data passed to it:
```typescript
const Table = <T,>(props: {
  data: T[];
  renderRow: (row: T) => React.ReactNode;
}) => { /* ... */ };
```
Adding a ref parameter and wrapping with `forwardRef` collapses that inference — `row` becomes `unknown`:
```typescript
const Table = <T,>(
  props: { data: T[]; renderRow: (row: T) => React.ReactNode },
  ref: React.ForwardedRef<HTMLTableElement>
) => { /* ... */ };

const ForwardReffedTable = React.forwardRef(Table);
```
The fix is a re-typed `forwardRef` that preserves the generic:
```typescript
function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  return React.forwardRef(render) as any;
}

const ForwardReffedTable = fixedForwardRef(Table);
```

## gotchas
- Applies to React 18 and below: since React 19, `ref` is a plain prop on function components and `forwardRef` is on a deprecation path — replacement: ref as a prop (React 19+), which keeps generic inference with no wrapper needed at all.
