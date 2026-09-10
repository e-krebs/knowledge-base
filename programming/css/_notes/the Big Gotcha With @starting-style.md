---
source: https://www.joshwcomeau.com/css/starting-style/
fetched: 2026-09-10
published: 2025-09-22
status: fresh
---
`@starting-style` follows normal CSS specificity rules, unlike `@keyframes` which lives in its own high-priority bucket — so a higher-specificity rule (or an inline style set from JS) can silently override the starting value, and the transition never fires. Reach for the fix whenever an `@starting-style` enter transition isn't triggering, especially when the animated property is also touched by inline styles.

## how
Fix by routing both the starting and running values through the same CSS custom property, so neither side out-specifies the other:
```css
.particle {
  transform: translate(var(--x), var(--y));
  transition: transform 500ms;

  @starting-style {
    transform: translate(0px, 0px);
  }
}
```
Other options: add `!important` to the `@starting-style` block (works, but costs maintainability later), or drop `@starting-style` and go back to a plain `@keyframes` animation.

## gotchas
- Inline styles beat `@starting-style` on specificity, so the starting value never applies and the transition silently does nothing.
- `@keyframes` sidesteps the whole problem and stays simpler and more broadly compatible — the author calls keyframes "super underrated" for most cases.
- One point in `@starting-style`'s favor: it handles interrupted animations more gracefully than keyframes.
