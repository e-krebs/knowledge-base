---
source: https://joshcollinsworth.com/blog/great-transitions
fetched: 2026-09-11
published: 2023-02-28
status: fresh
---
Ten craft rules for CSS transitions and animations, distilled from a decade of shipping UI motion, plus a bonus rule on respecting reduced-motion preferences. Reach for these when a transition technically works but still feels generic, sluggish, or off.

### 1. Make it shorter than you think it should be
Most single transitions read best around 150-400ms; roughly double that (with a small gap) for back-to-back transitions. Bigger page-level changes can justify a longer, more noticeable transition.

### 2. Match the curve to the action
Pick a `cubic-bezier` curve that matches the real-world feeling of the action — quick and smooth for a positive confirmation, slightly slower for a failure or warning message.

### 3. Accelerate and decelerate
Avoid curves that start or stop instantly; a little ease in/out makes movement read as natural. Matters less when the abrupt end is masked by fading to/from `opacity: 0`.

### 4. Less is more
Animate a smaller range than you'd first reach for — e.g. `opacity` 0.4→1 instead of 0→1, or a slide of about 5-40px — and keep durations on the shorter side.

### 5. Avoid browser defaults
The five named timing functions (`linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`) read as generic; hand-tune a `cubic-bezier` curve instead, using your browser devtools' easing editor or VS Code's `cubic-bezier` autocomplete.

### 6. Multiple properties, multiple easings
When animating more than one property at once, give each its own curve instead of reusing one for all of them:
```css
.my-element {
  transition: opacity linear 0.5s, transform cubic-bezier(0.5, 0, 0.5, 1) 0.5s;
}
```

### 7. Use staggered delays
Stagger `animation-delay`/`transition-delay` across multiple elements (or parts of one) for a "bounce-in" feel — used sparingly, e.g. loading dots or a menu's items appearing one after another.

### 8. Ins go out, outs go in
An element leaving should ease in (start slow); an element entering should ease out (end slow) — together they read as one seamless transition.

### 9. Lean on hardware acceleration
Only `transform` and `opacity` can always be hardware-accelerated; some SVG properties and `filter` only sometimes, depending on the browser. Animate those instead of layout-affecting properties (`height`, `width`, `margin`, `padding`, etc.), which force expensive recalculation and can noticeably slow the page.

### 10. Use `will-change` as needed
Add `will-change: transform` (or whichever property) only to fix an existing performance problem, not preemptively — overusing it creates extra compositing layers and can hurt performance instead of helping.

### Bonus: respect the user's preferences
Honor `prefers-reduced-motion` with a media query or a JS class toggle; reduced motion means less/subtler motion, not none — e.g. swap a slide-and-fade keyframe for a fade-only one:
```css
@media (prefers-reduced-motion) {
  .animated-thing {
    animation-name: slide_in_reduced;
  }
}
```
