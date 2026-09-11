---
source: https://tylersticka.com/journal/improved-css-text-stroke/
fetched: 2026-09-11
published: 2026-08-06
status: fresh
---
`-webkit-text-stroke` always center-aligns its outline, so anything thicker than a hairline stroke eats into the letterforms and hurts legibility. Adding `paint-order: stroke fill` paints the stroke beneath the fill instead, fixing that without JS or extra markup — reach for it whenever a text outline needs to stay legible above a hairline width.

## how
```css
.example {
  paint-order: stroke fill;
  -webkit-text-stroke: 0.125em white;
}
```
`paint-order` had long-standing support in WebKit (Safari) and Gecko (Firefox) and gained Chromium support in 2024.

## gotchas
- Properties like `stroke-linejoin`/`stroke-miterlimit` don't apply here, so thick strokes can render pointy at corners.
- The stroke's shape renders rounder in Firefox than in other browsers.
- `text-shadow` still paints above the stroke — use a `drop-shadow` filter instead if a shadow is needed.
- `-webkit-text-stroke` still requires the vendor prefix in every browser.
