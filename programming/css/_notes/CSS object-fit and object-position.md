---
source: https://www.sitepoint.com/using-css-object-fit-object-position-properties/
fetched: 2026-09-11
published: 2023-07-20
status: fresh
---
`object-fit` and `object-position` control how a replaced element (`img`, `video`, `embed`) fills and aligns itself inside a content box whose dimensions no longer match its natural size — the same job `background-size`/`background-position` do for background images, but for real elements. Reach for `object-fit` whenever an image must fit a fixed-size or responsive area (a grid cell, an avatar circle) without distortion, and `object-position` when the default centered crop isn't the part of the image you want visible.

## how
Give the element explicit dimensions first — `object-fit` only does something once the content box differs from the image's natural size — then pick a fit:

```css
img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* fills the box, crops to avoid distortion */
}
```

- `cover` — fills the box, cropping whichever axis overflows; the most commonly useful value.
- `contain` — fits the whole image inside the box, keeping aspect ratio, letterboxing if needed.
- `none` — ignores the box, keeps natural size, centered and clipped.
- `scale-down` — whichever of `none` or `contain` renders smaller.
- `fill` — stretches to fill the box exactly (default behavior, usually distorts).

`object-position` (default `50% 50%`) then moves the visible crop within the box, with keywords or offsets:

```css
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right 20px bottom 2em; /* 20px from right, 2em from bottom */
}
```

## gotchas
- `object-position` only works on replaced elements — it cannot be used on background images (use `background-position` there instead).
- Percentage `object-position` values align a point on the image with the same point on the box (`20% 40%` aligns the image's 20%/40% point with the box's 20%/40% point) — it isn't a simple offset.
