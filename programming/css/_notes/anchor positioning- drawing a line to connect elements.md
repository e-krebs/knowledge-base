---
source: https://frontendmasters.com/blog/drawing-a-line-to-connect-elements-with-css-anchor-positioning/
fetched: 2026-09-11
published: 2024-04-02
status: stale
---
CSS Anchor Positioning lets a `position: absolute` element size and place itself relative to another element (its "anchor") purely in CSS, replacing the JS math that used to compute coordinates between two arbitrary elements. Reach for it whenever you need to draw a line, tooltip, or other connector between two elements whose positions can move.

## how
Give each anchor target a name, then position the connecting element's edges against those anchors with the `anchor()` function:
```css
.link {
  position: absolute;
  min-block-size: 2px;
  background-image: linear-gradient(to bottom, black, black), linear-gradient(to right, black, black), linear-gradient(to bottom, black, black);
  background-size: 2px, 50% 2px, 50% 2px;
  background-position: center, top left, bottom right;
  background-repeat: no-repeat;
}

[data-col1="2"] li:nth-child(4) {
  anchor-name: --link-col1;
}

.link--alpha {
  inset-block-start: anchor(--link-col1 center);
  inset-inline-start: anchor(--link-col1 right);
  inset-inline-end: anchor(--link-col2 left);
  inset-block-end: anchor(--link-col2 center);
}
```
The layered `background-image` draws the line itself: a vertical segment centered in the box, plus two horizontal half-width segments meeting it at opposite corners.

`inset-block-end` must resolve to a value greater than or equal to `inset-block-start` — anchor positioning can't express a "negative" box. When the second anchor sits above the first, toggle a class from JS and swap which anchor is the start vs. end (and flip `background-position`) in a corresponding CSS rule:
```js
if (c2 < c1) {
  document.body.classList.add('link-alpha-inverse')
} else {
  document.body.classList.remove('link-alpha-inverse')
}
```
With this technique, JS is only needed to update data attributes and toggle that inverse class — all position/size calculation moves to the browser.

## gotchas
- CSS Anchor Positioning reached Baseline in 2026 (Chrome 125+, Firefox 132+, Safari 18.2+, roughly 91% global coverage) — no flag needed.
