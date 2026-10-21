---
source: https://frontend.horse/articles/generative-grids/
fetched: 2026-09-14
published: 2022-04-27
status: fresh
---
Builds a generative-art grid of blocks: a random number of rows/columns, each block a randomly chosen shape/design colored from a shared palette, with a small GSAP transition when regenerating. Reach for this when you want geometric generative art but don't want to hand-pick shapes, positions, or colors — randomize each decision instead. Uses SVG.js to build the SVG, TinyColor to derive background shades from the palette, and GSAP for the transition animations.

## how

### Draw the grid
Pick a random row/column count, create the SVG with SVG.js, then loop over the grid drawing one block per cell:
```
numRows = random(4, 8, true);
numCols = random(4, 8, true);

draw = SVG() // Create the SVG
  .addTo(".container")
  .size("100%", "100%")
  .viewbox(`0 0 ${numRows * squareSize} ${numCols * squareSize}`);
```
Each `(i, j)` cell calls `generateLittleBlock(i, j)`, which converts the row/column into x/y and draws one `<group>` with a `<rect>` inside:
```
function drawBlock(x, y) {
  const group = draw.group().addClass("draw-block");
  group.rect(squareSize, squareSize).fill("white").stroke("black").move(x, y);
}
```
### Pick a random palette
Fetch a JSON list of curated palettes and pick one at random each time a grid is built:
```
colors = await fetch(
  "https://unpkg.com/nice-color-palettes@3.0.0/100.json",
).then((response) => response.json());
```
Derive the background from the first two palette colors with TinyColor, then set light/dark variants as CSS custom properties feeding a `radial-gradient` background:
```
const bg = tinycolor
  .mix(colorPalette[0], colorPalette[1], 50)
  .desaturate(10)
  .toString();
const bgInner = tinycolor(bg).lighten(10).toString();
const bgOuter = tinycolor(bg).darken(10).toString();
gsap.to(".container", { "--bg-inner": bgInner, "--bg-outer": bgOuter, duration: 0.5 });
```
Each block gets two different colors picked from the palette:
```
function getTwoColors(colors) {
  let colorList = [...colors];
  const colorIndex = random(0, colorList.length - 1, true);
  const background = colorList[colorIndex];
  colorList.splice(colorIndex, 1);
  const foreground = random(colorList);
  return { foreground, background };
}
```
### Draw the shapes per cell
Each design is its own function taking `(x, y, foreground, background)`; a random one from an array is picked per block. A masked variant crops overflowing circles to the block bounds:
```
function drawOppositeCircles(x, y, foreground, background) {
  const group = draw.group().addClass("opposite-circles");
  const circleGroup = draw.group();
  group.rect(squareSize, squareSize).fill(background).move(x, y);
  const mask = draw.rect(squareSize, squareSize).fill("#fff").move(x, y);
  circleGroup.circle(squareSize).fill(foreground).center(x, y + squareSize);
  circleGroup.circle(squareSize).fill(foreground).center(x + squareSize, y);
  circleGroup.maskWith(mask);
  group.add(circleGroup);
}
```
`Math.random()` gates small per-shape variations, e.g. adding an inner circle 30% of the time. One larger block (2x or 3x the square size) is drawn last at a random non-overflowing position for a focal point.

### Animate with GSAP
On regeneration: fade/shrink the old SVG, remove it from the DOM on completion, then fade/bounce the new one in:
```
function generateNewGrid() {
  gsap.to(".container > svg", {
    opacity: 0,
    scale: 0.8,
    duration: 0.25,
    onComplete: () => {
      document.querySelector(".container").innerHTML = "";
      drawGrid();
    },
  });
}

gsap.fromTo(
  ".container > svg",
  { opacity: 0, scale: 0.8 },
  { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
);
```

## gotchas
- Adjacent `rect`s often show thin gaps; `shape-rendering: crispEdges` removes them but makes circles look jagged, while `geometricprecision` smooths circles but brings the gaps back — pick per project, there's no setting that fixes both.
