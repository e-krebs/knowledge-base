---
source: https://gomakethings.com/articles/the-empty-pseudo-class-in-css/
fetched: 2026-09-11
published: 2025-01-09
status: fresh
---
The `:empty` pseudo-class targets elements that have no children — no child elements, and no whitespace or text nodes either. Use it to hide items whose content is unknown ahead of time, like rows rendered from an API or database that might come back blank, without reaching for JavaScript.

## how
```css
.grid-flex > div:empty {
  display: none;
}
```
Applied to a flex/grid item that ends up with no content, this hides it instead of leaving an empty styled box in the layout.
