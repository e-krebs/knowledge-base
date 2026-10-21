---
source: https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
fetched: 2026-09-13
published: 2024-05-13
status: fresh
---
SVG's native `<animate>` on the `d` attribute only morphs between paths that already have the same number of points and identical command types. To morph two arbitrary paths, normalize both to a common primitive (cubic Beziers) and split curves until their point counts match — then the native SMIL animation can run without a runtime JS library.

## how
1. **Normalize commands** (reduce every path to `M, L, Q, C, A, Z`):
   - Convert relative commands to absolute (accumulate onto the current point instead of assigning).
   - Convert `H`/`V` to `L`.
   - Convert `T` to `Q`, and `S` to `C`, by mirroring the previous curve's last control point through the current point (using the line parametric form `A + t(B - A)` with `t = 2.0`).
2. **Convert every primitive to a cubic (`C`)**:
   - Line → cubic: same start/end points as the line, control points at `t = 1/3` and `t = 2/3` along it.
   - Quadratic → cubic: keep the same start/end points; new control points are `C0 = (1/3)(P0 + 2P1)` and `C1 = (1/3)(2P1 + P2)`.
   - Arc → cubics: approximate with multiple cubics, each no larger than π/4 on the unit circle, then scale back to the original ellipse.
   - Keep `M` and `Z` markers in place — they mark subpath boundaries and must line up between the two paths.
3. **Match sub-path counts**: if path A has fewer sub-paths than B, run parallel morph animations — for each of A's sub-paths, morph the corresponding share of B's sub-paths into it (e.g. A=3, B=7 → two of B's sub-paths morph into each of A's, with the remainder folded into the last one). Animate `fill` to 0 opacity during these parallel morphs to hide transparency/conflation artifacts.
4. **Match curve counts per sub-path**: take the sub-path with fewer cubics and split its curves via De Casteljau subdivision until both sides have the same number of `C` commands.
5. **Splitting a cubic** (De Casteljau): interpolate points pairwise at parameter `t`, then interpolate the results, to get the split point and two new cubics:

```js
function lineAt(p0, p1, t) {
  return { x: p0.x + t * (p1.x - p0.x), y: p0.y + t * (p1.y - p0.y) };
}

function splitCubic(p0, p1, p2, p3, t) {
  const p01 = lineAt(p0, p1, t);
  const p12 = lineAt(p1, p2, t);
  const p23 = lineAt(p2, p3, t);
  const c0 = lineAt(p01, p12, t);
  const c1 = lineAt(p12, p23, t);
  const p = lineAt(c0, c1, t);
  return [
    { p0, p1: p01, p2: c0, p3: p },
    { p0: p, p1: c1, p2: p23, p3 },
  ];
}
```

To split one cubic into `count` equal pieces, call `splitCubic` repeatedly, each time taking `t = 1/(count - i)` and continuing with the remaining second half.

## gotchas
- Arcs are the one primitive a cubic can't represent exactly — only approximate — so arc-heavy paths morph less precisely than line/quadratic-heavy ones.
- Multiple morph animations landing on the same target path can still show conflation artifacts even with the fill-opacity trick.
