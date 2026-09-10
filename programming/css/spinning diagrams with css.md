---
source: https://x.st/spinning-diagrams-with-css/
fetched: 2026-09-10
published: 2023-04-20
status: fresh
---
Builds a spinning 3D diagram (e.g. a cube) purely in HTML/CSS: each vertex is a `translate3d`-positioned child, the parent rotates via `@keyframes`, and an inner wrapper applies the inverse rotation so labels stay upright and readable. Reach for this for animated 3D diagrams or spinning labels where JavaScript would be overkill.

## how
```html
<div id="cube" style="width: 4em; height: 8em;">
  <div style="transform: translate3d(0em, 0em, 2em)">A</div>
  <div style="transform: translate3d(4em, 0em, 2em)">B</div>
  …
  <div style="transform: translate3d(0em, 4em, -2em)">G</div>
  <div style="transform: translate3d(4em, 4em, -2em)">H</div>
</div>
```

```css
#cube {
  position: relative;
  transform-style: preserve-3d;
  animation: spin 20s linear infinite;
}

#cube > div {
  position: absolute;
  transform-style: preserve-3d;
}

@keyframes spin {
  from { transform: rotateX(-0.1turn) rotateY(0turn); }
  to { transform: rotateX(-0.1turn) rotateY(1turn); }
}
```

To keep letters readable, wrap each vertex's content in an extra div that counter-rotates:

```css
#cube > div > div {
  animation: un-spin 20s linear infinite;
}

@keyframes un-spin {
  from { transform: rotateY(0turn); }
  to { transform: rotateY(-1turn); }
}
```
