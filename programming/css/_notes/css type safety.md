---
source: https://nerdy.dev/cant-break-this-design-system
fetched: 2026-09-11
published: 2023-09-01
status: fresh
---
`@property` gives a custom property an enforced type (`<angle>`, `<color>`, `<length-percentage>`, etc.), so an assignment that doesn't match the declared type is rejected and the property keeps its last known good value instead of silently breaking dependent styles. Reach for it in a design system's token layer so a bad or user-supplied value (a text input feeding a CSS variable, a typo) can't cascade into broken components.

## how
```css
@property --hue {
  syntax: '<angle>';
  initial-value: .5turn;
  inherits: false;
}
```

An out-of-type assignment is ignored, not just discarded at use — the property keeps resolving to its last valid value:

```css
.card {
  --hue: 90deg; /* accepted */
  --hue: #f00;  /* rejected, --hue stays 90deg */
  background: oklch(98% .01 var(--hue));
}
```

Typed properties compose: nest a typed property inside another custom property, and only the typed one is protected:

```css
.card {
  --_bg: oklch(98% .01 var(--hue));
  background: var(--_bg);

  @media (prefers-color-scheme: dark) {
    --_bg: oklch(15% .1 var(--hue));
  }
}
```

Build a design-system token this way and any surface derived from it (borders, box-shadows, adaptive light/dark schemes) stays valid even if the underlying token gets a bad value from user input.

## gotchas
- Type enforcement fails silently — no console warning when an assignment is rejected, so pair it with your own dev tooling if you need visibility into rejected values.
- Cross-browser support the post called "nearly complete" is confirmed: `@property` has been Baseline newly available since July 2024, with Firefox support from 128+.
