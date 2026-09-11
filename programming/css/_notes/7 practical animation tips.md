---
source: https://emilkowal.ski/ui/7-practical-animation-tips
fetched: 2026-09-11
status: fresh
---
Seven small, concrete adjustments that make UI animations feel more polished without needing deep animation theory — covering button feedback, scale origins, tooltip delays, easing choice, transform-origin, duration, and blur as a last resort.

### 1. Scale your buttons
Give instant feedback on press by scaling the button down slightly on `:active`, e.g. `transform: scale(0.97)`.

### 2. Don't animate from scale(0)
Animating in from `scale(0)` looks like the element appears from nowhere. Start from a higher initial scale (0.9+) so the motion feels gentler and more natural.

### 3. Don't delay subsequent tooltips
A tooltip should have an opening delay to avoid accidental activation, but once one tooltip is open, others in the same group should open instantly with no delay or animation. Radix and Base UI implement this by skipping the delay once a tooltip is shown; Base UI also lets you skip the animation via a `data-instant` attribute:

```css
.tooltip {
  transition:
    transform 0.125s ease-out,
    opacity 0.125s ease-out;
  transform-origin: var(--transform-origin);

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.97);
  }

  /** This takes care of disabling subsequent animations */
  &[data-instant] {
    transition-duration: 0ms;
  }
}
```

### 4. Choose the right easing
Use `ease-out` for elements entering or exiting the screen — it accelerates at the start, which reads as responsive. `ease-in` starts slow and feels sluggish for UI work even at the same duration. Built-in easing curves are often too weak; custom easing curves (e.g. from easings.co) tend to feel more energetic.

### 5. Make your animations origin-aware
Set `transform-origin` to the trigger element instead of leaving it at the default `center`, so popovers and menus visibly scale in from where they were invoked. Radix and Base UI expose this as CSS variables:

```css
.radix {
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);
}

.baseui {
  transform-origin: var(--transform-origin);
}
```

### 6. Keep your animations fast
UI animations should generally stay under 300ms — a 180ms select animation feels noticeably more responsive than a 400ms one, and a faster spinner makes loading feel quicker even at the same real load time. Drop animations entirely on interactions repeated tens or hundreds of times a day; they turn from delight into annoyance.

### 7. Use blur when nothing else works
When easing and duration tweaks still leave an animation feeling off, add a touch of `filter: blur()` during the transition. Blur bridges the visual gap between the old and new states so the eye reads it as one smooth transition instead of two distinct objects.
