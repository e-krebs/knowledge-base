---
source: https://shrutibalasa.substack.com/p/split-background-color-with-one-line-22-11-09
fetched: 2026-09-10
published: 2022-11-09
status: fresh
---
Splitting a section into two flat background colors is usually done with extra elements or pseudo-selectors, but a single `linear-gradient` with two matching color stops produces a hard edge instead of a fade. Reach for it whenever you need a clean two-color split background with no additional markup.

## how
```css
background: linear-gradient(to right, white 60%, violet 60%);
```

Repeating the same percentage (`60%`) for both color stops turns the gradient into a hard split at that point rather than a blend. Percentages aren't required — fixed values like `100px`, or `calc()` for more complex math, work the same way.

For a vertical split on smaller screens, swap `to right` for `to bottom` inside a media query.

The technique accommodates plenty of variation: adjust where the split falls, mix fixed pixel widths with percentages, or combine `calc()` expressions for more elaborate layouts — it's still just the one gradient declaration.
