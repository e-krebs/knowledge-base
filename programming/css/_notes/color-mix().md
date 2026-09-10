---
source: https://una.im/color-mix-opacity/
fetched: 2026-09-10
published: 2023-03-31
status: fresh
---
`color-mix()` blends two colors together in a given color space; mixing a color against `transparent` at increasing percentages produces opacity variants without touching the alpha channel directly. Reach for it when you want a reusable set of tint/opacity steps built from one brand color.

## how
```css
.center { fill: color-mix(in srgb, blue, red); }
```

Mixing against `transparent` at a percentage creates opacity steps:

```css
.center { fill: color-mix(in srgb, blue, transparent 20%); }
.center { fill: color-mix(in srgb, blue, transparent 40%); }
.center { fill: color-mix(in srgb, blue, transparent 60%); }
.center { fill: color-mix(in srgb, blue, transparent 80%); }
.center { fill: color-mix(in srgb, blue, transparent 90%); }
```

Wired into custom properties, this gives a full opacity-variant system for one brand color:

```css
:root {
  --brandBlue: skyblue;
  --brandBlue-a10: color-mix(in srgb, var(--brandBlue), transparent 90%);
  --brandBlue-a20: color-mix(in srgb, var(--brandBlue), transparent 80%);
  --brandBlue-a30: color-mix(in srgb, var(--brandBlue), transparent 70%);
}
```

## gotchas
- The color space argument (e.g. `in srgb`) is required.
