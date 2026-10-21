---
source: https://tkdodo.eu/blog/the-uphill-battle-of-memoization
fetched: 2026-09-11
published: 2023-09-30
status: stale
---
`React.memo` skips re-rendering a component when its props are unchanged (compared per-prop with `Object.is`), but that check is easy to defeat by accident as a component evolves — a new prop, an inline object/array/function, or `children` all silently break it. Composition (moving state down, or lifting content up so it's passed as `children`) sidesteps the problem entirely; when composition genuinely isn't possible, pulling the shared state into an external store is a more durable fallback than sprinkling `memo`/`useMemo` everywhere.

## how

### Object/array/function props break memo
```jsx
function ExpensiveComponent({ style }) {
  return <div style={style}>I'm expensive!</div>;
}
const ExpensiveTree = React.memo(ExpensiveComponent);

// 💥 breaks memoization: a new object literal every render
<ExpensiveTree style={{ backgroundColor: 'blue' }} />
```
Wrapping the prop in `useMemo` only helps if the caller controls the reference; if `style` itself arrives as a prop from further up, memoizing it locally achieves nothing — the stable reference has to exist at that call site instead.

### children break memo too
```jsx
function ExpensiveComponent({ children }) {
  return <div>I'm expensive!{children}</div>;
}
const ExpensiveTree = React.memo(ExpensiveComponent);

<ExpensiveTree>
  <p>Hello, world!</p>
</ExpensiveTree>
```
JSX is sugar for `React.createElement`, so even a visually-identical `<p>` tag is a new object on every render — memoization breaks even though nothing "looks" different.

### Prefer an external store when composition isn't possible
When several siblings (e.g. multiple tables plus a summary bar) all need the same state and it can't be moved down or lifted up, put it outside React instead of memoizing broadly:
```js
const useTableStore = create((set) => ({
  table1Data: [],
  table2Data: [],
}));

export const useTable1Data = () => useTableStore((state) => state.table1Data);
export const useTable2Data = () => useTableStore((state) => state.table2Data);
```
Each component subscribes only to the slice it needs, giving the same win as memoizing every table without the fragility of prop-reference tracking.

## gotchas
- Superseded: React Compiler v1.0 (stable since October 2025) now automatically applies most of this memoization for new apps, but it does not replicate custom equality comparators — apps without the compiler, or using custom comparators, still hit these pitfalls.
