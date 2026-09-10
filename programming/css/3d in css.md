---
source: https://garden.bradwoods.io/notes/css/3d
fetched: 2026-09-10
published: 2023-01
status: fresh
---
Core property cheat sheet for building three-dimensional scenes in CSS: a `perspective` container establishes the 3D viewport, and children move through it with the `translate3d`/`scale3d`/`rotateX-Y-Z` transform functions. Reach for these when reclaiming screen space with a y-axis rotation on small screens, or building menus, presentations, and system-architecture visualizations.

## how
- `perspective: 800px` on the parent sets the 3D viewing distance; lower values exaggerate the z-transform effect on children, higher values diminish it.
- `perspective-origin: 50% 50%` moves the vanishing point (default is centered).
- `transform: translate3d(0px, 0px, -500px)` moves a child along x/y/z; the z value's visual strength depends on the parent's `perspective`.
- `transform: scale3d(1, 1, 1)` resizes an element in 3D space.
- `transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg)` rotates around each axis independently.
- `transform-style: preserve-3d` lets nested children share the parent's 3D space instead of flattening to a 2D plane.

## gotchas
- SVG children don't support 3D transforms — still true in 2026, as Safari/WebKit and Firefox still lack full 3D-transform support on SVG.
