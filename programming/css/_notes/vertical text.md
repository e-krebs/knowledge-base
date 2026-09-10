---
source: https://shrutibalasa.substack.com/p/create-accessible-vertical-text
fetched: 2026-09-10
published: 2023-04-26
status: stale
---
CSS `writing-mode: sideways-lr` lays out text vertically without rotating an element with `transform`, so the browser keeps line flow and spacing correct on its own. Reach for it over a `rotate()` trick when the vertical text needs to stay accessible: screen readers parse the flow and direction correctly under `writing-mode`, but not under a rotated block.

## how
```css
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-text {
  writing-mode: sideways-lr;
}
```
`sideways-lr` flows content vertically from bottom to top. `vertical-lr` and `vertical-rl` are the other `writing-mode` values available depending on the desired direction.

## gotchas
- `sideways-lr` still lacks Firefox support in 2026 (flagged experimental, Mozilla bug 1193519); use `vertical-lr`/`vertical-rl` with `text-orientation` as the cross-browser fallback for the same accessible-vertical-text goal.
