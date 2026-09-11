---
source: https://frontendmasters.com/blog/the-weird-parts-of-position-sticky/
fetched: 2026-09-11
published: 2025-11-05
status: fresh
---
Beyond the well-known "an ancestor has `overflow: hidden`" gotcha, `position: sticky` also silently fails for two subtler reasons: the sticky element is larger than its scroll container, or its containing block is too small to let it stick without "breaking out" of an ancestor. Reach for these when a sticky header or sidebar sticks for a while then inexplicably scrolls away.

## how
- **Problem 1 — sticky element bigger than the scroll container.** The CSS spec only lets a sticky element shift while it stays contained in its containing block, so once the browser must show the rest of an oversized sticky element's content, the stuck-in-place top portion scrolls away. Keep the sticky element's height at or below the scroll container's.
- **Problem 2 — containing block too small.** Sticky positioning can never break out of its parent's bounds. Flex/grid children default to `align-self: stretch`, which can stretch an intermediate wrapper (and the sticky element inside it) to fill the scroll container, leaving no room to actually stick:
```jsx
<div className="h-[500px] flex flex-1 gap-2 overflow-auto p-1">
  <div className="self-start grid grid-rows-1 grid-cols-[250px_1fr] flex-1">
    {/* Side Navigation Pane */}
    <div className="self-start sticky top-0 flex flex-col gap-8">
      {/* ... */}
    </div>
    {/* Main Content Pane */}
    <div className="flex flex-1 gap-2">{/* ... */}</div>
  </div>
</div>
```
Adding `self-start` to both the grid wrapper and the sticky element lets the wrapper grow only as large as it needs, giving the sticky child room to stick instead of stretching to fill the container.

## gotchas
- If the sticky content can still grow bigger than the scroll container even with `self-start` applied, cap it with `max-height` + `overflow: auto` rather than letting the browser un-stick it at the bottom.
- The classic "an ancestor has `overflow: hidden`" fix still applies, but it isn't the only cause — check ancestor sizing/`align-self` before assuming that's it.
