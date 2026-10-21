---
source: https://ryanmulligan.dev/blog/transition-to-the-other-side/
fetched: 2026-09-11
published: 2025-10-11
status: fresh
---
Container query length units let an element `translate` all the way to the opposite edge of its parent, based on the parent's own size, with no JS measuring and no GPU-hostile `top`/`left` animation. Reach for it whenever an element needs to slide fully across a container whose dimensions are dynamic or responsive.

## how
```css
.parent {
  container-type: inline-size;
}

.element {
  transition: translate 200ms ease-out;
}

.parent:active .element {
  translate: calc(100cqi - 100%);
}
```
- `1cqi` is 1% of the parent's inline size; `100cqi` is the parent's full inline size. Subtracting `100%` (the element's own translate-percentage, based on its own size) lands the element flush against the far edge.
- For vertical or two-axis movement, set `container-type: size` on the parent (so both inline and block containment apply) and use `cqb` instead of/alongside `cqi`:
```css
.parent {
  container-type: size;
}

.parent:active .element {
  translate: 0 calc(100cqb - 100%);
}
```

## gotchas
- Animating `top`/`left` instead of `transform`/`translate` works too, but triggers layout recalculation and repaints, causing janky animations — stick to `translate`/`transform`.
- Individual transform properties (`translate`, `scale`, `rotate`) apply in a fixed, pre-defined order when combined on one element, unlike chained `transform` functions.
