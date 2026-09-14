---
source: https://www.boristhebrave.com/2022/12/18/how-does-planet-work/
fetched: 2026-09-14
published: 2022-12-18
status: fresh
---
Planet (2016, Oskar Stålberg) renders its globe as a geodesic sphere and picks its surface tiles through a dual-grid technique: edits are stored on the base grid's vertices, and each triangular tile is re-derived from its three corner values. Reach for this pattern when you want tile selection driven by smoothly-varying per-vertex data instead of by hand-painting tiles directly.

## how
- Base grid: the planet is a geodesic sphere made of near-equilateral triangles; pre-authored equilateral tiles are warped slightly to fit the sphere and cover its surface
- Dual grid: the user never edits tiles directly — clicks snap to the nearest base-grid vertex and set two hidden variables there, height and terrain type; after an edit, every triangle touching that vertex recomputes its tile from its 3 corners' variables
- The dual of the geodesic sphere (drawing one dual vertex per base face, joining two dual vertices when their base faces share an edge) is a Goldberg sphere: hexagons plus exactly 12 pentagons, like a soccer ball. Those 12 pentagons are the rare spots with only 5 triangles around a vertex instead of 6 (visible as 5-gatehouse city walls); the game's circular cursor reticule is just the dual face under the mouse
- Combinatorial limit: with 8 possible heights and 4 terrains per corner, a naive per-combination tileset would need \( (8\times 4)^3 \) tiles for one triangle — too many to author or load
- Tile selection instead assembles small pre-authored "modules" per triangle:
  - Landscaping: convert the heightmap into a 3D lattice, fill it Marching-Cubes-style, so the same module is reused across heights (triangular prisms need fewer combinations than cubes: 6 corners vs. 8)
  - Cliffs: extra variant modules cover adjacent-height differences of 2+, so steep drops don't look like sloped hills; separate beach variants join terrain to ocean level
  - Other layers: the same heightmap-to-module trick is reapplied per terrain by zeroing the heightmap outside that terrain's area, then overlaying results for glaciers, city walls, trees
  - Vertex meshes: city centers and forest clusters are stamped directly onto a vertex rather than fit into a triangle, breaking the triangular/hex look of a grid-following layout
  - Bridges: a pattern spanning more than one triangle, so bridge modules need dedicated detection code rather than the per-triangle rule
- Later Stålberg projects (Bad North, Townscaper) replaced this hand-rolled module system with Wave Function Collapse for picking mutually consistent tiles — Planet shows the dual-grid/module approach works without WFC

## gotchas
- The dual grid has exactly 12 pentagon faces (the rest are hexagons), each corresponding to a vertex with only 5 triangles instead of the usual 6 — easiest to spot on the city terrain, where those spots show a 5-gatehouse wall instead of 6
