---
source: https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs
fetched: 2026-09-11
published: 2022-08-14
status: fresh
---
A callback ref is a function React calls right after it attaches a DOM node (and once more with `null` on unmount), which makes it a more reliable place for post-render side effects — focusing an input, measuring a node — than a `useRef` + `useEffect` pair. Reach for it whenever the effect must happen the moment a specific node becomes available, not the moment the owning component mounts, e.g. when the node is attached later behind a conditional render or a forwarded ref.

## how
```js
const ref = React.useCallback((node) => {
  node?.focus()
}, [])

return <input ref={ref} defaultValue="Hello world" />
```

The same technique drives side effects off the node itself, such as measuring it:

```js
const measuredRef = React.useCallback((node) => {
  if (node !== null) {
    setHeight(node.getBoundingClientRect().height)
  }
}, [])
```

## gotchas
- Wrap the ref callback in `useCallback`: React skips re-running it when it gets the same reference, but without memoizing, it tears down and re-runs on every render.
- A `useRef` + mount-only `useEffect` can miss the node entirely if it's attached later (conditional render, or a ref forwarded to a component that defers rendering) — the effect already ran and won't run again.
