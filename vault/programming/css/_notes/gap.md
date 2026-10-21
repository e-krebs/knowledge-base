---
source: https://ishadeed.com/article/the-gap/
fetched: 2026-09-11
published: 2024-05-31
status: fresh
---
The `gap` property (shorthand for `column-gap`/`row-gap`) adds gutters between flex or grid items, replacing margin-based spacing hacks — reset classes for the last child, negative-margin gutter tricks, and manual RTL flipping. Reach for it whenever you're spacing out flex or grid children, especially when items wrap or the layout needs to support both LTR and RTL.

## how
```css
.wrapper {
  --gutter: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gutter);
}
```
- Works when children wrap: `gap` keeps applying correctly across wrapped rows, unlike margins which need extra rules for the last item per row.
- Works bidirectionally: `gap` flips automatically with the layout direction, no `dir="rtl"` overrides needed.
- Works across grid and flexbox: switching a container from `display: flex` to `display: grid` keeps the same `gap` with no extra rules.
- Mixes freely with margin/padding — e.g. use `gap` for general spacing and `margin-inline-start: auto` to push one item to the far end.

## gotchas
- You can't feature-detect `gap` for flexbox specifically with `@supports (gap: 1rem)` — the browser can't tell whether the declaration is meant for flexbox or grid, so the query always passes.
- If you can't use `gap` yet, at least put margin/padding on the element that's most likely to be conditionally removed (e.g. an avatar, not the name next to it), and prefer logical properties (`margin-inline-end`) over physical ones so RTL doesn't need manual flipping.
