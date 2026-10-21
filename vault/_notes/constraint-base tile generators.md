---
source: https://www.boristhebrave.com/2021/10/31/constraint-based-tile-generators/
fetched: 2026-09-14
published: 2021-10-31
status: fresh
---
Wave Function Collapse and Model Synthesis are both special cases of a wider family boristhebrave calls constraint-based tile generators: fill a grid of tiles by satisfying a set of local, hard constraints via a generalized solver. Reach for this taxonomy when you're picking or designing a tile generator and want to know which axis (model, inference, solver, heuristics, grid) to customize instead of reinventing WFC from scratch.

## how
Independent axes you can mix and match:
- Model — the constraint type: Adjacency (Wang tiles, one constraint per shared edge) vs. Overlapping (a whole rectangular patch must match a sample library; costlier to evaluate but produces richer patterns; introduced by WFC)
- Model inference — where constraints come from: sample-based (draw an example, infer adjacencies/patches from it — the only practical route for overlapping models, but overfits incidental detail as tile count grows), labels (tag each tile edge and require exact/compatible matches — Tile Composer takes a label or a label pair per edge, Tessera uses nine per side for finer control), content-based (skip labels, compare tile pixels or mesh geometry directly across the border, as in Generate Worlds and marian42's city generator)
- Solver — how the grid gets filled: general-purpose solvers (Tile Composer can call out to Z3; Clingo is another option) vs. Arc Consistency (AC-3/AC-4), the simpler approach both WFC and Model Synthesis use — easy to implement, fast, customizable, but can still get stuck
- Cell heuristic — which cell to fill next: linear scan (fixed order, from Model Synthesis) vs. min-entropy (fewest remaining tile choices first, from WFC)
- Tile heuristic — which tile to place: weighted random by default, or Townscaper's always-pick-highest-priority-tile approach, which trades randomness for a deterministic, player-steerable result
- Contradiction handling — when the partial grid can't be extended: restart from scratch, backtrack one step, restart per chunk, or full conflict-driven clause learning (rare, hard to implement)
- Grid — not limited to squares: hex, triangle, irregular (sphere, Townscaper's messy grid) all work, and tiles can be images, meshes, or individual pixels

Tools named in the piece:
- WaveFunctionCollapse (WFC): popularized the Overlapping model; sample-based inference; min-entropy cell heuristic
- Model Synthesis: predates WFC; linear-scan cell heuristic; the sibling algorithm WFC is usually compared against
- DeBroglie, Tile Composer: implementations that extend WFC/Model Synthesis beyond the basic algorithm; Tile Composer supports label-based inference and pluggable solvers (Z3)
- Tessera: the author's own label-based tool, nine labels per tile side
- Townscaper: highest-priority tile heuristic on an irregular grid, for deterministic, obscure-pattern-on-demand results
- Bad North, Cave of Qud: cited as further shipped products built on this family of techniques

## gotchas
- Sample-based inference is the only practical way to specify overlapping-model constraints, but it tends to bake in incidental detail from the sample as tile count grows
