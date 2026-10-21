---
source: https://alexsidorenko.com/blog/react-optimize-rerenders-without-refs-memo/
fetched: 2026-09-11
published: 2023-01-04
status: fresh
---
State colocation moves fast-changing state (and the JSX that reads it) into its own small component instead of reaching for refs or `memo`. Reach for it when a frequently-updating state (mouse position, scroll offset) forces an expensive JSX tree to re-render on every event, even though only a tiny part of the DOM actually changes.

## how
1. Find the parts of the component that are actually tied to the frequent updates (e.g. the mouse coordinates), separate from the expensive JSX around them.
2. Extract those parts, and the state itself, into a new child component.
3. Give that child component a `children` prop, and pass the rest of the original JSX — the expensive part — through it as `children`.
4. Render that expensive JSX as `children` inside the new component's tree.

Because `children` is passed down from the parent unchanged, it isn't re-created when the child's own state updates, so it doesn't re-render along with it. The mousemove state update stays isolated inside the small component, and the expensive JSX renders once instead of on every mouse move — no refs, no memoization.

## gotchas
- This only helps when the expensive JSX doesn't itself depend on the fast-changing state — otherwise it still needs to update.
