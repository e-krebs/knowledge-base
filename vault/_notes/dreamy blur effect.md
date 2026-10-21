---
source: https://yuanchuan.dev/dreamy-blur
fetched: 2026-09-14
published: 2022-09-05
status: fresh
---
Three ways to get a dreamy, camera-lens-not-wiped-clean look on a photo: stack a blurred semi-transparent copy with a blend mode, use `backdrop-filter` to blur the layer underneath directly, or build an SVG filter chain. Reach for whichever fits how many image layers you already have and how much control you need over the blend.

## how

### Blend mode
Stack a blurred, semi-transparent copy over the original and merge with `mix-blend-mode`:
```
picture .blur {
  position: absolute;
  inset: 0;
  mix-blend-mode: normal;
  filter: blur(3px) opacity(.5) brightness(1.3);
}
```
### Backdrop filter
`backdrop-filter` uses the layer underneath as its own filter source when its background is transparent, merging automatically with only one `img`:
```
picture::after {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: blur(3px) opacity(.5) brightness(1.3);
}
```
### SVG filter
Blur with `feGaussianBlur`, adjust its RGBA channels with `feComponentTransfer` (brightness via the R/G/B slopes, transparency via alpha), then merge back onto the original with `feBlend`:
```
<filter id="dreamy-blur">
  <feGaussianBlur stdDeviation="3" result="blur" />
  <feComponentTransfer in="blur" result="transformed">
    <feFuncA type="linear" slope=".5" />
  </feComponentTransfer>
  <feBlend in="transformed" in2="SourceGraphic" />
</filter>
```
The author's favorite is the SVG filter, calling it "most applicable" — it combines with `mask` to limit the effect to part of the image.

## gotchas
- `mix-blend-mode` in the blend-mode method turned out unnecessary — the author learned this later from HN comments.
- `backdrop-filter` is Baseline widely available since 2022, so it's the simpler default today over hand-building the SVG filter chain.
