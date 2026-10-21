---
source: https://css-irl.info/styling-external-links-with-attribute-selectors/
fetched: 2026-09-11
published: 2023-10-11
status: fresh
---
Attribute selectors let you flag external links with an appended icon purely in CSS, no extra class or markup change needed. Reach for this whenever you want to style elements based on an attribute value pattern — matching a URL prefix, substring, or suffix on `href` — instead of hand-tagging every matching element.

## how
Match links whose `href` starts with `http` (i.e. not a same-site relative link):
```css
a[href^='http'] {
  /* Styles for external links */
}
```
Other operators: `[href='exact']`, `[href*='contains']`, `[href$='.info']` (ends with), `[class~='link']` (word in space-separated list). Add `i` or `s` before the closing bracket for case-insensitive/sensitive matching, e.g. `a[href*='css-irl' i] {}`.

Append an icon via a pseudo-element, using `background-image` (not `content: url()`) so the icon size is controlled by `width`/`height` rather than the SVG's intrinsic size:
```css
a[href^='http'] {
  padding-right: 1.25em;
}

a[href^='http']::after {
  position: absolute;
  content: '';
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-left: 0.25em;
  background-size: 100%;
  background-image: url(--var(svgUrl));
}
```
The `padding-right` on the anchor plus `position: absolute` on the pseudo-element stop the icon from wrapping onto the next line by itself.

## gotchas
- `content: url("data:image/svg+xml,...")` locks the icon to the SVG's intrinsic dimensions — use `background-image` instead if you need to size the icon independent of the SVG (e.g. matching it to font-size).
- With `content: ''` (the background-image approach), the pseudo-element needs `display: inline-block` or it won't render at all.
