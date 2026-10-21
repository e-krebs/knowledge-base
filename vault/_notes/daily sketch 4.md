---
source: https://yuanchuan.dev/daily-sketch-4
fetched: 2026-09-14
published: 2023-03-08
status: fresh
---
yuanchuan's fourth daily-sketch post recreates 15 of OpenAI's generative cover images in css-doodle, one per numbered sketch, as a puzzle-solving exercise in matching someone else's generative style. The set exercises `@Svg`-generated content, nested `@doodle()` backgrounds, conditional `@match` rules, and gradient/`mix-blend-mode` tricks for reproducing each source image's look.

## how

### #1
```css-doodle
@grid: 1x21 / 400px / #091608;
@gap: calc(50%/@I);

background-blend-mode: multiply;
background-size: 110% 100%;
background-image:
  @doodle(
    background: #fff;
    filter: @svg-filter(.8);
    opacity: .6;
  ),
  linear-gradient(
    90deg,
    @p(#14ff2e, #f452ea) @rn(±100%, 5, 2),
    #000, @P
  );
```

### #3
```css-doodle
@grid: 24 / 400px / #e5f1ff;
@size: 100% calc(100%/@Y*@y);

background: #a0522d;
rotate: @rn(0, 360deg, .8);
margin: auto;
```
Trick: page calls this the easiest of the set — a plain grid with a random per-cell rotation.

### #4
```css-doodle
@grid: 24 / 400px / #2D712B;
@size: 100% calc(100%/@Y*@y);

background: #fee6ff;
margin: auto;
rotate: calc(90deg - @dy/@dx * 45deg);

@match(
  (x >= y && x <= (Y-y+1)) ||
  (x <= y && x >= (Y-y+1))
) {
  rotate: calc(@dx/@dy * 45deg);
}
```
Trick: an `@match` block flips the rotation formula across the grid's diagonal to fold the pattern symmetrically.

### #9
```css-doodle
@grid: 1 / 400px / #ffe0db;
@content: @Svg(
  viewBox: 0 0 45 45 padding -12.5;
  fill: none;
  stroke: #0800fe;
  path*45 {
    stroke-width: @abs(.5 - 1/@N*@n);
    d: M 10 @n
       Q 22.5 @calc(@n + (45 - @n*2)/1.85)
         35 @n
  }
);
```
Trick: generates 45 overlapping SVG `path` curves inside one cell via `@Svg`, tapering `stroke-width` by index.

### #13
```css-doodle
@grid: 6x1 / 400px / #ffe7c2;
@place: @pn(@m4(center), 50% 0, 50% 100%);
@size: @pn(100%, 74%, 52%, 30%, 100%, 100%);
border-radius: 50%;
mix-blend-mode: @pn(@m4(unset), @m2(difference));
background: @pn(
  linear-gradient(-90deg, #fee754, #ffe7a7),
  linear-gradient(145deg, #0a1293 10%, #fff0 85%),
  linear-gradient(100deg, #ab0a7b, #fff0 85%),
  radial-gradient(circle at 30% 70%, #53b42d 18%, #fff0 80%),
  linear-gradient(90deg, #e44100, #fff0),
  linear-gradient(-90deg, #e44100, #fff0)
);
```
Trick: page notes the challenging part is nailing the precise colors before applying `mix-blend-mode`.

## gotchas
- Safari doesn't support the data-URI format for SVG filters, so #1's grainy noise texture won't display on Safari/iPhone.
