---
source: https://patrickbrosset.com/articles/2022-10-24-do-you-really-understand-CSS-radial-gradients/
fetched: 2026-09-11
published: 2022-10-24
status: stale
---
`radial-gradient()` draws concentric shapes (circle or ellipse) of color radiating from a center point, out to an "ending shape" whose size and position you control. Reach for this explanation when a radial gradient's shape, size keyword, or color-stop spacing isn't landing where expected.

## how
Syntax:
```
radial-gradient(<shape> <size> at <position>, <color-stops>)
```
- **Shape**: `circle` or `ellipse` (default). Colors render as concentric layers inside it, listed from inner-most to outer-most stop.
- **Position**: after the `at` keyword; defaults to the center of the gradient box. Accepts keywords (`at top left`) or lengths (`at 150px 70px`), same syntax as `background-position`.
- **Size**: defines the ending (outer-most) shape. Either explicit lengths (`circle 100px`, or two lengths for an ellipse's horizontal/vertical radii), or a keyword — defaults to `farthest-corner` when omitted:
  - `closest-side` / `farthest-side`: ending shape touches the nearest/farthest side of the box from the center (for an ellipse, computed independently per axis).
  - `closest-corner` / `farthest-corner`: same, but measured to a corner instead of a side.

Color stops are placed along the "gradient ray" — a half-line from the center point extending right — analogous to the gradient line in linear gradients:
```
radial-gradient(circle 300px at left center, fuchsia 100px, aqua 200px, white 300px)
```
- No position on a stop → evenly auto-distributed between its positioned neighbors (first stop defaults to 0%, last to 100% of the ray).
- A stop can carry two positions (`red 100px 200px`) to make it span a range — useful for hard stops (no transition) between colors:
```css
.bubbles {
  background-image:
    radial-gradient(circle 100px, #783d54 100%, transparent 0),
    radial-gradient(circle 200px at top left, #4a2030 100%, transparent 0);
}
```
Here `transparent 0` auto-corrects to the same position as the preceding stop (100%), creating a hard edge at the shape's boundary instead of a fade.
- Out-of-order stop positions get corrected to the preceding positioned stop's position, same as linear-gradient.
- Stop positions aren't capped to 0–100% of the ray; a stop can sit outside that range (e.g. `blue -200%, red 200%`) to zoom into a narrower slice of the gradient.

## gotchas
- MDN lists the whole `radial-gradient` function, including the `at` position keyword, as Baseline widely available since 2015 — this note's own source claims Safari doesn't support the `at` keyword for positioning the ending shape, but that claim could not be confirmed as of 2026 and looks outdated.
