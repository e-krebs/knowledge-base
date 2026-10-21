---
source: https://www.joshwcomeau.com/css/center-a-div/
fetched: 2026-09-11
published: 2024-02-13
status: stale
---
Centering an element depends on which layout mode it lives in: Flow layout wants auto margins, floating UI (a modal, a banner) wants positioned layout plus auto margins, a stack of overlapping elements wants Grid, and one-off single/multi-child centering wants Flexbox. Pick the technique that matches the layout mode already in play instead of reaching for a generic "centering hack".

## how

### Auto margins (Flow layout)
Constrain the width, then let both auto margins split the leftover space evenly:
```css
.element {
  max-width: fit-content;
  margin-inline: auto;
}
```
Best for centering a single child horizontally without affecting siblings (e.g. an image between paragraphs).

### Flexbox
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```
Works even when children overflow their container (they overflow symmetrically), and for one or many children. The most versatile default.

### Positioned layout (floating UI)
Anchor to all four edges, constrain size, then let `margin: auto` resolve the "impossible" 4-edge constraint by centering instead of anchoring to an edge:
```css
.element {
  position: fixed;
  inset: 0px;
  width: 12rem;
  height: 5rem;
  max-width: 100vw;
  max-height: 100dvh;
  margin: auto;
}
```
Drop `top`/`bottom` (or `left`/`right`) to center on only one axis, e.g. a bottom-anchored, horizontally-centered cookie banner. With an unknown-size element, swap the fixed `width`/`height` for `width: fit-content; height: fit-content;` and it shrinkwraps while staying centered.

### CSS Grid
```css
.container {
  display: grid;
  place-content: center;
}
```
Terser than Flexbox for the simple case, but the grid's own layout algorithm (percentages resolve against the grid cell, not the container) can trip up child sizing — prefer Flexbox unless you need Grid's other trick: stacking multiple elements in the same cell with `grid-row: 1; grid-column: 1;` plus `place-items: center` on the container.

### Centering text
None of the above move individual glyphs — add `text-align: center` alongside any method to also center the text itself.

## gotchas
- The Grid solution resolves child `width`/`height` percentages against the grid cell (which shrinkwraps to content by default), not the container — this can make a percentage-sized child render far smaller than expected; Flexbox doesn't have this problem.
- `align-content: center` on a plain Flow container (no `display: flex`/`grid`) is a newer, simpler way to center vertically — Baseline since April 2024 (Chrome 123, Safari 17.4, Firefox), close to Baseline widely available by September 2026; it covers only the single-axis vertical-centering case, not a full replacement for the other methods here.
