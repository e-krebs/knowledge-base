---
source: https://interbolt.org/blog/react-ui-tearing/
fetched: 2026-09-11
published: 2023-12-15
status: fresh
---
State tearing happens when a concurrent render pauses mid-way — for example inside a `startTransition` update — and the mutable external store it's reading changes while paused, so components rendered before and after the pause disagree about the store's value. Reach for `useSyncExternalStore` whenever a library or component reads state from a plain external store (an object living outside React's render lifecycle) that must stay consistent under concurrent rendering.

## how
The failure mode: a component subscribed to an external store (Redux-style, via a selector) starts rendering, React yields to a higher-priority update, the store mutates, and the render resumes against a different value than the one already-rendered siblings used.
```jsx
const BlogPreviews = () => {
  const [blog, lastPostedDate] = useExternalStateSelector(externalState => [
    externalState.blog,
    externalState.lastPostedDate
  ])
  // ...
}
```
`useSyncExternalStore` fixes it by re-checking the snapshot right before commit, per the react.dev docs quoted in the article:

> If the [external] store is mutated during a non-blocking transition update, React will fall back to performing that update as blocking. Specifically, for every transition update, React will call getSnapshot a second time just before applying changes to the DOM. If it returns a different value than when it was called originally, React will restart the update from scratch, this time applying it as a blocking update, to ensure that every component on screen is reflecting the same version of the store.

## gotchas
- The fix trades away some of concurrent rendering's benefit: on a mismatch, React forces a full synchronous re-render instead of staying interruptible. Redux uses this approach.
- React's Context API never tears (values flow through the render tree), but it pushes memoization work onto the app — without a `useContextSelector`-style mechanism, callers must memoize aggressively to avoid unintuitive re-renders.
- Some libraries (Jotai, per the article) choose full concurrent rendering plus fine-grained reactivity and accept brief, temporary tearing while reconciling — a deliberate tradeoff, not a bug.
