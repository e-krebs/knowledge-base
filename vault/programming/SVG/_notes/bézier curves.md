---
source: https://blog.richardekwonye.com/bezier-curves
fetched: 2026-09-13
published: 2023-08
status: fresh
---
A Bezier curve is defined by a start point, an end point, and one or more control points that shape it; SVG paths and CSS easing functions both build on the same construction. Reach for De Casteljau's algorithm when you need to compute a point on a curve at a given progress `t`, rather than just eyeballing control points.

## how
- **Quadratic Bezier**: 3 points — `p0`/`p2` are anchors (start/end), `p1` is the single control point. SVG syntax: `Q x1 y1, x y` (draws with control point `p1` to end point `p2`; `p0` is the end point of the previous command).
- **Cubic Bezier**: 4 points — `p0`/`p3` are anchors, `p1`/`p2` are control points. SVG syntax: `C x1 y1, x2 y2, x y`.
- **CSS easing**: `cubic-bezier(x1, y1, x2, y2)` has fixed anchor points at `(0, 0)` and `(1, 1)` (the animation's start/end); the 2 control points are the function's arguments. `cubic-bezier(0, 0, 1, 1)` produces a linear path.
- **Linear interpolation** between two points at progress `t` (0 = start, 1 = end):
```
lerp(p0, p1, t) = p0 + (p1 - p0) * t
```
- **De Casteljau's algorithm** for a cubic curve's point at `t`: nest the linear interpolation over the curve's 4 points.
```
p4 = lerp(p0, p1, t)
p5 = lerp(p1, p2, t)
p6 = lerp(p2, p3, t)
p7 = lerp(p4, p5, t)
p8 = lerp(p5, p6, t)
bt = lerp(p7, p8, t)   // point on the curve at progress t
```

## gotchas
- Bezier handles (the segments from a control point) can be mirrored, asymmetric, or disconnected — mirrored keeps connected curves smooth, the other modes don't.
