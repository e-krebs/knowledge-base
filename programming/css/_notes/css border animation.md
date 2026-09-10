---
source: https://web.dev/articles/css-border-animations
fetched: 2026-09-10
published: 2022-08-01
status: fresh
---
Animates a border by painting it as two stacked backgrounds (a translucent overlay plus a conic-gradient) rather than the `border` property itself, then rotating the gradient's start angle with `@property` + `@keyframes`. Reach for this over `::before`/`::after` faux-borders when the box model must stay intact, and over `border-image` when the element needs a `border-radius`.

## how
```css
--border-size: 0.5rem;
border: var(--border-size) dotted lime;
background-image:
  linear-gradient(to right, rgb(255 255 255 / 0.5), rgb(255 255 255 / 0.5)),
  conic-gradient(
    from 45deg,
    #d53e33 0deg 90deg,
    #fbb300 90deg 180deg,
    #377af5 180deg 270deg,
    #399953 270deg 360deg
  );
background-origin: border-box; /* stretch backgrounds into the border area */
background-clip: padding-box; /* shrink overlay back to padding, keep gradient in the border */
```

```css
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}
```

## gotchas
- The rotating-gradient border needs `@property`, which is Baseline Newly Available (since 2024-07-09) — Widely Available isn't expected until ~January 2027.
- The simpler `border-image` alternative doesn't respect `border-radius` and renders on top of backgrounds instead of underneath, which can create unwanted layering.
