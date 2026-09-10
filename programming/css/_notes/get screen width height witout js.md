---
source: https://css-tip.com/screen-dimension/
fetched: 2026-09-10
published: 2024-07-16
status: fresh
---
A CSS-only way to read the screen width and height as unitless integer pixel values, updating automatically on resize, without touching JavaScript. Reach for it when a `calc()` formula needs a raw viewport number rather than a `vw`/`vh` length.

## how
Simple version — divide a viewport unit by `1px` to strip the unit:
```css
:root {
  --w: calc(100vw/1px); /* screen width  */
  --h: calc(100vh/1px); /* screen height */
  /*  The result is an integer without a unit! */
}
```
Broader-compatibility version — register the viewport size as a `<length>` custom property, then cast it to a unitless number via `@property` plus trig:
```css
@property --_w {
  syntax: '<length>';
  inherits: true;
  initial-value: 100vw;
}
@property --_h {
  syntax: '<length>';
  inherits: true;
  initial-value: 100vh;
}
:root {
  --w: tan(atan2(var(--_w),1px)); /* screen width  */
  --h: tan(atan2(var(--_h),1px)); /* screen height */
  /* The result is an integer without unit  */
}
```
Both variants land on the same unitless integer, ready to drop into any other `calc()` formula.

## gotchas
- The `@property`/`atan2()` variant exists specifically for broader browser support than the plain `calc(100vw/1px)` version.
