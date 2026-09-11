---
source: https://alexsidorenko.com/react-journey
fetched: 2026-09-11
status: fresh
---
Traces one `useState`/`useEffect` component through every phase of a render cycle — JSX transpilation, the initial render, the returned element snapshot, the DOM commit, the browser paint, and the deferred effect run — so you can see exactly what "snapshot" means and why an effect still sees the value from the render that scheduled it, not a later one.

## how
Starting component:
```jsx
function App() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      console.log(count);
    }, [count * 1000]);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```
JSX transpiles to `React.createElement` calls, then the initial render substitutes the current state (`count: 1`) everywhere it's referenced, closing the effect callback and the click handler over that literal value. Rendering returns a snapshot object describing the element:
```js
{
  type: "button",
  key: null,
  ref: null,
  props: {
    onClick: () => setCount(1 + 1),
    children: 1,
  },
}
```
That snapshot is committed to the real DOM, the browser paints it, and only then does the queued effect run — using `count: 1` from the same closure the render produced, regardless of what state is by the time the effect actually fires.

## gotchas
- The event handler and the effect callback both close over the state value from the render that created them — clicking again re-renders with a fresh closure, it does not mutate the old one.
