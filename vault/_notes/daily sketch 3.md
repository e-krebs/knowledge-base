---
source: https://yuanchuan.dev/daily-sketch-3
fetched: 2026-09-14
published: 2023-02-21
status: fresh
---
yuanchuan's third daily-sketch post builds a Latin square in css-doodle — an n×n grid where n distinct values appear exactly once per row and column — using the `cycle` function, then moves on to `@dx`/`@dy`, the grid-position values that report each cell's coordinates relative to the center. It exercises `cycle`/`once`/`pn`/`pd` chaining for non-repeating sequences and `@dx`/`@dy`/`@hypot` for distance-based effects such as a staggered animation delay.

## how

### Latin Square
```css-doodle
@grid: 3 / 160px;
@content: @pn.once.m3.pn.cycle(1, 2, 3);
```
Trick: chaining `cycle` with `once`/`m3`/`pn` is what makes each value land exactly once per row and column.

### Grid numbers
```css-doodle
@grid: 7 / 200px;
@content: @dx, @dy;
```
Trick: `@dx`/`@dy` are numbers in each cell relative to the grid's center.

### Grid numbers
```css-doodle
@grid: 7 / 200px;
@content: @round.hypot(@dx, @dy);
```
Trick: `hypot(@dx, @dy)` turns those two center-relative numbers into a straight-line distance from center.

### Grid numbers
```css-doodle
@grid: 7 / 200px;
--n: @calc(abs(@dx) + abs(@dy));

animation: scale 2s ease infinite;
animation-delay: calc(var(--n) * -.2s);

@keyframes scale {
  50% { transform: scale(0) }
}
```
Trick: the same center-distance value drives `animation-delay`, so the scale animation ripples outward from the center.
