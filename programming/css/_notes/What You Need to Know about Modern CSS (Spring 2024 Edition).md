---
source: https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-spring-2024-edition/
fetched: 2026-09-10
published: 2024-03-26
status: fresh
---
A bookmarkable tour of roughly a dozen modern CSS features as of spring 2024, each with a plain-language explanation, reference code, and a browser-support line. Useful as a refresher on container queries, view transitions, anchor positioning, nesting and similar primitives, and as a checklist of what has since matured given how unevenly several of these still shipped at the time.

## how

### Container Queries (Size)
Write styles for a container's children based on that container's own size instead of the whole viewport — valuable for component-based design systems.
```css
.element-wrap { container: element / inline-size; }
@container element (min-inline-size: 300px) {
  .element { display: flex; gap: 1rem; }
}
```
Support (September 2026): Baseline widely available since 2023.
### Container Queries (Style)
Apply a block of styles when a container's custom property matches a given value — effectively a CSS mixin, but one that respects the cascade.
```css
@container style(--variant: 1) { button { } }
```
Support (September 2026): reached Baseline Newly Available in 2026 (Chrome 148 Dec 2025, Safari 26.5 Mar 2026, Firefox 151 May 2026).
### Container Units
`cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax` size an element relative to its container instead of the viewport. No fenced snippet in the source; typography that should grow with the component, not the page, is the article's example use case.
Support (September 2026): Baseline widely available.
### The `:has()` Pseudo Selector
Conditionally select an element when something deeper in its DOM tree matches the selector inside `:has()` — a "parent"/"family" selector, combinable with `:not()`.
```css
figure:has(figcaption) { border: 1px solid black; padding: 0.5rem; }
```
Support (September 2026): Baseline widely available.
### View Transitions
Two kinds: same-page (needs JS, `document.startViewTransition(...)`) and multi-page (CSS only, via a `<meta name="view-transition" content="same-origin">` tag and a shared `view-transition-name`). No CSS-only fenced snippet in the source.
Support (September 2026): same-document transitions reached Baseline Newly Available in Oct 2025 (all major engines); cross-document remains Chromium/Safari-only, Firefox in progress.
### Nesting
Write additional selectors inside an existing ruleset instead of repeating the parent selector; unlike Sass, `&` can't be combined directly into a suffix (no `&__big`).
```css
.card { > h2:first-child { margin-block-start: 0; } }
```
Support (September 2026): Baseline widely available.
### Scroll-Driven Animations
Tie an animation to an element's scroll progress or its position in the viewport, instead of binding JS scroll listeners.
```css
animation-timeline: scroll();
animation-timeline: view();
```
Support (September 2026): still not Baseline; Firefox support sits behind a flag in stable as of mid-2026 (~85% caniuse).
### Anchor Positioning
Declare an element an anchor and give it a name, then position other elements to its top/right/bottom/left (or the logical equivalents) without them needing to be its DOM child. No fenced snippet in the source — at publication it only ran in Chrome Canary behind a flag.
Support (September 2026): reached Baseline in 2026 across Chrome 125+, Firefox 132+ and Safari 18.2+.
### Scoping (`@scope`)
Limit a block of CSS to a selector's subtree, optionally stopping at a boundary selector ("donut scoping"); ties resolve by proximity to the scoping root rather than by source order.
```css
@scope (.card) to (.markdown-output) { h2 { background: tan; } }
```
Support (September 2026): reached Baseline Newly Available in 2026 once Firefox 146 shipped it in December 2025.
### Cascade Layers
Order style precedence by declared layer rather than selector specificity; a lower layer can hold a third-party library so a team's own styles always win. Unlayered styles beat every layer.
```css
@layer reset, default, themes, patterns, layouts, components, utilities;
```
Support (September 2026): Baseline widely available.
### Logical Properties
Use flow-relative properties (`margin-inline-end`, `margin-block-start`) instead of physical ones (`margin-right`, `margin-top`) so spacing adapts automatically when the page is translated to a right-to-left language. No fenced snippet in the source — only the property-name pairing.
Support (September 2026): Baseline widely available.
### P3 Colors
`oklch()` and `oklab()` reach the wider Display P3 gamut — about 50% more colors than sRGB — while `oklch()` keeps a perceptually uniform lightness channel, unlike `hsl()`. No fenced snippet given for a specific color value.
Support (September 2026): Baseline widely available.
### Color Mixing
`color-mix()` blends two colors within a chosen color model — useful for an on-the-fly lighten/darken, or generating a whole palette from one base color. No fenced snippet given for a specific mix.
Support (September 2026): Baseline widely available.
### Margin Trim
Drop the margin at a container's trailing edge without a `:last-child` selector on the child — the property goes on the parent instead.
```css
.container { margin-trim: block-end; }
```
Support (September 2026): still experimental/draft, effectively Safari-only, not Baseline.
### Text Wrapping
`text-wrap: balance` evens out line lengths when text wraps (good for headlines); `text-wrap: pretty` avoids leaving one orphaned word on the last line (better for body text).
```css
text-wrap: balance;
text-wrap: pretty;
```
Support (September 2026): `balance` is now solidly Baseline across major browsers, as the article predicted; `pretty` still lacks Firefox support.
### Subgrid
A nested grid element inherits its parent's column or row tracks instead of building its own, so DOM-nested elements (e.g. inside a `<form>`) can still line up with the outer grid.
```css
.child { grid-template-columns: subgrid; }
```
Support (September 2026): reached Baseline Widely Available on March 15, 2026 — 30 months after Newly Available — whereas the article's 2024 claim of "full support" was premature.

## gotchas
- The support lines above are the September 2026 ones; the article's own support table is from spring 2024 and reads as outdated for several entries — container style queries, anchor positioning, `@scope`, and subgrid all matured well past what it described.
