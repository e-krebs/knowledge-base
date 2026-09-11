---
source: https://ishadeed.com/article/anchor-positioning/
fetched: 2026-09-11
published: 2025-08-28
status: stale
---
CSS Anchor Positioning lets you position an element relative to any other element on the page, not just its `position: relative` ancestor, avoiding the fragile absolute-position hacks and HTML restructuring that plain `position: absolute` forces. Reach for it for tooltips, tags, and popups that need to stay pinned to a target element regardless of layout changes.

## how
Name the anchor, then position the target relative to it:

```css
.card-thumb {
  anchor-name: --card-thumb;
}

.cardTag {
  position-anchor: --card-thumb;
  right: anchor(right);
  top: anchor(top);
}
```

`position-area` is the alternative to `anchor()`: it lays a 3x3 grid over the anchor and drops the target into one or more cells (`span-*` to cover adjacent cells):

```css
.target {
  position-area: top center;
}
```

For overflow, `position-try-fallbacks` swaps in an alternate position when the default one would clip out of the viewport — no JS required:

```css
.popup {
  position-area: top span-right;
  position-try-fallbacks: flip-block;
}
```

## gotchas
- The anchor and its target don't need to share a container — that's the whole point, but it also means there's no visual cue in the HTML that they're linked.
- Freshness (2026-09): the post said Chrome desktop only with Firefox/Safari pending; CSS Anchor Positioning has since reached Baseline 2026 (Chrome 125, Safari 26, Firefox 147).
