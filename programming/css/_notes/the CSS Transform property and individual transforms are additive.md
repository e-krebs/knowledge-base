---
source: https://polypane.app/blog/the-css-transform-property-and-individual-transforms-are-additive/
fetched: 2026-09-11
published: 2025-02-20
status: fresh
---
Unlike most CSS properties, `transform` and the individual transform properties (`translate`, `rotate`, `scale`) don't overwrite each other — their values are added together into the final transformation. Reach for the individual properties when you need to change one transform (e.g. scale on hover) without re-declaring and losing the others (e.g. a base rotation).

## how
```css
.box1 {
  rotate: 45deg;
}
.box1:hover {
  scale: 1.5;
}
```
The rotation from the base rule and the scale from `:hover` combine — scaling on hover no longer resets the rotation, which is what happens if both were packed into a single `transform` declaration in each state.

If both `transform` and the individual properties are set, they're additive too: a `transform: translate(200px, 100px)` plus a `translate: 200px 0` on the same element sums to a larger total translation.

## gotchas
- Order is fixed and not visually obvious: `translate` is applied first, then `rotate`, then `scale`, then the `transform` functions left to right — this is defined in the CSS transforms spec's Current Transformation Matrix section.
- A single `transform` property with multiple functions (`translate(...) rotate(...) scale(...)`) still overwrites entirely on redeclaration — the additive behavior only applies between `transform` and the individual properties, or between separate declarations of the individual properties.
