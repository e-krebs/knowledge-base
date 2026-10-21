---
source: https://blog.logrocket.com/using-css-content-visibility-boost-rendering-performance/
fetched: 2026-09-11
published: 2023-11-08
status: stale
---
`content-visibility` lets the browser skip layout, style, and paint work for an element's children until the element is needed, which speeds up initial render on long pages. Reach for it on large pages you can split into distinct off-screen sections — landing pages with many below-the-fold sections, or SPA views left inactive in the DOM.

## how
```css
.offscreen-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
}
```
- `visible` (default): renders normally.
- `auto`: turns on layout/style/paint containment; skips rendering contents when off-screen, but they stay in the DOM and accessibility tree.
- `hidden`: skips contents regardless of on/off-screen; contents are not accessible until switched back to `visible`.

Pair it with `contain-intrinsic-size` so the browser doesn't collapse the element to zero height while it's skipped — `auto <length>` gives a placeholder size that gets replaced by the real rendered size once the element is seen, and that size is remembered on scroll-away.

## gotchas
- Without `contain-intrinsic-size`, sections can grow/shrink as they enter the viewport, causing scrollbar jumping.
- Off-screen content under `content-visibility: auto` stays in the accessibility tree — a `display: none` or `visibility: hidden` element inside it will also show up there until it's on-screen; add `aria-hidden="true"` manually if that's wrong.
- As of Sept 2025 all three major engines support `content-visibility` unflagged (Baseline newly available, not yet widely available) — the article's "Firefox behind a flag" caveat is outdated.
