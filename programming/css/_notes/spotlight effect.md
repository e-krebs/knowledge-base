---
source: https://frontendmasters.com/blog/css-spotlight-effect/
fetched: 2026-09-10
published: 2025-05-26
status: fresh
---
Builds a cursor-following spotlight by mirroring the mouse position into CSS custom properties and feeding those into a `radial-gradient` on a fixed, full-viewport element. Reach for it for hover-reveal panels or interactive highlight effects that should track the pointer with almost no JavaScript.

## how
```javascript
document.body.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--clientX', e.clientX + 'px');
  document.body.style.setProperty('--clientY', e.clientY + 'px');
});
```

```css
.spotlight {
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle at var(--clientX, 50%) var(--clientY, 50%), transparent 6em, black 8em);
}
```

For a gooey/organic variant, layer gradients and push them through `blur` + `contrast`, with `mix-blend-mode: darken` over a white background so white areas read as transparent:

```css
.spotlight {
  filter: blur(1em) contrast(100);
  mix-blend-mode: darken;
  background-color: white;
}
```

Disable the effect on hover with `body:has(.reveal:hover)` — no extra JS needed.

## gotchas
- Set `pointer-events: none` on the spotlight element or it blocks clicks underneath.
- Don't hide the cursor to sell the effect — it's an accessibility problem.
- Wrap the styles in `@media (hover: hover)` and remove the `mousemove` listener on `touchstart` to disable on touch devices.
- Also disable via `body:has(:focus-visible)` so keyboard-focused elements aren't obscured.
