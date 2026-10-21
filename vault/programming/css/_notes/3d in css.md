---
source: https://garden.bradwoods.io/notes/css/3d
fetched: 2026-09-10
published: 2023-01
status: fresh
---
Core property cheat sheet for building three-dimensional scenes in CSS: a `perspective` container establishes the 3D space, `translate3d`/`scale3d`/`rotateX-Y-Z` move children through it, and `transform-style: preserve-3d` keeps nested descendants inside that space instead of flattening to 2D. Reach for these when reclaiming screen space with a y-axis rotation on small screens, or building unconventional menus, presentations, and zoomable system-architecture diagrams.

## how

### perspective
Enables a 3D space for child elements. Large `perspective` values cause small transformations; small values cause large ones.

```css
.parent {
  perspective: 800px;
}
```

### perspective-origin
Defines the vanishing point. Its default value is `50% 50%` — centered horizontally and vertically.

```css
.parent {
  perspective: 800px;
  perspective-origin: 50% 50%;
}
```

### translate3d()
Moves an element along the x, y, and z axes. `x` moves it horizontally, `y` vertically, and `z` closer or further away — the strength of that effect is set by the parent's `perspective`.

```css
.child {
  transform: translate3d(0px, 0px, -500px);
}
```

### scale3d()
Resizes the element in 3D space.

```css
.child {
  transform: scale3d(1, 1, 1);
}
```

### rotateX() / rotateY() / rotateZ()
Rotate the element around its own x-, y-, and z-axis respectively. All the transform functions above can combine in one `transform` list:

```css
.child {
  transform:
    translate3d(0px, 0px, -500px)
    scale3d(1, 1, 1)
    rotateX(0deg) rotateY(0deg) rotateZ(0deg);
}
```

### transform-style: preserve-3d
A child that isn't a direct descendant of the `perspective` parent gets flattened to its own parent's plane, and 3D transforms on it have no effect. Setting `preserve-3d` adds it back into the ancestor's 3D space.

```css
.child {
  transform-style: preserve-3d;
}
```

## gotchas
- SVG children don't support 3D transforms — still true in 2026, as Safari/WebKit and Firefox still lack full 3D-transform support on SVG.
