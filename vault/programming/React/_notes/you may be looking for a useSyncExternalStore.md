---
source: https://swizec.com/blog/you-may-be-looking-for-a-useSyncExternalStore/
fetched: 2026-09-11
published: 2025-09-23
status: fresh
---
`useSyncExternalStore` replaces the common `useState` + `useEffect` + subscribe pattern for reading an external source (a browser API, a `ResizeObserver`, an event source). Reach for it whenever that pattern causes hydration jank under server rendering, since it lets you specify a real default value for the server render instead of settling into the right value only after two or more client renders.

## how
```js
const eventSource = getEventSource();

function subscribe(callback) {
  eventSource.onChange(callback);
  return () => {
    eventSource.unsubscribe(callback);
  };
}

function useSomeValue() {
  const value = useSyncExternalStore(
    subscribe,
    () => eventSource.currentValue(),
    () => defaultValue,
  );

  return value;
}
```
The first argument subscribes and returns an unsubscribe function, the second reads the current value, and the third supplies the default value used during server rendering.

## gotchas
- The `useState`+`useEffect`+subscribe pattern it replaces makes React render the component twice or more — once with a default value, again once the effect subscribes and updates state — which is what causes the hydration flash.
- Getting the server-side default value (third argument) right is what actually minimizes the jank.
