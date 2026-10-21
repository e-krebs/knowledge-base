---
source: https://patrickbrosset.com/articles/2015-03-27-do-you-really-understand-CSS-linear-gradients/
fetched: 2026-09-11
published: 2015-03-27
status: fresh
---
`linear-gradient()` draws colors along an invisible "gradient line" through the center of a "gradient box" (normally the element's border-box, or the `background-size` box if set). Reach for this explanation when a gradient's angle, corner keyword, or color-stop spacing isn't landing where you expected.

## how
Syntax:
```
linear-gradient([<angle> | to <side-or-corner>]?, <color-stop-list>)
```
- The angle is measured between the gradient line and a vertical line through the box's center. `0deg` = `to top`; the default (no angle given) is `to bottom` (180deg).
- Corner keywords (`to top right`, etc.) do **not** mean the gradient line passes through that corner at 45deg — the line's angle is calculated so that corner is exactly the last color, which depends on the box's aspect ratio.
- The gradient line's length (and so where it starts/ends relative to the box) is `abs(W * sin(A)) + abs(H * cos(A))` for box width `W`, height `H`, angle `A` — this is why color stops sometimes render outside the visible box.

Color-stop distribution:
- With no positions given, stops are spread evenly: 2 colors → 0%/100%; 3 colors → 0%/50%/100%; and so on.
- A stop can take a percentage or a length, measured from the start of the gradient line.
- Mixing positioned and unpositioned stops: unpositioned stops are evenly distributed between their nearest positioned neighbors.
- Stops must be non-decreasing; an out-of-order stop gets corrected to the same position as the preceding positioned stop — this can make several stops collapse to one position and vanish.
- A stop position isn't capped to 0–100%; e.g. a last stop at 120% shifts how everything before it distributes.

## gotchas
- CSS Color 4 adds an optional `in <color-space>` interpolation hint (e.g. `in oklch`) as an additive feature on top of this mechanics — it doesn't change the angle/line/color-stop model described here.
