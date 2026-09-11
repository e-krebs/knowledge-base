---
source: https://una.im/border-shape/
fetched: 2026-09-11
published: 2026-02-19
status: fresh
---
`border-shape` is a new CSS property (Borders and Box Decoration Module Level 4) that defines a custom geometry for an element's border box itself, rather than just masking content like `clip-path` does. Because it redefines the box, the background, border-image, focus outline, and box-shadow all follow the new shape — reach for it over `clip-path` tricks or pseudo-element hacks when a tooltip arrow, chevron, or scalloped edge needs its border/shadow to actually follow the cut.

## how
Define control variables, then draw the shape with `shape()` path commands (`hline`, `vline`, `curve to ... with ...`, `line by`, `close`):
```css
--r: 10px;  /* Corner Radius */
--ap: 50%;  /* Arrow Position */
--ah: 10px; /* Arrow Height */
--aw: 10px; /* Arrow Width (Half) */
```
```css
border-shape: shape(from var(--r) 0,
  hline to calc(100% - var(--r)),
  curve to right var(--r) with right top,
  vline to calc(100% - (var(--r) + var(--ah))),
  curve to calc(100% - var(--r)) calc(100% - var(--ah)) with right calc(100% - var(--ah)),
  hline to calc(var(--ap) + var(--aw)),
  line by calc(var(--aw) * -1) var(--ah),
  line by calc(var(--aw) * -1) calc(var(--ah) * -1),
  hline to var(--r),
  curve to left calc(100% - (var(--r) + var(--ah))) with left calc(100% - var(--ah)),
  vline to var(--r),
  curve to var(--r) top with left top);
```
For repeating arcs (e.g. a scalloped border), add `content-box` so coordinates/percentages resolve against the content area, and repeat `arc by ... of ... small cw` segments before `close`:
```css
border-shape: shape(
    from 0% 0%,
    arc by 20% 0% of 10% 10% small cw,
    arc by 20% 0% of 10% 10% small cw,
    close
  ) content-box;
```

## gotchas
- Accepted values besides `shape()`: basic shapes (`circle()`, `ellipse()`, `inset()`, `polygon()`) and SVG-style path strings (`path("M 10 10 L 90 10 ...")`).
- `corner-shape` (same Level 4 spec) only styles corners — no mid-edge cut-outs or extrusions; use `border-shape` once the shape isn't corner-only.
- Provide a `clip-path` fallback for unsupported browsers (e.g. a tooltip's border gets cut off at the bottom without `border-shape` support).
- With `content-box`, padding must be wide enough to cover the drawn edges; the source notes an open issue about how this should behave.
- Support, September 2026: shipped in Chrome/Edge 147 (April 2026) only, not Baseline, unsupported in Firefox and Safari.
