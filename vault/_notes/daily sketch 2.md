---
source: https://yuanchuan.dev/daily-sketch-2
fetched: 2026-09-14
published: 2023-02-17
status: fresh
---
yuanchuan's second daily-sketch post builds a symmetrical pattern by evenly rotating one shape around a circle, then riffs on the same layout by swapping only the `@shape` point formula for a run of increasingly intricate motifs. It exercises nested `@doodle()` backgrounds, `@plot`-based circular placement, the `@shape` point-tracing function, and reusing one pattern across `:before`/`:after` via a custom property. The author also notes that since the artwork renders live in the browser, it can look different once browsers or hardware change — screenshots, not the code, are what actually preserve it.

## how

### Complete source code
```css-doodle
<css-doodle>
  @grid: 12x1 / 280px auto 1 / #1b2242;
  @seed: 1676602917230;
  @place: @plot(r: .5; dir: auto -90);
  @size: 50%;
  :container { filter: drop-shadow(0 -1px 0 #fff) }
  clip-path: @shape(rotate: 30);
  background: @doodle(
    background: radial-gradient(
      @m6.@P(#f2cc67,#f38264,#f40034,#5f051f,#75baa8)
    );
    clip-path: @shape(
      points: 200;
      frame: 20;
      scale: .5;
      x: (1 + sin(t)) * cos(t);
      y: -sin(t);
    );
  );
</css-doodle>
```
Trick: evenly divides a circle with a rotating shape placed via `@plot`, its outline traced point-by-point with `@shape`.

### New explorations
```css-doodle
@grid: 1 / 280px auto 1 / #1b2242;
        background: @doodle(
          @grid: 12x1 / 100%;
          :container { filter: drop-shadow(0 -1px 0 #fff) }
          clip-path: @shape(rotate: 30);
          @place: @plot(r: .5; dir: auto -90);
          @size: 50%;
          background: @doodle(
            background: radial-gradient(@m6.@P(#f2cc67,#f38264,#f40034,#5f051f,#75baa8));
            clip-path: @shape(
              points: 200;
              scale: .5;
              x: (1 + sin(t)) * cos(t);
              y: -sin(t);
              frame: 20;
            );
          );
        );
```
Trick: swapping just the `@shape` formula on the same `@plot` layout produces a completely different motif.

### New explorations
```css-doodle
:doodle {
          @grid: 6x1 / 280px auto 1 / #1b2242;
          --bg: @doodle(
            @grid: 1 / 100%;
            background: radial-gradient(@m8.@P(#eeeeee,#59569d,#f25292,#fea096));
              clip-path: @shape(
                points: 360;
                scale: .4;
                x: sin(t) + tan.cos(t) + tan.sin(t);
                y: cos(17t) + tan.cos(t) + tan.cos(t);
                frame: 50;
              );
          );
        }
        :container {
          filter: drop-shadow(0 -1px 0 #fff);
        }
        clip-path: @shape(rotate: @calc(30));
        @place: @plot(r: .5; dir: auto -90);
        @size: 50%;
        :before, :after {
          content: '';
          position: absolute;
          inset: 0;
          transform: rotateY(@pn(180deg, 0));
          background: var(--bg);
        }
```
Trick: defines the pattern once as `--bg` and paints it on both `:before` and `:after` instead of computing the background twice.
