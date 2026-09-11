---
source: https://www.smashingmagazine.com/2024/05/modern-guide-making-css-shapes/
fetched: 2026-09-11
published: 2024-10-07
status: stale
---
A survey of the two CSS mechanisms behind almost every custom shape: `clip-path`/`polygon()` for straight-edged cuts (hexagons, stars, triangles, cut corners) and `mask` with gradient composition for curved ones (holes, arcs, scalloped/rounded edges). Reach for `clip-path` when the shape has no curves; reach for `mask` + gradients once curves or composited layers are involved. Same core tricks — points outside the `0%–100%` range, swapped X/Y axes, intersecting lines, symmetry — recur across every shape family.

## how

### Clipping with `clip-path: polygon()`
`polygon()` points aren't limited to the `[0% 100%]` range, so a hexagon needs only 4 points instead of 6:
```css
.hexagon {
  width: 200px;
  aspect-ratio: cos(30deg);
  clip-path: polygon(
    -50% 50%,
    50% 100%,
    150% 50%,
    50% 0
  );
}
```
### Offsetting the clip reference box
Instead of baking the outside-point offset into every coordinate, put it on `margin` (or `padding`) and clip a plain shape against `margin-box`/`padding-box`:
```css
.octa {
  --w: 200px;
  width: var(--w);
  aspect-ratio: 1;
  margin: calc(var(--w) * tan(22.5deg) / 2);
  clip-path: polygon(0 50%, 50% 0, 100% 50%, 50% 100%) margin-box;
}
```
### Trig instead of magic numbers
`cos()`, `sin()`, `tan()` replace decimal magic numbers in coordinates and ratios — a 5-point star instead of the usual 10-point version:
```css
.star {
  width: 200px;
  aspect-ratio: 1;
  clip-path: polygon(50% 0,
    calc(50%*(1 + sin(.4turn))) calc(50%*(1 - cos(.4turn))),
    calc(50%*(1 - sin(.2turn))) calc(50%*(1 - cos(.2turn))),
    calc(50%*(1 + sin(.2turn))) calc(50%*(1 - cos(.2turn))),
    calc(50%*(1 - sin(.4turn))) calc(50%*(1 - cos(.4turn)))
  );
}
```
### Masking with gradients
`mask` only cares about a gradient's alpha channel — opaque areas stay visible, transparent areas are cut. A hard color stop (with a hair of tolerance to avoid jagged edges) gives a clean circular hole:
```css
mask: radial-gradient(50px, #0000 98%, #000);
```

### Composing gradient layers into arcs
`mask-composite` (or composite keywords inline on `mask`) combines multiple gradient layers — radial + conic — into shapes a single gradient can't express, like a progress arc with rounded ends:
```css
.arc {
  --b: 40px; /* border thickness */
  --a: 240deg; /* progression */
  --_g:/var(--b) var(--b) radial-gradient(50% 50%,#000 98%,#0000) no-repeat;
  mask:
    top var(--_g),
    calc(50% + 50% * sin(var(--a))) calc(50% - 50% * cos(var(--a))) var(--_g),
    conic-gradient(#000 var(--a), #0000 0) intersect,
    radial-gradient(50% 50%, #0000 calc(100% - var(--b)), #000 0 98%, #0000)
}
```

### Border-image for curved cutouts
Combining `border-image` (for the curve) with `clip-path` (for the point) makes a heart shape without any masking:
```css
.heart {
  --c: red;
  width: 200px;
  aspect-ratio: 1;
  border-image: radial-gradient(var(--c) 69%,#0000 70%) 84.5%/50%;
  clip-path: polygon(-42% 0,50% 91%, 142% 0);
}
```

## gotchas
- `polygon()` accepts points outside `[0% 100%]`, and its lines can intersect — both are exploited repeatedly to cut point counts (star: 10 → 5, hexagon: 6 → 4).
- For `mask` gradients, only the alpha channel matters; the visible color used in demos (e.g. `#000`) is arbitrary.
- Since this article: `shape()` (curve/arc-capable basic-shape for `clip-path`/`offset-path`, avoiding most polygon/mask workarounds here) reached Baseline in February 2026, after this article. `border-shape` (shapes the border-box itself, not just clipped content) shipped Chrome/Edge 147 only (April 2026) — not Baseline, unsupported in Firefox/Safari.
