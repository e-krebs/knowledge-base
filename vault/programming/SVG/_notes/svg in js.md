---
source: https://kurtextrem.de/posts/svg-in-js
fetched: 2026-09-13
published: 2023-06-30
status: fresh
---
Importing SVGs as JSX components (e.g. via svgr) bundles them as JavaScript, which the author calls "the most expensive form of sprite sheet" — it costs more to parse/compile than the equivalent image, bloats the JS bundle, and hurts runtime rendering and memory. Reach for one of the techniques below whenever SVG icon markup shows up inside a JS bundle instead of HTML.

## how
- **`<img src={HeartIcon}>`** (bundler externalizes the `.svg` to a URL, e.g. Webpack `asset/resource`). Cheaper than inline SVG on DPR>1x screens, supports `loading="lazy"` / `fetchpriority`. Trade-off: `currentcolor` and CSS custom props don't inherit (the SVG is an external resource, not part of the DOM), Chromium caps SVG animation to 60Hz and uses more CPU on DPR=1x screens, and `<a>` tags inside the SVG can't be clicked.
- **`<use href="icons.svg#id">` sprites** (icons wrapped in `<symbol id="...">` inside one sprite file). Enables `fill`/`currentcolor`/CSS styling, the sprite loads once and is cached. Trade-off: `<mask>` and `<clipPath>` don't work when the SVG is loaded externally this way (fixed only by inlining), and SVGs can't be loaded cross-origin from a CDN with `<use>` at all.
- **CSS `mask-image` + `background-color: currentcolor`**, for the CORS case where `<use>` can't reach a CDN SVG. Only works for a single color. Trade-off: same as background images on LCP elements — the browser must download and execute the CSS before it can discover and fetch the SVG, delaying when it appears (mitigate with `<link rel="preload" as="image">` or inlining the CSS).
- **Inlining SVG-in-HTML** (server-rendered, injected as a hidden sprite right after `<body>`, referenced via `<use href="#id">` with no file path). No extra HTTP request, displays immediately. Trade-off: bytes are downloaded on every non-cached page load, and inline SVGs join the DOM so they increase the amount of layout/paint work. Budget rule of thumb: inline logos first (brand recognition, avoids flicker/CLS), then in-viewport icons (search, hamburger), lazy-load the rest.
- **React Server Components** (no `'use client'` on the file). Keeps the SVG server-only so it's never shipped in the client JS bundle. Trade-off: only avoids the JS bundle; if the output is inlined into HTML it carries the same DOM-size caveats as the inlining technique above.

```js
// Webpack: externalize .svg to a URL instead of inlining
module.exports = {
  module: {
    rules: [{ test: /\.svg/, type: "asset/resource" }],
  },
};
```

## gotchas
- Update 2025: Chrome 137 allows `<use>` to reference SVGs without an ID.
- IDs used for `<use>`/sprite references are global to the page, not scoped to the SVG file — collisions are possible once you inline multiple sprites.
