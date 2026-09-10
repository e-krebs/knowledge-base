---
source: https://buildui.com/recipes/highlight
fetched: 2026-09-10
status: fresh
---
Flips a `data-highlight` attribute on a wrapper for a set duration whenever a watched prop changes, so CSS (or Tailwind's data-attribute variants) can style the "just changed" state without re-implementing the timing logic each time. Reach for it whenever a value update (a counter, a row, a badge) should flash or pulse briefly to draw the eye.

## how
```jsx
<Highlight trigger={visitors} duration={500}>
  <p>Visitors</p>
  <p>{visitors}</p>
</Highlight>
```

```css
[data-highlight="on"] {
  background-color: blue;
}
```

The `Highlight` component itself watches `trigger` in a `useEffect`/`setTimeout` pair and sets `data-highlight` to `null` (initial), `"on"` (right after a change, for `duration` ms), then `"off"` (after it elapses). Swap in enter/leave CSS animations keyed off `data-highlight="on"` / `"off"` for asymmetric timing.

## gotchas
- If `trigger` changes again before `duration` elapses, the highlight restarts rather than stacking or finishing early.
- Needs the `use client` hook internally, but the component itself can be rendered from both Server and Client Components.
