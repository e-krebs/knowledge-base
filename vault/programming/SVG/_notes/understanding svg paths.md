---
source: https://www.nan.fyi/svg-paths
fetched: 2026-09-13
published: 2023-07
status: fresh
---
The `d` attribute of an SVG `<path>` is a series of commands: a single-letter code followed by numeric arguments, executed sequentially by a cursor that starts at the origin. Reach for this reference when hand-writing or debugging raw path data instead of trusting a vector editor's output.

## how
Uppercase commands are absolute (arguments are x/y coordinates); lowercase are relative (arguments are dx/dy offsets from the cursor's current position). Every command below has both a case variant.

| Command | Args | Draws |
|---|---|---|
| `M` / `m` | x y | moveto — moves the cursor without drawing (starts a new subpath) |
| `L` / `l` | x y | lineto — straight line to the point |
| `H` / `h` | x | horizontal line |
| `V` / `v` | y | vertical line |
| `Z` / `z` | none | closepath — straight line back to the subpath's start |
| `Q` / `q` | cx cy x y | quadratic Bezier curve (one control point) |
| `T` / `t` | x y | smooth quadratic — reuses the reflection of the previous curve's control point |
| `C` / `c` | x1 y1 x2 y2 x y | cubic Bezier curve (two control points) |
| `S` / `s` | x2 y2 x y | smooth cubic — reuses the reflection of the previous curve's second control point |
| `A` / `a` | rx ry rotation large-arc-flag sweep-flag x y | elliptical arc from the cursor to (x, y) |

Example `d` (corner drawn with mixed absolute/relative commands):
```
M 5 5 v 5 L 10 15 h 5
```

## gotchas
- The arc command's endpoint is given as a target point, not an angle — the browser finds an ellipse with radii `rx`/`ry` that fits the current point and the target point.
- If the ellipse is too small to fit both points, it's scaled up until it does.
- Between any two points there are always four possible arcs; `sweep-flag` picks clockwise (1) vs counterclockwise (0), and `large-arc-flag` picks the larger vs smaller of the two remaining. When `rx == ry` (a circle), `large-arc-flag` has no effect.
- `T`/`S` only work when the previous command was the corresponding curve type (`Q`/`C`); otherwise the reflection point isn't meaningful.
