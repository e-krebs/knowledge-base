---
source: https://surma.dev/things/ditherpunk/
fetched: 2026-09-13
published: 2021-01-04
status: fresh
---
Dithering places pixels from a small color palette so the eye perceives more brightness levels than actually exist, e.g. faking grays out of pure black and white. Reach for it when quantizing an image to a constrained palette (retro aesthetics, 1-bit displays, GPU shaders) and a naive per-pixel threshold looks too flat or loses detail.

## quantization
Mapping a large value set (256 grays) to a small palette (black/white) by rounding each pixel to its nearest palette color. Gamma caveat: canvas `ImageData` is sRGB, which is non-linear — 0.5 in sRGB isn't the brightness a human perceives as halfway between black and white, so dithering directly in sRGB looks too bright. Convert to linear RGB (gamma ≈ 2.4) first.
```js
grayscaleImage.mapSelf(brightness =>
  brightness > 0.5 ? 1.0 : 0.0
);
```

## random noise
Add noise in [-0.5, 0.5] to each pixel before thresholding, so a mid-gray pixel flips to black roughly half the time. Statistically reduces quantization error but looks noisy.
```js
grayscaleImage.mapSelf(brightness =>
  brightness + (Math.random() - 0.5) > 0.5 ? 1.0 : 0.0
);
```

## ordered dithering (bayer)
Reframes the same idea as a threshold map instead of added noise (`brightness > rand()` is equivalent) — precomputed, reusable, deterministic, and parallelizable per pixel, so it can run as a GPU shader. Bayer dithering uses a recursively-defined matrix, normalized by 2^(2n+2), as that map:
```
Bayer(0) =
0 2
3 1

Bayer(n) =
4·Bayer(n-1)+0   4·Bayer(n-1)+2
4·Bayer(n-1)+3   4·Bayer(n-1)+1
```
```js
grayscaleImage.mapSelf((brightness, { x, y }) =>
  brightness > bayer.valueAt(x, y, { wrap: true }) ? 1.0 : 0.0
);
```
Bayer matrices bias the image lighter than the original (invert to `1 - bayer.valueAt(...)` for dark images). The author found levels 1 and 3 most aesthetically pleasing.

## blue noise
White noise has random clusters/voids of bright pixels; Bayer looks structured/repetitive. Blue noise dampens low frequencies so clusters and voids are much less visible, at the cost of being expensive to generate (the "void-and-cluster" method: repeatedly swap cluster/void pixels found via Gaussian blur until white pixels spread evenly). It tiles seamlessly and is used as a threshold map exactly like Bayer once generated.

## error diffusion
Measure the quantization error at each pixel and diffuse it into not-yet-visited neighbors via a diffusion matrix, changing the image as you go — sequential, not GPU-friendly, but handles arbitrary color palettes. Simple 2D shares error with the pixel to the right and below:
```
 *  0.5
0.5  0
```

### floyd-steinberg
```
1/16 ×
   *  7
3  5  1
```
The best-known error diffusion dither; a big improvement over simple 2D, though flat areas can still look unorganic.

### jarvis-judice-ninke
```
1/48 ×
      *  7  5
3  5  7  5  3
1  3  5  3  1
```
Spreads error across more pixels, making patterns even less likely than Floyd-Steinberg.

### atkinson
```
1/8 ×
   *  1  1
1  1  1
   1
```
Developed at Apple for early Macintosh computers. Only six of eight error fractions are distributed (denominator is 8), so it doesn't diffuse the whole error — this increases perceived contrast.

### riemersma
Traverses the image via a Hilbert curve instead of row-by-row, using a diffusion sequence of the last n errors instead of a 2D matrix. Weight for the i-th error: `weight[i] = r^(-i/(n-1))`. Source article recommends r = 1/16, n = 16; the author found r = 1/8, n = 32 looked better on their test image. Nearly as organic as blue noise, and easier to implement, but still sequential.

## author's pick
Obra Dinn runs ordered dithering as a GPU shader: blue noise for most environment geometry, Bayer for characters/objects of interest, for visual contrast. The author is also particularly fond of Riemersma dithering.
