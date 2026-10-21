---
source: https://keithjgrant.com/posts/2023/04/transitioning-to-height-auto/
fetched: 2026-09-11
published: 2023-04-21
status: stale
---
`height: auto` can't be transitioned directly — a dropdown or accordion toggling `height: 0` to `height: auto` opens/closes instantly with no animation. Two no-JS layout tricks work around it: wrap the content in a flexbox and transition `max-height`, or make it a single grid item and transition `grid-template-rows`. Reach for either when you need a smooth open/close animation without measuring `scrollHeight` in JavaScript.

## how
Flexbox — wrap the target in two extra divs and transition `max-height`, which resolves as a percentage of the flex item's content:

```css
.wrapper { display: flex; }
.inner {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-out;
}
.wrapper.is-open .inner { max-height: 100%; }
```

Grid — no extra wrapper needed; transition `grid-template-rows` from `0fr` to `1fr` on a single-item grid container:

```css
.wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s ease-out;
}
.wrapper.is-open { grid-template-rows: 1fr; }
.inner { overflow: hidden; }
```

## gotchas
- Neither approach allows padding on the innermost element — add one more nested element and put the padding there.
- Flexbox's outer container snaps into place instantly (only `.inner` animates); grid's container animates smoothly too.
- Grid trick's prior art: the page credits Chris Coyier's CSS-Tricks post ["CSS Grid can do auto-height transitions!"](https://css-tricks.com/css-grid-can-do-auto-height-transitions/), buried in a longer wish list.
- Freshness (2026-09): both workarounds are still needed cross-browser — the arriving successor, `interpolate-size: allow-keywords` + `calc-size()`, isn't Baseline yet (Chrome/Edge 129+ only; Firefox/Safari unsupported as of Sept 2026).
