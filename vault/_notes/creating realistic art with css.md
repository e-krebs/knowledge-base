---
source: https://frontend.horse/articles/realistic-art-with-css/
fetched: 2026-09-14
published: 2020-08-24
status: fresh
---
Ben Evans' approach to drawing realistic illustrations (portraits, playing cards, landscapes) in pure CSS: one custom element per shape, styled by position rather than by name, scaled so the whole piece stays responsive. Reach for this when pushing CSS as an illustration medium rather than for a UI need.

## how

### One element per shape, styled by nth-of-type
Ben builds the markup as nested custom elements (no classes or ids at all), e.g. the first lines of the landscape piece:
```
<landscape>
  <sky>
    <x>
      <x></x>
      <x></x>
      <x></x>
    </x>
    <x>
      <x></x>
      <x></x>
      <x></x>
      <x></x>
      ...</x
    ></sky
  ></landscape
>
```
`<x>` elements behave like plain divs but have no default CSS to fight. Every element is then picked up in CSS purely by position with `nth-of-type`, with comments marking the major pieces instead of names.

### vmin + rem scaling
The whole piece scales together by basing the root font-size on the viewport's smallest side, then sizing everything else in rem:
```
html {
  font-size: 1vmin;
}
```

### Drawing techniques
Elements are pulled out of flow (`position: absolute; top: 0; left: 0;`), placed with `transform: translate3d()`, shaped with `border-radius` and other transforms, sized in rems, and actually rendered with `background: linear-gradient` and/or `box-shadow` — both useful here because they accept multiple comma-separated values on one element.

### Box-shadow hair (King of Hearts)
The king's hair is many layers of `box-shadow`, alternating two colors with an increasing offset to space them out; setting the third value (blur-radius) to `0` keeps the lines crisp. The card-flip lighting (darker face-down, brighter face-up) animates a covering element's background-color through an animation shorthand:
```
@keyframes light {
  0%,
  100%,
  50% {
    background-color: $none;
  }
  25% {
    background-color: rgba($card, 0.7);
  }
  75% {
    background-color: $body;
  }
}
```
The card's apparent thickness is just two white-backed elements moved slightly apart, registered by the eye as depth during the quick flip.

### Gradients driven by a single SCSS variable (Landscape)
Every color in the landscape derives from one seed variable via SCSS color functions (hue-shift, saturation, brightness, opacity):
```
// v CHANGE THE COLOUR OF THE SUN v //

$sun1: #f2de6f;
```
Shifting hue by `+60deg` on a teal moves it toward blue; `-60deg` moves it toward green — swapping just `$sun1` regenerates the whole palette.

### Halftone dots
A two-line radial-gradient background produces the halftone dot texture used in the water and on parts of the lemons:
```
background-image: radial-gradient(blue 30%, #fff 0);
background-size: 1rem 1rem;
background-position:
  0 0,
  0.5rem 0.5rem;
```

## gotchas
- Build from the background forward instead of relying on z-index/translateZ — Ben notes Safari in particular gets confused by pseudo-elements and z positioning.
- Man-made materials (glass, cards) are noticeably easier to fake in CSS than organic ones (skin, fruit) — the shapes and coloring are just more complex.
