---
source: https://julesblom.com/writing/react-visual-notation
fetched: 2026-10-20
published: 2026-10-08
status: fresh
---
A diagram notation for React that draws the parent tree as an indented tree and overlays the owner tree as arcs. It shows structure that lives between files: what contains what, which parts a boundary covers, who reads a context. Reach for it to explain React, review composition, or trace where props come from.

## how
- Parent tree: an indented tree with a circle per component. When parent and owner are the same, no arcs are needed.
- Owner arcs: an element's owner is the component whose JSX created it. When JSX is slotted through props (`children`, a `sidebar` prop), a dashed arc runs from owner to ownee, so the trees diverge visibly.
- `React.memo`: a purple disc is the comparison gate. The arc ends at the disc, which holds the retained props.
- Context: a provider is a row whose area is its parent subtree. A filled dot at the right edge is the current value, with a line to each component that calls `useContext`.
- Squares: filled squares for `<Suspense>`, error boundaries, `<Activity>`, `<ViewTransition>`, `<Profiler>`. A square's area is the subtree the wrapper applies to.
- Exclusive areas (providers, Suspense, error boundaries, ViewTransition) subtract nested ones of the same kind. Inclusive ones (Profiler, Activity) do not.
- Suspense: the area is what the fallback replaces, the fallback shows as a dashed overlay in the right gutter, dashed means "not mounted".
- Error boundary: a red square outlining the protected subtree. When something throws, the caught subtree goes error-dashed and the fallback mounts.
- Server Components: server-rendered rows and edges use a server color with italic names. The `'use client'` entry carries a badge, where props crossing in must be serializable.
- Questions it answers: who can read this context value, what a boundary covers, what gates a re-render.
- Tooling: `react-parent-owner-trees` on npm, a dev-only tool for React 19 apps that draws the trees live from one script tag, built on bippy.

## gotchas
- Deliberately omitted for now: hooks, individual props, conditional rendering, re-renders.
- The React Compiler caches JSX elements in the parent rather than wrapping children in `React.memo`, so compiler-memoized components get no memo disc.
- The author says the tool works on small curated examples, not a real codebase; showing the right part of a large tree is unsolved.
- The author has not written a Server Component, so the RSC section is secondhand.
