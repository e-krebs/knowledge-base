---
source: https://frontendmasters.com/blog/things-that-can-break-aspect-ratio-in-css/
fetched: 2026-09-11
published: 2024-04-16
status: fresh
---
`aspect-ratio` (full browser support since around 2021) usually "just works" for making an element a square or matching a fixed ratio, but three common situations silently override it. Reach for this checklist when an element with `aspect-ratio` set isn't rendering at the ratio you declared.

## how

### 1. Both dimensions set
If `height` and `width` (or their logical equivalents `block-size`/`inline-size`) are both set, `aspect-ratio` is ignored outright:
```css
.el {
  inline-size: 300px;
  block-size: 200px;
  aspect-ratio: 1 / 1; /* does nothing */
}
```
Watch for a dimension set from somewhere unexpected — a baseline stylesheet setting `width` on `<img>`, or a `height` attribute on the `<img>` tag itself — silently defeating `aspect-ratio`. `min-*`/`max-*` sizing properties are also respected and can break it the same way.

### 2. Stretching
Flex/grid items default to `align-items: stretch` (or `justify-items: stretch` in grid), which forces the cross-axis size and overrides `aspect-ratio` on children that only have one dimension set:
```css
.container {
  display: flex;
  align-items: flex-start; /* was stretch; lets aspect-ratio apply */
}
```

### 3. Content that forces height
If the element's content (e.g. text) is taller than the box the ratio implies, the content still overflows the box, growing it and breaking the declared ratio — same issue the old "padded box" (`padding-bottom` percentage hack) had, just contained differently by `aspect-ratio`.
