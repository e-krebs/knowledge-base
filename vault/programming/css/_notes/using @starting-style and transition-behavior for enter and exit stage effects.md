---
source: https://nerdy.dev/using-starting-style-and-transition-behavior-for-enter-and-exit-stage-effects
fetched: 2026-09-10
published: 2024-05-20
status: fresh
---
Combines `@starting-style` and `transition-behavior: allow-discrete` to animate an element in and out of `display: none` (or on first render) using ordinary CSS transitions instead of `@keyframes`. Reach for it when toggling visibility of dialogs, popovers, or conditionally-rendered nodes and you want interruptible enter/exit motion.

## how
`@starting-style` alone gives a fade/scale-in on insertion; add `transition-behavior: allow-discrete` plus an `&[hidden]` rule to also animate the exit before `display: none` lands:
```css
* {
  transition:
    opacity .5s ease-in,
    scale   .5s ease-in,
    display .5s ease-in;
  transition-behavior: allow-discrete;

  @starting-style {
    opacity: 0;
    scale: 1.1;
  }

  &[hidden] {
    opacity: 0;
    scale: .9;
    display: none !important;
    transition-duration: .4s;
    transition-timing-function: ease-out;
  }
}
```
The same `&[hidden]` pattern extends to `dialog:not(:modal)` and `&[popover]:not(:popover-open)` for native dialog/popover elements.

## gotchas
- Wrap the styles in `@layer` — it keeps them maintainable and cuts DevTools noise.
- Detect when the transition has actually finished before removing the node, via the Web Animations API: `Promise.allSettled(node.getAnimations().map(a => a.finished))`.
