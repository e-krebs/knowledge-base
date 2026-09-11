---
source: https://www.developerway.com/posts/how-to-handle-errors-in-react
fetched: 2026-09-11
published: 2023-02-14
status: fresh
---
Since React 16, an uncaught error thrown during the React lifecycle unmounts the entire app instead of leaving the broken part on screen, so every app needs a deliberate error-catching strategy. Plain `try/catch`, the `ErrorBoundary` component, and a rethrow trick each cover a different slice of where errors originate — render, hooks/callbacks, or async/event code — and combining them is how you catch everything.

## how

### try/catch
Catches errors only in the same synchronous scope where it's placed. It won't catch errors thrown inside `useEffect` unless placed inside the effect itself — wrapping the whole `useEffect` call does nothing, since the effect runs asynchronously after render:
```jsx
useEffect(() => {
  try {
    throw new Error('Hulk smash!');
  } catch(e) {
    // this one will be caught
  }
}, [])
```
It also can't catch errors thrown inside child components, and setting state inside a `try/catch` during render causes an infinite re-render loop — return a fallback element directly instead in that case.

### ErrorBoundary
A class component using `getDerivedStateFromError` catches render-time errors anywhere in its children; `componentDidCatch` is where you log the error. A reusable version takes the fallback as a prop:
```jsx
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    log(error, errorInfo);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

### Rethrow trick (catch async/event errors with ErrorBoundary too)
`ErrorBoundary` only catches render-lifecycle errors, not promises, timers, or event handlers. Dan Abramov's trick: catch the error with `try/catch`, then re-throw it inside a state updater function so it surfaces during the next render, where `ErrorBoundary` catches it like any other error:
```jsx
const useThrowAsyncError = () => {
  const [, setState] = useState();
  return (error) => setState(() => { throw error; });
};

// usage: fetch('/bla').catch((e) => throwAsyncError(e))
```

## gotchas
- `try/catch` around `useEffect` itself never fires — the try/catch must be inside the effect callback.
- Setting state inside a render-time `try/catch` causes an infinite re-render loop; return the fallback element directly instead.
- `ErrorBoundary` never catches errors in event handlers, resolved promises, or `setTimeout` — only errors during React's render lifecycle.
- `react-error-boundary` (bvaughn) provides a ready-made `ErrorBoundary` plus utilities if you'd rather not hand-roll one.
