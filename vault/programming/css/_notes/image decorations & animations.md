---
source: https://css-tricks.com/fancy-image-decorations-outlines-and-complex-animations/
fetched: 2026-09-11
published: 2022-10-28
status: fresh
---
Uses the `outline` property's negative offset and overlap behavior to draw a hover overlay directly on a bare `<img>`, no extra wrapper element needed. Combine it with `clip-path` or `mask` to cut the outline into arbitrary shapes, and animate the reveal since both `clip-path` and `mask` gradients are animatable. Reach for it whenever you want fancy image hover effects without adding markup.

## how
Make the outline as thick as half the image size, then offset it inward by the same amount with a negative value; a semi-transparent color turns it into an overlay. Transition the `outline` shorthand on `:hover` to animate the change:

```css
img {
  --s: 250px; /* the size of the image */
  --b: 8px;   /* the border thickness*/
  --g: 14px;  /* the gap */
  --c: #4ECDC4;

  width: var(--s);
  aspect-ratio: 1;
  outline: calc(var(--s) / 2) solid #0009;
  outline-offset: calc(var(--s) / -2);
  cursor: pointer;
  transition: 0.3s;
}
img:hover {
  outline: var(--b) solid var(--c);
  outline-offset: var(--g);
}
```

To avoid depending on the image's exact size, use a very large outline thickness (`100vmax`) plus a `clip-path` or `mask` to cut it down to a star, heart, or any custom shape — the outline itself supplies the fill color, and the clip/mask supplies the shape.

## gotchas
- `100vmax` as the outline thickness can misbehave in Safari; fall back to half the image size in that case.
