---
source: https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-spring-2024-edition/
fetched: 2026-09-10
published: 2024-03-26
status: fresh
---
A survey of about a dozen modern CSS features as of spring 2024, each summarized in one line with a short snippet where the source gives one. Useful as a refresher on container queries, view transitions, anchor positioning, nesting, and similar layout/typography primitives, and as a checklist of what has since landed given how many of these were still shipping unevenly across browsers at the time.

## how
- **Container Queries (Size)** — style an element based on its container's size instead of the viewport (support: Baseline widely available since 2023)
- **Container Queries (Style)** — apply styles when a container's custom property matches a value, like a CSS mixin (support: Baseline newly available, 2026)
- **Container Units** (`cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax`) — size elements relative to the container instead of the viewport (support: Baseline widely available)
- **`:has()`** — style an element based on whether its descendants match a selector (support: Baseline widely available)
- **View Transitions** — animate automatically between DOM states, same-page via JS or multi-page via CSS (support: same-document Baseline newly available since Oct 2025; cross-document still Chromium/Safari-only, Firefox in progress)
- **Nesting** — group related selectors inside a parent ruleset (support: Baseline widely available)
- **Scroll-Driven Animations** — tie `animation-timeline` to scroll or view position instead of JS scroll listeners (support: not Baseline; Firefox still behind a flag in stable, ~85% caniuse)
- **Anchor Positioning** — position an element relative to a named anchor elsewhere in the DOM (support: Baseline, 2026)
- **`@scope`** — limit a ruleset to a selector's subtree ("donut scoping") (support: Baseline newly available, 2026)
- **Cascade Layers** — order style precedence by declared layer instead of selector specificity (support: Baseline widely available)
- **Logical Properties** — use flow-relative directions (inline/block/start/end) instead of physical ones (support: Baseline widely available)
- **P3 Colors and Color Mixing** — reach wider-gamut colors via `oklch()`/`oklab()` and blend colors with `color-mix()` (support: Baseline widely available)
- **Margin Trim** — drop margin at a container's edge without targeting first/last child (support: not Baseline; still experimental/draft, effectively Safari-only)
- **Text Wrapping** — prevent orphan words with `text-wrap: balance`, balance line lengths with `pretty` (support: `balance` is Baseline; `pretty` still lacks Firefox)
- **Subgrid** — let a nested grid inherit its parent's tracks (support: Baseline widely available since March 2026)

## gotchas
- The support statuses above are the September 2026 ones; the article's own support table is from spring 2024 and is stale for several entries (container style queries, anchor positioning, @scope, subgrid all matured since).
