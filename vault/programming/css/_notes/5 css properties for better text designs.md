---
source: https://blog.master.dev/typographic-css-tricks/
fetched: 2026-09-11
published: 2026-08-05
status: fresh
---
Five lesser-known CSS properties for pushing text past a plain font/weight/color change: clipping a background into glyph shapes, centering text vertically without flex/grid, styling line-fragment edges uniformly, animating glyph spacing for reveal effects, and combining a horizontal run into vertical writing. Reach for one when a plain type change isn't distinctive enough.

## how
- **`background-clip: text`** fills letterforms with a background image/gradient instead of a solid color:
```css
p {
  background: text url("image.jpg") center/auto 1lh;
  color: transparent;
}
```
- **`align-content: center`** centers a block box's content vertically, no flexbox/grid wrapper needed:
```css
p {
  width: 360px;
  aspect-ratio: 1;
  text-align: center;
  align-content: center;
}
```
- **`box-decoration-break: clone`** makes every fragment's edges (border, shadow, padding) render uniformly when a line box breaks across `<br>`s:
```css
span {
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  border: solid blue;
  border-width: 0 1px 1px 0;
  box-shadow: 2px 2px 3px rgb(171, 171, 245);
  padding-inline: 6px;
  border-radius: 3px;
}
```
- **`letter-spacing`** animated from a negative value to `0` (paired with `color: transparent` and `::first-letter`) produces a text-reveal effect.
- **`text-combine-upright: all`**, applied to a child under `writing-mode: vertical-lr`, squeezes a horizontal run (numbers, short Latin text) into one vertical glyph slot.

## gotchas
- `box-decoration-break` still needs the `-webkit-` prefix for Safari.
