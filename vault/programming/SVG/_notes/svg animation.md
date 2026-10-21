---
source: https://www.smashingmagazine.com/2023/01/svg-customization-animation-practical-guide/
fetched: 2026-09-13
published: 2023-01-30
status: fresh
---
A survey of small SVG editing/styling tricks that make icons and graphics easy to customize and animate with plain CSS, without a JS animation library. Reach for these when an SVG needs to inherit text color, be reused as a library icon, animate correctly around its own bounding box, or draw/erase itself.

## how
**`currentColor` fill** — instead of a greedy `.button svg * { fill: var(--color-text) }` selector (breaks icons relying on `fill="none"` elsewhere), edit the source so paths inherit CSS `color`:
```
<path d="..." fill="currentColor" /> <!-- was fill="#C2CCDE" -->
```
**`symbol` + `use` icon library** — define once, instantiate by reference, so JSX components don't inline the SVG markup:
```html
<svg><symbol id="myIcon" viewBox="0 0 24 24"><!-- ... --></symbol></svg>
<svg viewBox="0 0 24 24"><use href="#myIcon" /></svg>
```
**`transform-box: fill-box`** — a transform on an SVG child is relative to the parent `<svg>`'s viewBox by default; `fill-box` makes `transform-origin` use the element's own bounding box instead:
```css
.cookie__eye {
  animation: sparkle 0.15s 1s steps(2, jump-none) infinite alternate;
  transform-box: fill-box;
  transform-origin: center center;
}
```
**`stroke-dasharray`/`stroke-dashoffset` draw** — dash covers the whole stroke length, offset by the same amount to hide it; animate offset to 0 to draw, to a negative value to erase:
```css
svg path { stroke-dasharray: 800; stroke-dashoffset: 800; animation: draw 6s linear infinite; }
@keyframes draw { to { stroke-dashoffset: 0; } }
```
**`prefers-reduced-motion` guard**:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 0s !important; }
}
```

## gotchas
- Importing SVG markup as JSX (e.g. `import {ReactComponent as ReactLogo} from './logo.svg'`) bloats the JS bundle and is less performant than letting the browser parse/render it directly — prefer `symbol`+`use`.
- The dash length needed to cover a stroke (the `800` above) depends on the specific SVG and must be measured per-shape.
