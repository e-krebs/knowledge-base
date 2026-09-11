---
source: https://moderncss.dev/12-modern-css-one-line-upgrades/
fetched: 2026-09-11
published: 2024-01-19
status: stale
---
Twelve well-supported CSS properties that each replace a hack, an old technique, or add a low-risk enhancement in a single line — grouped as stable upgrades (fix a hack), stable enhancements (well-supported improvements), and progressive enhancements (safe even without support). Reach for this list when auditing a codebase for easy technical-debt wins.

### aspect-ratio
Replaces the "padding hack" for forcing a ratio like 16:9 — `aspect-ratio: 16/9` (or `aspect-ratio: 1` for a square) is forgiving and lets content override it, so add a dimension property like `max-width` if that's unwanted.

### object-fit
Makes an `img` (or other replaced element) resize like `background-size`; `cover` fills without distortion, `scale-down` fits fully visible with possible letterboxing — pairs well with `aspect-ratio`.

### margin-inline
Shorthand replacing `margin-left: auto; margin-right: auto;` with one logical-property line: `margin-inline: auto;`.

### text-underline-offset
Controls the gap between text baseline and underline (`text-underline-offset: 0.25em;`), replacing border/pseudo-element/gradient underline hacks; pairs with `text-decoration-color` and `text-decoration-thickness`.

### outline-offset
Pushes a focus outline away from (or into, with a negative value) the element without affecting its box size — replaces a `box-shadow` or pseudo-element hack for spaced-out focus rings.

### scroll-margin-top/bottom
Offsets scroll position without affecting layout — fixes a sticky nav covering the top of an anchor-linked section when set on `[id]` elements.

### color-scheme
Opts browser UI (form controls, scrollbars, system colors) into `dark`/`light` rendering, e.g. `color-scheme: dark light;` on `:root`, independent of or alongside `prefers-color-scheme`.

### accent-color
Recolors the checked state of checkboxes/radio buttons and the fill of `progress`/range inputs (and the default focus halo) in one declaration.

### width: fit-content
Shrink-wraps an element to its content while keeping its original `display` value, unlike switching to `display: inline-block`.

### overscroll-behavior
`overscroll-behavior: contain` stops a scrolled region (e.g. a sidebar) from handing off leftover scroll to the parent page once its own boundary is reached.

### text-wrap
`balance` evens out characters per line on short text (max six lines) to avoid orphans on headlines; `pretty` prevents an orphan word on the last line of a paragraph by evaluating the last four lines.

### scrollbar-gutter
Reserves scrollbar space in the layout (`scrollbar-gutter: stable both-edges;`) so a dialog toggling `overflow: hidden` doesn't cause a layout shift — has no effect under overlay-scrollbar OS settings.

## gotchas
- `text-wrap: balance` has since matured from a progressive enhancement to Baseline widely available (all engines since ~2024); `text-wrap: pretty` is still Baseline newly-available only — Firefox hasn't shipped it.
- `scrollbar-gutter` formally reached Baseline in December 2024 (Chrome/Firefox); the article's Safari caveat is largely moot since Safari uses overlay scrollbars by default.
