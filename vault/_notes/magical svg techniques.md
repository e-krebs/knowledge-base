---
source: https://www.smashingmagazine.com/2022/05/magical-svg-techniques/
fetched: 2026-09-14
published: 2022-05-10
status: fresh
---
A roundup of SVG techniques and tools worth reaching for depending on the effect you need: generative grids and landscapes, mask-based texture, grainy gradients, cut-outs, fractional ratings, animated illustrations, and a few workflow tools. Use it as an index — each entry points at a deeper tutorial for that one effect.

## how

### Generative SVG grids
A grid of blocks with a random number of rows/columns, each block getting a randomly chosen design and colors from a shared palette (full build in the "creating generative svg grids" note).

### Generative landscape rolls
{Shan, Shui} procedurally generates infinitely-scrolling Chinese landscapes in SVG, modeling mountains and trees from scratch with noise and mathematical functions.

### SVG paths with masks
Tom Miller's "Silkscreen Squiggles": squiggly paths get a paintbrush texture from a mask with an alpha layer, rather than from the raster texture itself.

### Grainy gradients
An SVG filter generates noise, which is layered underneath a gradient with boosted brightness and contrast to add texture (holographic foil, light/shadow effects). Supported by all modern browsers.

### Adding texture and depth
Three simple techniques: tiny random shapes scattered at random points, solid shape fills built from lines, and non-overlapping circles distributed evenly but randomly via an algorithm.

### Cut-out effects with CSS and SVG
Ahmad Shadeed compares SVG-only, CSS-only, and mixed solutions across three cases: an avatar with a cut-out status badge, overlapping "seen" avatars, and a header with a cut-out behind a circular logo.

### Fractional SVG stars
A list of star icons plus an overlay `div` that changes the color of the stars underneath produces fractional ratings (4.2, 3.7 stars) without images. Supported in all modern browsers; fall back to `opacity` for older ones.

### Generative mountain ridge dividers
Combines SVG with terrain-generation techniques borrowed from game development to produce unique ridge shapes for every divider.

### Flexible repeating SVG masks
SVG provides the shape, CSS handles the color, and `mask-image` hides anything in the underlying `div` that doesn't intersect the shape — used for a seamless, horizontal repeating squiggle pattern.

### Swipey image grids
Cassie Evans lays out the grid using SVG's own (responsive) coordinate system instead of CSS Grid, positions images with `preserveAspectRatio`, and swipes them in with `clipPath`; GreenSock keeps the transforms consistent across browsers.

### Animated SVG debit card illustrations
Tom Miller uses GreenSock to animate SVG paths and shapes so a flat card design transforms, rotates, and scales on its own.

### Tools
SVGcode traces a raster image into an SVG (color or monochrome). SVG Gobbler finds and downloads/exports any SVG on the current page, with SVGO optimization built in. For scaling, think of the `svg` element's `viewBox` as a telescope you zoom with rather than resizing the element itself.

## gotchas
- `mask-image` is Baseline since December 2023, so the flexible repeating mask technique no longer needs a fallback in modern browsers.
- Fractional SVG stars only work in all modern browsers via the overlay-`div` trick; older browsers need the `opacity` fallback instead.
