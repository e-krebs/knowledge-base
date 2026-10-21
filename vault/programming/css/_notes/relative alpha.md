---
source: https://nerdy.dev/relative-alpha
fetched: 2026-09-11
published: 2026-05-27
status: fresh
---
CSS relative-alpha syntax lets you derive a color's opacity from its own current alpha value inside a relative-color function, instead of hardcoding a new alpha. Reach for it when you need an opacity that's a fraction or multiple of a color's existing alpha rather than a fixed value.

## how
```css
button {
  border-color: alpha(from hotpink / calc(alpha * .25));
}
```

## gotchas
- `alpha()` (CSS Color Module Level 5 relative-alpha) is brand new and not yet Baseline / limited availability; MDN treats it as a distinct relative-color function rather than mere syntactic sugar for `color-mix()`.
