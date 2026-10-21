---
source: https://css-tricks.com/using-grid-named-areas-to-visualize-and-reference-your-layout/
fetched: 2026-09-10
published: 2022-08-26
status: fresh
---
`grid-template-areas` lets you draw the layout as ASCII art directly in the CSS, then hand each element a name instead of line numbers. Reach for it whenever a layout has to be redefined per breakpoint — the named strings double as a visual diagram, and children keep the same `grid-area` name no matter how the parent's shape changes.

## how
```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 200px);
  grid-template-areas:
    "head head"
    "nav main"
    "foot foot";
}

header { grid-area: head; }
nav    { grid-area: nav; }
main   { grid-area: main; }
footer { grid-area: foot; }
```
Redefine only the container at each breakpoint — the children's `grid-area` rules don't change:
```css
@media (min-width: 800px) {
  .parent {
    grid-template-columns: 0.5fr 1fr;
    grid-template-rows: 100px 1fr 1fr 100px;
    grid-template-areas:
      "head head"
      "left main"
      "right main"
      "foot foot";
  }
}
```

## gotchas
- Every quoted row needs the same number of cells, or it's a syntax ("trash token") error.
- Named areas must be rectangular — no L- or T-shaped regions.
- Use a null cell token (`.`) to leave a cell unnamed; string multiple dots together with no spaces (`"foot ...."`) for readability.
- Named areas generate implicit `<name>-start`/`<name>-end` line names, usable for placements outside the named cells (e.g. `grid-area: left-start / left-start / right-end / main-end`).
