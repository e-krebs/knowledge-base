---
source: https://fireship.dev/why-react-renders
fetched: 2026-09-11
status: fresh
---
React's mental model is v = f(s): the view is a function of state, and the interactive question is exactly when and how React re-invokes that function. Reach for this walkthrough when debugging "why did/didn't this re-render" — it covers the snapshot model, batching of multiple `setState` calls in one handler, why children re-render even without prop changes, and how `React.memo`/`StrictMode` change that default.

## how
### What is rendering
Each render, React takes a snapshot: props, state, event handlers, and the resulting UI description, all frozen at that instant. React then uses that snapshot to update the view. The very first render starts at the root via `createRoot`.

```js
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
```

### When does React re-render
The only thing that can trigger a re-render of a component is a state change. An event handler closes over the props/state from the snapshot at the time it was created; if it calls a `useState` updater with a value different from the snapshot's state, React re-renders and creates a new snapshot.

### Batching
React doesn't re-render after every updater call inside a handler — it waits until every updater in that handler has run, then computes the final state once.

```js
const handleClick = () => {
  setCount(1)
  setCount(2)
  setCount((c) => c + 3) // c is 2, final state is 5
}
```
Passing a function to the updater tells React to use the previous invocation's result instead of replacing it; passing a plain value discards everything queued before it.

### Child re-renders and React.memo
When a component's state changes, React re-renders that component and *all* of its children — regardless of whether those children accept props or would look different. This is the default because React assumes components aren't always pure and rendering is usually cheap. To opt a component out and only re-render it when its own props change, wrap it in `React.memo`.

### StrictMode
`StrictMode` makes React invoke render an extra time (in development only) to surface components that aren't pure.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## gotchas
- The double-render from `StrictMode` only happens in development; production builds ignore it.
- A component re-renders every child on state change even if a child has no props — `React.memo` is required to skip that, and it only helps if the child's props are actually unchanged.
