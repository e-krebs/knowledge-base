---
source: https://developer.mozilla.org/en-US/blog/javascript-shape-drawing-function/
fetched: 2026-09-11
published: 2023-05-26
status: fresh
---
A generic `drawShape(x, y, r, sides)` function draws any regular polygon — triangle, square, hexagon, octagon — on a 2D canvas by walking `sides` points around a center point with trigonometry, instead of writing a one-off path per shape. Reach for it whenever you need a canvas polygon and don't want a bespoke drawing function for each shape.

## how
```js
function drawShape(x, y, r, sides) {
  // move the canvas to the center position
  ctx.translate(x, y);

  for (let i = 0; i < sides; i++) {
    // calculate the rotation
    const rotation = ((Math.PI * 2) / sides) * i;

    if (i === 0) {
      ctx.moveTo(r * Math.cos(rotation), r * Math.sin(rotation));
    } else {
      ctx.lineTo(r * Math.cos(rotation), r * Math.sin(rotation));
    }
  }

  ctx.closePath();
  ctx.stroke();

  // reset the translate position
  ctx.resetTransform();
}

drawShape(100, 100, 50, 3); // triangle
drawShape(225, 100, 50, 7); // heptagon
drawShape(350, 100, 50, 4); // square
```
Each point sits at `(r * cos(rotation), r * sin(rotation))` from the center, spaced `(2π / sides)` radians apart.

## gotchas
- `ctx.translate()` shifts the canvas origin persistently — call `ctx.resetTransform()` after stroking, or the next shape draws from the wrong origin
