---
source: https://leanrada.com/notes/css-only-lqip/
fetched: 2026-09-10
published: 2025-03-30
status: stale
---
A low-quality image placeholder (LQIP) encoded entirely into one CSS custom property integer: a downsampled 3x2-pixel version of the image plus a base color are bit-packed into a single number, then unpacked by CSS `calc()` (division/modulo for bit shifting and masking) into layered `radial-gradient()` stops. No wrapper element, no data attribute, no JS decoding — just one inline custom property on the `<img>`. Reach for this when a blurred placeholder needs to survive on server-rendered HTML alone.

## how
```html
<img src="…" style="--lqip:192900">
```
CSS integers run from -999,999 to 999,999 (~2^20 bits) — enough to pack a base color (8 bits, in Oklab: 2 bits luminance + 3 bits each for a/b) plus six grayscale samples (2 bits each, a 3x2 grid). The samples render as six overlaid `radial-gradient()`s over a flat base-color `linear-gradient()`; extra quadratic-eased color stops on each gradient fake the bilinear smoothing CSS gradients don't do natively, so adjacent samples blend instead of showing hard edges.

## gotchas
- CSS gradients don't support nonlinear opacity interpolation, so the smooth-edge effect is only an approximation via extra stops, not true bilinear interpolation.
- Packing the integer needs an offline script to extract the dominant color and downsample the source image to 3x2 pixels first.
- Typed `attr()` (CSS Values Level 5) could read the packed value from an attribute instead of a custom property, but in September 2026 it sits at about 70% support with no Safari, so the custom-property form stays.
