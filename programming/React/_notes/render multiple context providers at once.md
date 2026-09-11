---
source: https://twitter.com/devongovett/status/1685066633147305984
fetched: 2026-09-11
published: 2023-07-28
status: fresh
---
React Aria Components' `Provider` utility nests multiple context providers from a list of `[Context, value]` pairs, replacing the usual pyramid of nested `<Context.Provider>` elements.

## how
```tsx
<Provider values={[[LabelContext, labelProps], [ButtonContext, buttonProps]]}>{/* ... */}</Provider>
```
```tsx
export function Provider({values, children}) {
  for (let [Context, value] of values) children = <Context.Provider value={value}>{children}</Context.Provider>;
  return children;
}
```
## gotchas
- Code comes from the tweet's image and the linked source at `github.com/adobe/react-spectrum` (commit da38fa0, `packages/react-aria-components/src/utils.tsx`), not the tweet text.
