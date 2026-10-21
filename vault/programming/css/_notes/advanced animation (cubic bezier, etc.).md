---
source: https://www.smashingmagazine.com/2022/10/advanced-animations-css/
fetched: 2026-09-11
published: 2022-10-29
status: fresh
---
`cubic-bezier` curves give per-property easing control, and stacking several `animation`s with staggered `animation-delay` values lets you sequence them into one complex path — no JS required. Reach for this when a motion needs multiple distinct stages (e.g. a rollercoaster-style drop-then-loop) running along a single timeline.

## how
A `cubic-bezier(P1x, P1y, P2x, P2y)` curve is anchored between fixed endpoints `(0,0)` and `(1,1)`; `P1`/`P2` are the two control points.

Each animation's delay is the sum of the durations of every animation that must finish before it starts. Animations meant to run simultaneously share the same delay and count as one combined block when computing the delay for whatever comes after them:
```css
animation: x 4s linear forwards, y 4s linear forwards, jump 2s linear forwards;
animation-delay: 0s, 0s, 4s;
```
Pushing a control point's `y` value far outside `[0, 1]` produces an exaggerated overshoot — used here for a sliding-drop effect:
```css
animation: x 4s linear forwards,
  y 4s cubic-bezier(0.55, 0, 0.2, -5000) forwards;
animation-delay: 0s, 0s;
```
Chaining more stages (a pause, a loop) just means appending more keyframe/animation pairs and adding up their delays:
```css
animation: x 4s linear forwards,
  y 4s cubic-bezier(0.55, 0, 0.2, -5000) forwards, x2 0.5s linear forwards,
  pointOfCircle 0s linear forwards, loop 3s linear forwards;
animation-delay: 0s, 0s, 4s, 4.5s, 4.5s;
```

## gotchas
- The `x` coordinates of both control points must stay within `[0, 1]`; only the `y` coordinates can go outside that range, which is what creates overshoot/exaggerated easing.
