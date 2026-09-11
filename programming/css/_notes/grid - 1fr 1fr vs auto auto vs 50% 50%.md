---
source: https://frontendmasters.com/blog/1fr-1fr-vs-auto-auto-vs-50-50/
fetched: 2026-09-11
published: 2025-06-11
status: fresh
---
`grid-template-columns: 1fr 1fr`, `50% 50%`, and `auto auto` all produce two equal-width columns at rest, but they diverge as soon as `gap` or oversized content enters the picture. Reach for this when a grid with percentage or `auto` columns overflows its container, or when deciding which unit to use for predictable column sizing.

## how
- `50% 50%` with a `gap` busts out of the container, because the total width becomes `50% + gap + 50%`, which exceeds 100%. Fix it by subtracting half the gap from each column:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, 50% - calc(16px / 2));
}
```
- `auto` sizes each column to the intrinsic size of its content, so a column with more text (or a wide image) grows larger than its sibling — hard to predict with arbitrary content.
- `fr` columns behave the most predictably: an oversized image grows its own column but the sibling `fr` column takes up only the remaining space.
- All three (`fr`, `auto`, and to a lesser extent `50%`) can still "blow out" when content that can't wrap (e.g. a long URL) forces a column wider than intended. The minimum width of a sized column is effectively `auto`, so `overflow` alone won't contain it — give the column permission to shrink instead:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

## gotchas
- `overflow` on the grid container does nothing to stop a blowout by itself — you need `minmax(0, 1fr)` (or similar) on the columns themselves.
- Columns don't all need to match: mixing units (`grid-template-columns: 20% 1fr;` or `auto 1fr`) is valid and often useful.
