---
source: https://www.smashingmagazine.com/2026/09/stop-treating-css-container-queries-traditional-media-queries/
fetched: 2026-10-20
published: 2026-09-16
status: fresh
---
Media queries ask how wide the viewport is; container queries ask how much space a component has in its current spot. Use `@media` for macro layout (page structure, `prefers-color-scheme`, touch) and `@container` for micro layout, when a component such as a card lives in more than one context (full-width grid, narrow sidebar).

## how
Register a wrapper as the container, then query it from the component's styles:
```css
.card-wrapper {
  container-name: card;
  container-type: inline-size;
}

@container card (min-width: 450px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```
Container units (`cqi`, `cqw`, `cqb`) give fluid type that follows the component, not the viewport:
```css
.card-title {
  font-size: clamp(1rem, .5rem + 3cqi, 2rem);
}
```
Flex wrap detection without `ResizeObserver`: make each flex item a container with `flex: 1 1 390px`; when it wraps and grows, a `@container (min-width: 600px)` rule fires on its content.
```css
.flex-item {
  container-type: inline-size;
  flex: 1 1 390px;
}
```

## gotchas
- A container cannot query itself: styling `.card` from `@container` on `.card` does nothing, so add a wrapper element and query that.
- `container-type: size` collapses the container to `0px` height without an explicit `height`, `min-height` or `aspect-ratio`; prefer `inline-size`.
- Container query conditions cannot use custom properties: `@container (min-width: var(--breakpoint-lg))` does not work.
- This covers size queries only; container style queries are experimental per the article.
