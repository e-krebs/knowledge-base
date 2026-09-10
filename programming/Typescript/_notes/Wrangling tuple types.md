---
source: https://kyleshevlin.com/wrangling-tuple-types/
fetched: 2026-09-10
published: 2024-01-21
status: fresh
---
TypeScript has no native tuple literal type, so a function returning an array literal (e.g. `[state, handlers]`) is often widened to a non-fixed-length union array, breaking destructuring downstream. Reach for `as const` when a function returns a tuple-shaped array and you want the return type inferred correctly without hand-writing it.

## how
Problem — inferred return is a union array, not a tuple:
```typescript
function useBool(initialValue = false) {
  const [state, setState] = React.useState(initialValue)

  const handlers = React.useMemo(
    () => ({
      on: () => setState(true),
      off: () => setState(false),
      toggle: () => setState(s => !s),
      reset: () => setState(initialValue),
    }),
    [initialValue],
  )

  return [state, handlers]
}
```
Traditional fix — explicit return type annotation. Works, but verbose and brittle: any change to `handlers` requires updating the annotation too.

Recommended fix — append `as const` to the returned array:
```typescript
return [state, handlers] as const
```
`as const` marks the array readonly/immutable, which is enough for TypeScript to infer a proper tuple type with no manual annotation.

## gotchas
- The TC39 tuple proposal is still in development — there's no language-level tuple literal to rely on instead.
