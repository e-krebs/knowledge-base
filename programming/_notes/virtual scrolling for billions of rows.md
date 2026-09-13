---
source: https://rednegra.net/blog/20260212-virtual-scroll/
fetched: 2026-09-13
published: 2026-02-12
status: fresh
---
Rendering a table with billions of rows breaks a plain `<table>` two ways: the browser can't hold that much data in memory, and it caps how tall a single HTML element can be (the article cites Firefox's worst case at about 17 million pixels). `<HighTable>` fixes this by lazily loading only the visible rows, rendering just a slice of `<tr>`s absolutely positioned inside a full-height "canvas", and remapping the native scrollbar's position onto the real row index once the table would exceed the browser's max element height. Reach for the row slice as soon as a table has more than a few hundred rows (Chrome recommends under 300 live elements), and for the scrollbar remap past about 500K rows, where the canvas height would hit the browser cap.

## how
Only the visible rows are rendered, absolutely positioned inside a `canvas` div sized to the full table height, nested in the scrollable `viewport`:
```html
<div class="viewport" style="overflow-y: auto;">
  <div class="canvas" style="position: relative; height: 30000px;">
    <table class="table" style="position: absolute; top: 3000px;">
      <!-- only the visible rows -->
    </table>
  </div>
</div>
```
Visible row range from the scroll position:
```js
const rowStart = Math.floor(firstVisiblePixel / rowHeight)
const rowEnd = Math.ceil(lastVisiblePixel / rowHeight)
```
Above a threshold (8M px in hightable), the canvas height is capped and `scrollTop` is downscaled to remap onto the real row index:
```js
const fullTableHeight = data.numRows * rowHeight
const maxCanvasHeight = 8_000_000
downscaleFactor = fullTableHeight <= maxCanvasHeight
  ? 1
  : (fullTableHeight - viewport.clientHeight) / (maxCanvasHeight - viewport.clientHeight)

firstVisibleRow = Math.floor((viewport.scrollTop * downscaleFactor) / rowHeight)
```
The rendered slice is positioned with `table.style.top = viewport.scrollTop + "px"`. Because downscaling skips rows between scroll steps, hightable also tracks `{ scrollTop, globalAnchor, localOffset }`: a big scroll delta (scrollbar drag) sets a new `globalAnchor`, a small delta (mouse wheel) adjusts `localOffset` instead, and `firstVisibleRow` is derived from `globalAnchor * downscaleFactor + localOffset` — giving fine local scrolling on top of coarse global navigation.

## gotchas
- Scrollbar precision is limited to 1 physical pixel (less on high-DPI screens), so at a large downscale factor one scrolled pixel can skip millions of rows, leaving gaps of unreachable rows unless the local/global split above is used.
- Programmatic scrolls must use `behavior: 'instant'`, not `'smooth'` — smooth scrolling fires multiple intermediate `scroll` events that clear the "programmatic scroll" flag too early and desync the state.
- `scrollTop` can land outside the valid `[0, scrollHeight - clientHeight]` range from browser over-scroll effects; clamp it on every scroll event, and use `overflow-y: clip` (not `hidden`) so the sticky header stays visible at the boundaries.
