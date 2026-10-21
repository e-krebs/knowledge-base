---
source: https://yuanchuan.dev/fun-with-stroke-dasharray
fetched: 2026-09-10
published: 2023-09-27
status: fresh
---
SVG's `stroke-dasharray` cycles through as many values as you give it (odd positions are dashes, even positions are gaps), unlike CSS's binary dashed border. Pair it with `pathLength` to give a path an arbitrary total length so dash/gap sizes stay meaningful without a `getTotalLength()` call, and set a dash length of `0` with a `round` or `square` `stroke-linecap` to turn the caps themselves into dots. Reach for this for line/circle animations, progress indicators, or dot patterns along a path.

## how
Values cycle indefinitely:

```
stroke-dasharray: 1 2 1;
```

`pathLength` gives the path a convenient round total, so the dasharray values stay meaningful without measuring the real length (here 40, so each side of the rect gets 10):

```
svg {
  viewBox: 0 0 50 50 p .5;
  rect {
    width, height: 50;
    fill: none;
    stroke: #000;
    pathLength: 40;
    stroke-dasharray: 2 8;
    stroke-dashoffset: 1;
  }
}
```
A dash length of `0` with a round cap leaves the cap visible as a dot; two half-round caps together form a full circle:

```
svg {
  viewBox: 0 0 100 100 p 10;
  rect {
    width, height: 100;
    fill: none;
    stroke: #000;
    stroke-dasharray: 0 10 10;
    stroke-linecap: round;
    stroke-width: 10;
  }
}
```
