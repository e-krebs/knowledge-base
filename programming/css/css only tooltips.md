---
source: https://shrutibalasa.substack.com/p/css-only-tooltip-using-attr-22-10-26
fetched: 2026-09-10
published: 2022-10-26
status: fresh
---
CSS's `attr()` function reads an element's `title` attribute straight into the `content` property, so a hover-revealed pseudo-element can show it as a tooltip without stuffing hidden text into the markup. Reach for it instead of the classic hidden-span pattern when you want one reusable tooltip class that works on any element that already carries a `title`.

## how
The core of the technique is a single declaration:

```css
content: attr(title);
```

Apply this inside a tooltip class's `content` property so the class reads whatever `title` value is on the element it's put on — no extra span, no JavaScript.

## gotchas
- `attr()` reliably feeds only the `content` property; using it with other properties is still experimental.
- Tooltips built this way have accessibility drawbacks — use them only when the tooltip content isn't essential.
