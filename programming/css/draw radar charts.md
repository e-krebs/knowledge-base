---
source: https://www.smashingmagazine.com/2024/02/draw-radar-charts-web/
fetched: 2026-09-10
published: 2024-02-09
status: fresh
---
A radar (spider) chart plots several categories as axes radiating from a center point, connecting their values into a polygon. Reach for this when you need one custom chart without pulling in Chart.js or D3 — the shapes are drawn with CSS `clip-path: polygon()`, with the vertex coordinates computed from trigonometry.

## how
Stack the grid, graph and label layers on top of each other with CSS grid instead of separate positioned elements:
```css
.wrapper { display: grid; }

.wrapper div {
  aspect-ratio: 1 / 1;
  grid-area: 1 / 1;
  width: 300px;
}
```
Each layer's shape is a `clip-path: polygon(...)` whose points are generated in JS, one per axis, using:
```
x = (round(cos(-π/2 + n/sides) * percents[j][i]) + 100) / 2
y = (round(sin(-π/2 + n/sides) * percents[j][i]) + 100) / 2
```
`n` steps around the circle in `2π/sides` increments, and `percents[j][i]` is the data value for series `j` at axis `i`. The resulting coordinate list is joined into the `polygon()` string and assigned via `element.style.clipPath`.

## gotchas
- Overlapping series get hard to read fast — keep the number of plotted series small.
- Category order changes the polygon's shape, so keep axis order consistent when comparing charts.
- Scale must be identical across series, or the shapes aren't comparable.
