---
source: https://web.archive.org/web/20240522152054/https://fullystacked.net/linear/
fetched: 2026-09-11
published: 2023-05-19
status: fresh
---
`linear()` is an easing function that interpolates linearly between many points, so bounce, spring and elastic effects that used to need JavaScript become a single CSS value. It works wherever an easing goes: `transition-timing-function`, `animation-timing-function`, or the `easing` option of the Web Animations API.

## how
The syntax, per MDN: `linear(0, 0.25 75%, 1)` spends 75% of the time going from 0 to .25 and the last 25% going from .25 to 1. A real elastic curve is long, so generate it with Jake Archibald's Linear Easing Generator (presets for bounce, elastic, spring and Material easing) and store it as a custom property:

```css
animation-timing-function: linear(0, 0.218 2.1%, 0.862 6.5%, 1.114, 1.296 10.7%, 1.346, 1.37 12.9%, 1.373, 1.364 14.5%, 1.315 16.2%, 1.032 21.8%, 0.941 24%, 0.891 25.9%, 0.877, 0.869 27.8%, 0.87, 0.882 30.7%, 0.907 32.4%, 0.981 36.4%, 1.012 38.3%, 1.036, 1.046 42.7% 44.1%, 1.042 45.7%, 0.996 53.3%, 0.988, 0.984 57.5%, 0.985 60.7%, 1.001 68.1%, 1.006 72.2%, 0.998 86.7%, 1);
```

The same string works with the Web Animations API, read back from the custom property:

```js
const elastic = getComputedStyle(document.documentElement).getPropertyValue('--elastic-easing');
div.animate(
  [{ transform: "translateY(100px)" }, { transform: "translateY(0px)" }],
  { duration: 2000, iterations: Infinity, easing: elastic, fill: "forwards", delay: 1000 }
);
```

## gotchas
- Firefox devtools has a `linear()` editor: double-click the curve to add a point, double-click a point to remove it, shift snaps to the grid. It is unavailable when the value comes from a CSS variable.
- Support, September 2026: `linear()` is Baseline, supported everywhere since 2023.
- The original fullystacked.net domain lapsed and now redirects to an ad page, so the source is the May 2024 Wayback snapshot.
