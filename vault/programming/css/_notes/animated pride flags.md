---
source: https://www.joshwcomeau.com/animation/pride-flags/
fetched: 2026-09-10
published: 2023-06-06
status: fresh
---
A wavy, pixelated flag built from a handful of columns instead of a canvas or SVG. Each column is a plain div whose horizontal stripes come from a `linear-gradient` with hard color stops, and the billow comes from a shared keyframe animation with a staggered per-column delay.

## how
```css
.flag {
  background: linear-gradient(
    to bottom,
    hsl(331deg 100% 55%) 0%    33.3%,
    hsl(50deg 100% 50%)  33.3% 66.7%,
    hsl(200deg 100% 55%) 66.7% 100%
  );
}

@keyframes oscillate {
  from { transform: translateY(8px); }
  to   { transform: translateY(-8px); }
}

.column {
  animation: oscillate 500ms infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
  animation-fill-mode: backwards;
}
```
The stagger between columns comes from setting a different `animation-delay` inline on each column element. A `--billow` custom property can replace the hardcoded `8px` so each column's amplitude can vary independently.

## gotchas
- Give each column a negative `animation-delay` so they start mid-cycle instead of all snapping into phase together on load.
- Browser pixel-rounding can leave visible gaps between columns — pick a flag width that avoids fractional column widths.
