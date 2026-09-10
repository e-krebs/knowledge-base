---
source: https://shrutibalasa.substack.com/p/create-responsive-designs-with-css
fetched: 2026-09-10
published: 2023-02-22
status: fresh
---
`clamp(MIN, VAL, MAX)` bounds a viewport-relative size, such as a `vw` value, between a minimum and a maximum, fixing the problem of pure `vw` typography growing too large on wide screens and shrinking too small on narrow ones. Reach for it whenever a size should scale with the viewport but never cross a hard floor or ceiling.

## how
Pure viewport sizing has no bounds:
```css
h1 {
  font-size: 5vw;
}
```
`clamp()` adds them:
```css
h1 {
  font-size: clamp(1.8rem, 5vw, 3rem);
}
```
The heading never scales below 1.8rem or above 3rem, staying at 5vw for screens in between. The same MIN/VAL/MAX pattern applies to container widths and image sizes, not just typography.
