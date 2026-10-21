---
source: https://garden.bradwoods.io/notes/css/blend-modes
fetched: 2026-09-11
published: 2023-08
status: fresh
---
CSS blend modes let two overlapping layers' pixels combine mathematically instead of one simply covering the other — `background-blend-mode` blends an element's own background layers, `mix-blend-mode` blends an element's content/background against whatever is behind it. Reach for these for photo-manipulation-style effects (duotone, halftone, paper texture, scan lines) or UI effects that need to react to whatever's underneath, without a canvas or image editor.

## how
Stack two layers and set a blend mode on the top one; values group into: normal; darken (`darken`, `multiply`, `color-burn`); lighten (`lighten`, `screen`, `color-dodge`); contrast (`overlay`, `soft-light`, `hard-light`); invert (`difference`, `exclusion`); and per-component (`hue`, `saturation`, `luminosity`, `color`).

Duotone effect — grayscale the photo, then multiply a dark tint and screen a light tint over it:
```css
.layer1 {
  background-image: url(waves.webp);
  filter: grayscale(1) brightness(110%);
}
.layer2 {
  background: hsl(240, 100%, 53%);
  mix-blend-mode: screen;
}
.layer3 {
  background: hsl(330, 100%, 71%);
  mix-blend-mode: multiply;
}
```

Scan lines — a repeating gradient overlaid with `overlay`, which lightens on light backgrounds and darkens on dark ones:
```css
.layer2 {
  background: repeating-linear-gradient(
    transparent 0,
    hsl(0, 0%, 0%) calc(var(--line-width) / 2),
    transparent var(--line-width)
  );
  mix-blend-mode: overlay;
}
```

## gotchas
- `mix-blend-mode` blends against everything behind it in the current stacking context, including elements you didn't intend (e.g. a button placed between two blended layers). Add `isolation: isolate` on a wrapper to make it its own stacking context and contain the blending to layers inside it.
