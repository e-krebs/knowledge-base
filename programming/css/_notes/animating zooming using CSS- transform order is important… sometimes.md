---
source: https://jakearchibald.com/2025/animating-zooming/
fetched: 2026-09-11
published: 2025-06-17
status: fresh
---
Explains why `transform: scale(3) translate(-33.1%, 20.2%)` animates with an odd swooping motion when zooming into part of an element: the CSS transform-animation algorithm interpolates `scale` and `translate` as separate linear components, so the growing `scale` acts as a changing multiplier on the `translate` distance. Reach for the fix whenever a scale+translate zoom animation "swoops" instead of moving straight to its target.

## how
Put the translate first and pre-multiply it by the final scale so scale no longer acts as a moving multiplier during the animation. The cleanest form uses the separate `scale`/`translate` properties, since `translate` is always applied before `scale` regardless of write order:

```css
.demo.zoom {
  --scale: 3;
  --x: -33.1%;
  --y: 20.2%;

  scale: var(--scale);
  translate: calc(var(--x) * var(--scale)) calc(var(--y) * var(--scale));
}
```

## gotchas
- Setting the starting `transform` to `rotate(0)` also "fixes" the swoop, but only because it forces the browser to fall back to matrix interpolation for the whole chain (rotate and scale can't share a common interpolation function) — this is an accidental spec edge case, not a recommended technique.
- For a "moving toward the camera" feel instead of a flat zoom, animate a 3D `translate` under `perspective` instead of `scale`; convert the desired scale to a translate-z with `(perspective * (scale - 1)) / scale`.
