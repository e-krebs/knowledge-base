---
source: https://css-irl.info/radial-gradients-and-css-trigonometric-functions/
fetched: 2026-09-10
published: 2023-11-14
status: fresh
---
Layering several radial gradients and positioning each with `cos()`/`sin()` around a central point produces flower-like shapes, treating the petals like points on a clock face. Reach for it when you want a purely CSS-drawn organic or geometric pattern without SVG, driven by custom-property angles and a shared radius.

## how
Smooth a single gradient's edge with `calc()` to avoid a jagged circle:
```css
.item {
  background: radial-gradient(
    circle at 50% 50%,
    black 20%,
    transparent calc(20% + 1px)
  );
}
```
Position each petal by converting an angle into x/y offsets from the center:
```css
--x: calc(var(--posX) + cos(var(--angle)) * var(--radius));
--y: calc(var(--posY) + sin(var(--angle)) * var(--radius));
```
For six evenly-spaced petals:
```css
.item {
  --posX: 50%;
  --posY: 50%;
  --angle: 360deg / var(--numberOfCircles, 6);
  --radius: 20%;

  --a1: calc(var(--angle) * 1);
  --x1: calc(var(--posX) + (cos(var(--a1)) * var(--radius)));
  --y1: calc(var(--posY) + (sin(var(--a1)) * var(--radius)));
  /* ...repeated for additional petals */
}
```
