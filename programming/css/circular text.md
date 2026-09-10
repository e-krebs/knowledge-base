---
source: https://dev.to/jh3y/circular-text-with-css-57jf
fetched: 2026-09-10
published: 2023-03-23
status: fresh
---
Bending a row of characters onto a circle without an image or an SVG `textPath`. Each character sits in its own span with a `--index` custom property, and CSS trig functions compute the exact radius from the character count, so there's no guessing a `translateY` value by eye.

## how
```css
.text-ring {
  --character-width: 1;
  --inner-angle: calc((360 / var(--total)) * 1deg);
  --radius: calc(
    (var(--character-width, 1) / sin(var(--inner-angle))) * -1ch
  );
}
.text-ring [style*=--index] {
  transform:
    translate(-50%, -50%)
    rotate(calc(var(--inner-angle) * var(--index)))
    translateY(var(--radius, -5ch));
}
```
Each span carries `style="--index: N"` and the ring itself carries `--total: <character count>`. The radius formula works because a monospace `ch` character and the angle between two characters form a right triangle, so `radius = width / sin(angle)`.

Feature-detect before relying on it:
```css
@supports (top: calc(sin(1) * 1px)) {
  /* trig-based styles */
}
```

## gotchas
- Decorative per-character spans should be wrapped in a container with `aria-hidden="true"`, plus a visually-hidden span holding the real text, so screen readers get one clean string instead of one-letter fragments.
- Use a monospace font (or otherwise equal-width characters) — the radius math assumes every character has the same width.
