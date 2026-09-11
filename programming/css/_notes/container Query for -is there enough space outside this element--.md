---
source: https://frontendmasters.com/blog/container-query-for-is-there-enough-space-outside-this-element/
fetched: 2026-09-11
published: 2025-05-13
status: fresh
---
Combining viewport units inside a `@container` size query lets you detect whether there's enough room *outside* a fluid/responsive element — not just inside it — without hardcoding breakpoints. Reach for this when a component (e.g. pagination arrows) needs to move inside or outside its box depending on whether the browser window has spare width beyond the box itself.

## how
Wrap the element in a container, sized fluidly against the viewport:
```css
.box {
  container: box / inline-size;
  inline-size: min(500px, 100vw);
}
```
Query the container's size against a viewport-relative `calc()` expression — since the container itself never reports viewport width, comparing its `inline-size` to a `100vw`-based value reveals whether the browser window has room beyond the container:
```css
.box-inner {
  background: rebeccapurple;

  @container box (inline-size <= calc(100vw - 80px * 2 - 1rem * 2)) {
    /* move arrows here */
  }
}
```
`80px * 2` and `1rem * 2` are the arrow widths and gaps being budgeted for — swap in your own element/gap sizes (or custom properties for more flexibility). The query only flips once viewport width minus that budget exceeds the container's own width, i.e. once there's genuinely enough outside space.

## gotchas
- You can't query the same element that is the container — always wrap the queried content in an inner element.
