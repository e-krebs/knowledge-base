---
source: https://una.im/5-css-functions/
fetched: 2026-09-11
published: 2025-08-13
status: fresh
---
The `@function` rule lets you define a custom CSS function that takes arguments and runs logic to return one value, called with a `--my-function()` syntax rather than `var()`. Reach for it to package repeated `calc()`/`clamp()`/`if()` expressions — negation, opacity variants, fluid type scales, conditional radii, responsive grid templates — into a named, reusable call.

## how

### Negation
```css
@function --negate(--value) {
  result: calc(-1 * var(--value));
}
/* usage: padding: --negate(var(--gap)); */
```

### Opacity variant of a color
```css
@function --opacity(--color, --opacity) {
  result: rgb(from var(--color) r g b / var(--opacity));
}
/* usage: background-color: --opacity(red, 80%); */
```

### Fluid typography
```css
@function --fluid-type(--font-min, --font-max, --type: 'header') {
  --scalar: if(style(--type: 'header'): 4vw;
               style(--type: 'copy'): 0.5vw);
  result: clamp(var(--font-min), var(--scalar) + var(--font-min), var(--font-max));
}
```

### Conditionally-rounded border
Removes the radius as an element's edge approaches the viewport edge, so it goes full-width without a media query:
```css
@function --conditional-radius(--radius, --edge-dist: 4px) {
  result: clamp(0px, ((100vw - var(--edge-dist)) - 100%) * 1e5, var(--radius));
}
/* usage: border-radius: --conditional-radius(1rem); */
```

### Responsive sidebar layout
```css
@function --layout-sidebar(--sidebar-width: 20ch) {
  result: 1fr;
  @media (width > 640px) {
    result: var(--sidebar-width) auto;
  }
}
/* usage: grid-template-columns: --layout-sidebar(); */
```

Arguments accept custom properties or direct values, and can have default values (as in the `--type`, `--edge-dist`, and `--sidebar-width` params above).

## gotchas
- `@function` remains Chrome-only/experimental (~67% global support, not Baseline), unchanged since publication — no other engine has shipped it and there's no competing replacement.
- A function returns exactly one value; for applying multiple declarations at once, the draft spec's `@mixin`/`@apply` (not yet shipped at publication) is the intended tool instead.
