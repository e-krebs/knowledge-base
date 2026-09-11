---
source: https://www.developerway.com/posts/refs-from-dom-to-api
fetched: 2026-09-11
published: 2023-03-28
status: stale
---
Walks through why and how to reach into the real DOM from React: `useRef` for direct access, passing that ref down to a child (as a plain prop, or via `forwardRef` for the reserved `ref` name), and `useImperativeHandle` to expose a curated imperative API (e.g. `focus()`/`shake()`) instead of the raw element. Reach for this when normal props/state/callbacks can't express what you need — focus, scroll, animation triggers, third-party DOM libraries.

## how
Create a ref and attach it directly:
```jsx
const Component = () => {
  const ref = useRef(null);
  return <input ref={ref} />
}
```
To get a child's DOM node, either pass the ref through a custom prop, or forward the reserved `ref` name with `forwardRef`:
```jsx
const InputField = forwardRef((props, ref) => {
  return <input ref={ref} />
})

// parent
const inputRef = useRef(null);
return <InputField ref={inputRef} />
```
To expose an imperative API instead of the raw node, attach it with `useImperativeHandle`:
```jsx
const InputField = ({ apiRef }) => {
  const inputRef = useRef(null);
  const [shouldShake, setShouldShake] = useState(false);

  useImperativeHandle(apiRef, () => ({
    focus: () => inputRef.current.focus(),
    shake: () => setShouldShake(true),
  }), [])

  return <input ref={inputRef} className={shouldShake ? "shake-animation" : ''} />
}
```
## gotchas
- A plain `ref` prop on a function component warns ("Function components cannot be given refs") and does nothing — that's what `forwardRef` exists to fix.
- `useImperativeHandle` takes any ref: one created in the component, one passed through props, or one received via `forwardRef`. The same effect can be had without it by mutating `ref.current` directly inside a `useEffect`.
- Applies to React 18 and below: since React 19, `ref` is a plain prop on function components and `forwardRef` is on a deprecation path — replacement: ref as a prop (React 19+); `useRef`/`useImperativeHandle` for imperative APIs are unaffected.
