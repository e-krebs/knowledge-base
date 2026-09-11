---
source: https://www.smashingmagazine.com/2023/12/css-scroll-snapping-aligned-global-page-layout-case-study/
fetched: 2026-09-11
published: 2023-12-13
status: fresh
---
A full-width scroll-snapping slider (built with `display: flex` + `overflow-x: auto` + `scroll-snap-type`) normally has no relation to the page's own container padding, so its snapped edges don't line up with the rest of the layout. This custom-property formula computes the slider's padding from the container's own `max-width` and padding variables, so a full-bleed slider snaps flush with the page's inner content edge at every breakpoint.

## how
Register the container's width/padding as custom properties at `:root`, varied per breakpoint, then compute the slider's offset from them:

```css
.slider {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  --offset-width: calc(
    ((100% - (min(var(--c-max-width), 100%) + (var(--c-padding) * 2))) / 2) + (var(--c-padding) * 2)
  );

  padding-inline: var(--offset-width);
  scroll-padding-inline-start: var(--offset-width);

  > * {
    flex: 0 0 300px;
    scroll-snap-align: start;
  }
}
```

`--offset-width` first finds the smaller of the container's `max-width` or `100%`, adds its padding, subtracts that from `100%`, halves it, then re-adds the padding — giving the exact space between the viewport edge and the inside of the layout container. Applying that to both `padding-inline` (so the slider's own edge lines up) and `scroll-padding-inline-start` (so snapping respects that edge) keeps the slider visually aligned with the rest of the page.

## gotchas
- The demo sets `*, *::before, *::after { box-sizing: border-box; }` so the offset math works inside the slider's border rather than outside it.
- The same `--offset-width` variable can drive `flex` sizing too — e.g. dividing by 3 to always show three items per view instead of a fixed pixel width.
