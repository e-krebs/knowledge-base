---
source: https://yuanchuan.dev/daily-sketch-1
fetched: 2026-09-14
published: 2023-02-14
status: fresh
---
Four generative css-doodle sketches from yuanchuan's first daily-sketch post: a randomized grid of rounded tiles, a marine-life field of overlapping circles built from stacked box-shadows, a flexbox ring of compact circles with a nested gradient background, and three concentric rings of striped shapes. They exercise `@grid` randomization, the `@r`/`@p` random-pick functions, `@m()` box-shadow stacking, nested `@doodle()` backgrounds, and `@stripe` gradients.

## how

### Warming up
```css-doodle
@grid: 16x10 / 100% auto 1.8;
@size: @r(15%, 99%);
background: @p(#282846, #fed049, #0000);
margin: auto;
border: 1px solid #282846;
border-radius: @p.cycle(98% 0 0 0);
```

### Marine life
```css-doodle
@grid: 12x8 / 100% auto / #333 +1.4;
@seed: 1676215965847;
@size: 37%;
margin: auto;
background: #222;
border-radius: 50%;
z-index: calc(@I - @hypot(@dx, @dy));
translate: @rn(±100%, 5) @rn(±100%, 5);

font-size: .1vmin;
box-shadow: @m40(
  calc(@dx*@n*@rn(-2em))
  calc(@dy*@n*@rn(-2em))
  0 hsl(@n(*7) 80% 50% / @n(3/))
);
```

### Compact circles
```css-doodle
@grid: | 11x1 / 100% auto 1.5 / #9a923e +2 *45deg;
@seed: 1676332860181;
flex: calc(@hypot(@dx, @dy) + 1);
transform: skew(calc(@dx * 8deg));
background: @doodle(
  @grid: - 15x1;
  flex: calc(@hypot(@dx, @dy) + 1);
  transform: skew(calc(@dx * 8deg));
  border: 1px solid #5A3905;
  border-radius: 50%;
  --c: #feedd8,#fe8a57,#edc263, #faa78c;
  background: radial-gradient(
    circle at @M2.r(100%),
    @stripe(@p(--c) @r(20%, 50%), @P)
  );
);
```
Trick: flexbox with varying `flex` values gets this layout much more easily than CSS Grid alone.

### Spiral rings
```css-doodle
@grid: 1x1x9 / 100% auto 1.5 / #abc1e8 +2.5 *@r(360deg);
@seed: 1676339343815;
@size: 61.8% auto 1;
position: absolute;
inset: @pn.@cycle(8% auto auto 8%);
border: 1px solid #fff;
border-radius: 50%;
--c: #fcb29e,#77ac64,#f0422b,#002044;
background: radial-gradient(
  circle at @M2.r(100%), @stripe(@p(--c), @p)
);
```

## gotchas
- Safari has a rendering bug for `border-radius: 100% 0`, so the Warming up sketch uses `98%` instead — fixed upstream in WebKit (bug 244638, "WebKit fails to render extreme border-radius"), so current Safari no longer needs the workaround.
