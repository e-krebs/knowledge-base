---
source: https://www.smashingmagazine.com/2023/10/animate-along-path-css/
fetched: 2026-09-11
published: 2023-10-18
status: fresh
---
Builds a circular progress donut with an object that visibly travels along the track as progress updates, using a registered custom property to animate a conic-gradient's hard stop and `offset-path`/`offset-distance` to move an indicator along the same circular path. Reach for this when a loader or progress ring needs a moving marker instead of a plain filling arc.

## how
Register a `<percentage>` custom property so it can be transitioned, then drive both the gradient stop and the offset distance from it:

```css
@property --p {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 10%;
}

.progress-circle {
  background: conic-gradient(red var(--p), #eee 0);
  border-radius: 50%;
  transition: --p 2s linear;
}

.progress-indicator {
  offset-path: path("M 100, 0 a 100 100 0 1 1 -.1 0 z");
  offset-distance: var(--p);
}

.progress-circle:hover,
.progress-circle:hover > .progress-indicator {
  --p: 80%;
}
```

A `::before` pseudo-element with a solid background and an inset punches the donut hole on top of the gradient; `offset-path` reuses the same SVG-style arc as the circle so the indicator (an emoji here) rides the exact same track.

## gotchas
- `@property` (the typed custom property that makes `--p` transitionable) is Baseline since July 2024, so the technique no longer needs a Firefox fallback.
