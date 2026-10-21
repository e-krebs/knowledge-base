---
source: https://developer.chrome.com/blog/css-relative-color-syntax/
fetched: 2026-09-11
published: 2023-10-11
status: fresh
---
Relative color syntax lets a color function derive a new color from an existing one by prefixing it with `from <color>`, exposing that color's channels (e.g. `r g b`, `h s l`, `alpha`) as variables to reuse, adjust with `calc()`, or discard. It replaces the old approach of manually splitting a color into custom-property channels just to build a lighter/darker/transparent variant, and is the go-to technique for palette generation, contrast-safe text colors, and opacity variants from a single base color.

## how
Put `from <color>` as the first argument, then reference the channel variables for the output color space:

```css
:root {
  --brand-color: hsl(300deg 75% 50%);
  --brand-color-variant: hsl(from var(--brand-color) h s l / 50%);
}
```
Channel variables can be reordered, repeated, replaced with literals, or fed through `calc()`; the color after `from` is converted into the output function's color space first, so the input and output notations don't need to match.

### Lighten/darken by an amount, adjust opacity, complement
```css
.lighten-by-25          { background: oklch(from blue calc(l * 1.25) c h); }
.darken-by-25           { background: oklch(from blue calc(l * .75)  c h); }
.decrease-opacity-by-25 { background: rgb(from lime r g b / calc(alpha / 2)); }
.complementary-color    { background: hsl(from blue calc(h + 180) s l); }
```

### Contrast-safe text via L* delta
```css
.well-contrasting-darker-color {
  background: darkred;
  color: oklch(from darkred calc(l + .60) c h);
}
```

### Palettes from one base color (OKLCH)
```css
:root {
  --base-color: deeppink;
  --color-0: oklch(from var(--base-color) calc(l + .20) c h); /* lightest */
  --color-2: var(--base-color);
  --color-4: oklch(from var(--base-color) calc(l - .20) c h); /* darkest */
}
```
Triadic and tetradic palettes follow the same pattern, rotating `h` by `120deg` or `90deg` steps instead of adjusting `l`.

## gotchas
- Feature-detect before relying on it: `@supports (color: rgb(from white r g b)) { /* safe to use */ }`.
- Relative color syntax is now supported across all major engines (Chrome 119+, Firefox full support from 130, Safari full from 18.0), making it the current non-experimental way to derive palette colors; `contrast-color()` is a complementary, not-yet-Baseline addition, not a replacement.
