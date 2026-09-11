---
source: https://ishadeed.com/article/conditional-css-has-nth-last-child/
fetched: 2026-09-11
published: 2023-05-16
status: fresh
---
`:nth-last-child(n + X)` selects the last X items of a list, counted from the Xth-from-last item, which makes it a quantity query: "style these items when there are X or more of them." Combined with `:has()`, the same check can run on the *parent* instead of just the trailing siblings, so a component can change its own layout (grid density, header order, avatar stacking, timeline style) based purely on how many children it has, no JS required.

## how
Toggle a custom property from the `:has()` + `:nth-last-child()` check, then style with a `@container style()` query so the layout rule isn't nested inside the selector and can be reused elsewhere:

```css
/* default grid */
.list {
  --item-size: 200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--item-size), 1fr));
  gap: 1rem;
}

/* If the grid has 5+ items, shrink the item size */
.list:has(li:nth-last-child(n + 5)) {
  --item-size: 150px;
}
```

For styling elements other than direct siblings (e.g. a whole subtree), set a boolean custom property and read it with a style query:

```css
.post-author:has(img:nth-last-child(n + 2)) {
  --multiple-avatars: true;
}

@container style(--multiple-avatars: true) {
  img:not(:first-child) {
    border: solid 2px #fff;
    margin-left: -0.25rem;
  }
}
```

## gotchas
- `@container style()` queries now run in all three engines (Firefox added support in April 2026, ~91% global support), but that's still short of the 30-month Baseline widely-available bar.
