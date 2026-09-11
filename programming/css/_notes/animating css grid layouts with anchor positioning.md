---
source: https://www.bram.us/2026/09/07/animating-css-grid-layouts-with-css-anchor-positioning/
fetched: 2026-09-11
published: 2026-09-07
status: fresh
---
Animates a CSS grid's cells to their new position as the grid reflows (e.g. on viewport resize), using CSS Anchor Positioning instead of JavaScript or View Transitions. Each cell anchors an absolutely-positioned content wrapper to itself, and a plain CSS transition animates the wrapper as the anchor's position changes. Reach for this when a grid needs to visibly reorganize on resize and the animation must stay interruptible mid-flight.

## how
Grid cells can't be anchors directly (they're virtual), so inject a wrapper div (`.content`) per cell (`.cell`) and anchor it to that cell:

```css
.cell {
	height: auto;
	aspect-ratio: 1;
	anchor-scope: --a;
	anchor-name: --a;
}

.content {
	position: absolute;
	position-anchor: --a;
	inset: anchor(inside);
	width: 6rem;
	height: 6rem;
	transition: inset 0.2s ease;
}
```

Four details make it work: `anchor-scope` keeps each cell's `--a` name from clashing with other cells; `aspect-ratio` keeps cells square; the `transition` on `inset` animates the reposition; and giving `.content` explicit `width`/`height` stops it from stretching mid-transition. Because it's plain CSS transitions (no View Transitions), rapid resizes redirect mid-flight instead of queuing up.

## gotchas
- Firefox does not do style/layout interleaving for `anchor()`, so the transition never runs there and content jumps straight to its final position (tracked in Firefox bug 1924226, still open).
