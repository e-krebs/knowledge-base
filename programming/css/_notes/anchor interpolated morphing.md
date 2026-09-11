---
source: https://nerdy.dev/anchor-interpolated-morphing
fetched: 2026-09-11
published: 2026-01-23
status: fresh
---
Anchor Interpolated Morphing (AIM) is a no-JS CSS technique for animating a dialog, popover, tooltip, or other overlay so it visibly grows out of the element that triggered it, rather than fading in from a fixed point. It combines `anchor()`/`anchor-size()` to read the trigger's position and size, `@starting-style` to set the overlay's "from" state, and `interpolate-size: allow-keywords` to let width/height animate to/from `auto`. Reach for it instead of View Transitions when the transition needs to curve, be interruptible, or morph between elements that aren't ancestors of each other.

## how
Name the trigger as an anchor, position the overlay off that anchor, allow `auto` sizes to interpolate, and declare an `@starting-style` that matches the anchor's box so the overlay grows from it:

```css
button {
  anchor-name: --⚓︎-morph;
}

dialog {
  position-anchor: --⚓︎-morph;
  left: anchor(left);
  top: anchor(top);
  interpolate-size: allow-keywords;
  transition:
    height var(--_speed) var(--ease-3),
    width  var(--_speed) var(--ease-3),
    left   var(--_speed) var(--ease-3),
    top    var(--_speed) var(--ease-3);

  @starting-style {
    &[open] {
      left: anchor(left);
      top: anchor(top);
      right: anchor(right);
      bottom: anchor(bottom);
      width: anchor-size(width);
      height: anchor-size(height);
    }
  }
}
```

Gate the whole transition behind `prefers-reduced-motion: no-preference`, and mirror the same properties on `&:not([open])` to reverse the morph on exit.

## gotchas
- `interpolate-size: allow-keywords` is Chromium-only (Chrome/Edge 129+) and not yet Baseline, so AIM is a progressive-enhancement technique, not a universally-safe one.
