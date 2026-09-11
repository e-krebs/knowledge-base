---
source: https://www.ctnicholas.dev/articles/which-blend-mode
fetched: 2026-09-11
published: 2021-10-22
status: fresh
---
Blend modes apply a per-pixel math operation between a "source" element and the "backdrop" behind it (everything below it in the current stacking context) — e.g. `multiply` multiplies each RGB channel of source and backdrop together, then divides back down. This note is a lookup table for picking the right mode: the six blend groups, what a black/white source does to each, and which modes mirror each other, so you can go straight to the mode that produces the effect you want instead of trial-and-error.

## how
Apply on the source element (the one on top), with the backdrop being everything below it in the same stacking context:
```css
.container { position: relative; }
.source {
  position: absolute;
  inset: 0;
  background: green;
  mix-blend-mode: hard-light;
}
```

### Darken group — always darkens
- `multiply` — white has no effect, black produces black; similar to `darken`, inverse of `screen`. Use: darken a background so light text stays readable, or darken/saturate a photo.
- `darken` — picks the darker of source/backdrop per pixel; inverse of `lighten`.
- `color-burn` — darkens the backdrop toward the source, more contrast; inverse of `color-dodge`.

### Lighten group — always lightens
- `screen` — white produces white, black has no effect; inverse of `multiply`. Use: lighten a background for dark text, or lighten/saturate a photo.
- `lighten` — picks the lighter of source/backdrop per pixel; inverse of `darken`.
- `color-dodge` — lightens the backdrop toward the source; inverse of `color-burn`.

### Contrast group — increases contrast, 50% gray has no effect
- `overlay` — multiplies or screens depending on brightness; inverse of `hard-light`. Use: watermarks, combining images.
- `soft-light` — same idea as `overlay` but less harsh.
- `hard-light` — stronger version of `overlay`; black/white source produce black/white outright.

### Inversion group — inverts colors
- `difference` — subtracts the darker color from the lighter; white inverts, black has no effect; similar to `exclusion`. Use: negative-image effects, guaranteeing text stays visible over any backdrop.
- `exclusion` — a softer `difference`; 50% gray source produces 50% gray.

### Component group — recombines hue/saturation/lightness
- `hue` — backdrop's saturation + luminosity, source's hue.
- `saturation` — backdrop's hue + luminosity, source's saturation.
- `color` — backdrop's luminosity, source's hue + saturation. Inverse of `luminosity`. Use: tint an image without changing its brightness.
- `luminosity` — backdrop's hue + saturation, source's luminosity. Inverse of `color`.
