---
source: https://flaviocopes.com/modern-css-features/
fetched: 2026-10-20
published: 2026-09-21
status: emerging
---
Twelve native CSS features that retire a Sass, PostCSS or JavaScript workaround. Ten are current, two are emerging. Reach for them to drop a build step for plain `.css`.

## Nesting
Child rules go inside the parent, `&` is the parent selector, `@media` nests too. `&__title` does not concatenate class names.

## :has()
Parent lookup in the selector: `.field:has(input:invalid)`. Specificity is that of its most specific argument. Avoid broad subjects like `body:has(.menu-open)`.

## Container queries and cqi
`container-type: inline-size` on the wrapper, then `@container (min-width: 32rem)`. `cqi` is 1% of container inline size: `clamp(1rem, 5cqi, 1.75rem)`. Not on elements sized by their content.

## Subgrid
`grid-row: span 3; grid-template-rows: subgrid;` on each card aligns children across cards. The span is required. Gaps come from the parent.

## oklch() and color-mix()
`oklch(55% 0.2 250)` for lightness, chroma, hue; `color-mix(in oklch, var(--brand), white 15%)` mixes at runtime. Out-of-gamut colors get mapped and can look duller.

## aspect-ratio
`aspect-ratio: 16 / 9` replaces the padding hack. It is a preference: content taller than the box grows it unless `overflow: hidden` or `min-height: 0`.

## Cascade layers
`@layer reset, base, components, utilities;` fixes the order whatever the specificity. Unlayered styles beat every layer, and `!important` reverses the order.

## :is() and :where()
`:is(h1, h2, h3) a` expands selectors; `:where()` adds no specificity. `:is()` takes the specificity of its most specific argument. Invalid arguments are dropped silently.

## dvh, svh and lvh
`min-height: 100svh` fixes the mobile `100vh` cut-off. `dvh` changes while the toolbar animates, so prefer `svh` for layout.

## Logical properties
`margin-inline-start`, `padding-inline`, `inset: 0`, `margin-block` follow writing direction. Do not mix with `margin-left` on the same element.

## Scroll-driven animations (emerging)
`animation-timeline: scroll(root)` or `view()` with `animation-range`. Wrap in `@supports (animation-timeline: scroll())`, keep the `animation-timeline` line after the `animation` shorthand, and gate on `prefers-reduced-motion: no-preference`.

## @starting-style (emerging)
`@starting-style { opacity: 0; }` inside the element gives the "before" state; add `transition: opacity 0.3s, display 0.3s allow-discrete`. Applies only on first render.

## gotchas
- Scroll-driven animations are not Baseline: Firefox has them only in Nightly. Feature-query them.
- `@starting-style` is Baseline Newly available, widely available expected February 2027. Firefox does not yet transition `display`, so the fade-out snaps.
