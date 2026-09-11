---
source: https://www.smashingmagazine.com/2024/01/css-border-image-property/
fetched: 2026-09-11
published: 2024-01-16
status: fresh
---
`border-image` slices a gradient (or image) into nine regions around an element and stretches each slice into its matching region, which makes it a one-line way to build gradient overlays, full-bleed backgrounds, fancy heading underlines, and decorative shapes without extra markup. Reach for it whenever you'd otherwise add a pseudo-element or extra `<div>` purely for a border-like decoration.

## how
Syntax: `border-image: <source> <slice>/<width>/<outset> <repeat>`. `<outset>` grows the paint area beyond the element's box (useful for "outside" decorations); `<width>` splits that area into nine regions; `<slice>` splits the source into nine matching slices; `fill` paints the otherwise-empty center region.

A gradient overlay above a background, in one line:

```css
.overlay {
  border-image: fill 0 linear-gradient(#0003, #000);
}
```

A full-width "break-out" background that escapes its parent's constrained width:

```css
.full-background {
  border-image: conic-gradient(pink 0 0) fill 0//0 100vw;
}
```

`conic-gradient()` with a single color and two stops is used as a cheap way to get a solid fill, since `border-image` doesn't accept plain color values.

## gotchas
- Declaration order matters: `border-image` must come after `border`, or the plain border overrides it.
- It paints above `background` and `box-shadow` but below the element's content.
- It ignores `border-radius` entirely — the paint area stays a box even on rounded corners.
- Slices can overlap past 50%; distortion on real (non-solid) gradients is usually fixed by adding the `repeat` keyword at the end of the declaration.
