---
source: https://medium.com/@RitikaAgrawal08/the-6-must-know-rules-of-margin-collapsing-in-css-56968836827d
fetched: 2026-09-11
published: 2023-10-07
status: fresh
---
Margin collapsing merges two adjacent vertical margins into a single margin instead of adding them together, which is why a top/bottom margin pair often produces a smaller gap than expected. Reach for these six rules whenever a layout's spacing looks wrong between siblings, or a child's margin seems to "leak" out through its parent.

## how
- Margins collapse in only one direction — normally vertical, or horizontal if `writing-mode` is set to `vertical-lr`/`vertical-rl`.
- Elements must be adjacent: a `<br>` or `<hr>` between them prevents the collapse.
- When two margins differ, the bigger value wins; for two negatives, the more negative wins; a positive and a negative cancel out (`50px + (-30px) = 20px`).
- Margins never collapse on inline, inline-block, inline-flex or inline-grid elements.
- Margins never collapse for the children of `display: flex` or `display: grid` containers.
- A parent and child margin can collapse together, taking the larger of the two:

```css
.yellow { margin-top: 10px; height: 50px; }
.blue   { margin-top: 25px; height: 100px; }
.green  { height: 35px; margin-bottom: 10px; }
```

Here `.yellow`'s 10px `margin-top` collapses into `.blue`'s 25px, so the visible gap above `.blue` is 25px (the larger value), not 35px.

## gotchas
- Parent-child collapsing is blocked when the parent has padding, a border, or a fixed height — a fixed height only blocks the bottom margin from collapsing; the top margin still collapses through it.
