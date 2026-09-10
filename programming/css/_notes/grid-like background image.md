---
source: https://twitter.com/lukyvj/status/1621552822650011649
fetched: 2026-09-10
published: 2023-02-03
status: fresh
---
A grid-paper background from one `conic-gradient()` and a background size, in a single `background` shorthand. Reach for it when a layout needs graph-paper lines behind content without an image or a second element.

## how
```css
background: conic-gradient(from 90deg at 1px 1px, #000 90deg, white 0) 0 0 / 10px 10px;
```
The gradient paints a 1px black corner in each 10px tile, and the tiling draws the grid; change `10px 10px` for the cell size and `1px 1px` for the line width.

## gotchas
- The code lived in an image on the tweet; the line above is a transcription.
