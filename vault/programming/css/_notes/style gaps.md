---
source: https://developer.chrome.com/blog/gap-decorations
fetched: 2026-09-11
published: 2025-06-11
status: fresh
---
CSS gap decorations extend `column-rule` (previously multi-column-only) to grid and flexbox, and add a new `row-rule` property, so you can draw lines between flex/grid items directly instead of faking them with borders, pseudo-elements, or extra DOM elements. Reach for it when styling gaps in calendars, cards, or data grids — the decorations are purely visual and don't affect layout or spacing.

## how
```css
.sudoku {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  gap: 6px;
  column-rule-width: repeat(2, 1px) 4px repeat(2, 1px) 4px repeat(2, 1px);
  column-rule-style: solid;
  column-rule-color: var(--secondary);
  row-rule-width: repeat(2, 1px) 4px repeat(2, 1px) 4px repeat(2, 1px);
  row-rule-style: solid;
  row-rule-color: var(--secondary);
}
```
The `repeat()` syntax (as in CSS Grid) creates patterns of decorations across a container. New properties like `*rule-break`, `*rule-outset`, and `gap-rule-paint-order` control how rules behave at intersections and with spanning items — e.g. `column-rule-break: intersection` breaks a column rule at each row-gap intersection, and `row-rule-break: none` keeps a row rule running uninterrupted.

## gotchas
- Support status as of June 11, 2025 (page's date): available for developer trial in Chrome and Edge 139+ only, behind the "Enable Experimental Web Platform Features" flag at `chrome://flags` or `edge://flags`.
- Still being implemented in Chromium — known limitations include animating gap decorations and using a very large number of grid tracks.
