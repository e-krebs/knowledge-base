---
source: https://julesblom.com/writing/parents-owners-data-flow
fetched: 2026-09-11
published: 2023-08-28
status: fresh
---
React components form two related but different hierarchies: the parent tree (who is nested inside whom, visible in the DOM/DevTools) and the owner tree (who renders whom, the shape the props actually travel through). Reach for this distinction when prop drilling makes a change tedious — the fix is usually to flatten the owner tree, not the parent tree.

## how
- A component can be fully in control of its own content, or it can leave a "slot" for its parent to fill via the `children` prop (a "slotted" component).
- When an intermediate component (e.g. `<Dashboard>`) only forwards a prop like `user` to a deeply nested child without using it itself, that's prop drilling and a false dependency.
- Turn the intermediate component into a slotted component: instead of `<Dashboard>` rendering `<DashboardContent>` directly, `<Dashboard>` renders `{children}`, and the owner (e.g. `<App>`) places `<DashboardContent>` inside it.
- This flattens the owner tree (fewer levels the data has to pass through) while the resulting parent tree — and the DOM — stays identical.
- In React DevTools, double-click a component in the parent tree ("⚛️ Components" tab) to see its owner hierarchy.
- Different owner trees can generate identical parent trees — the owner tree is the shape of the data flow, so when data flow is a mess, look there first to find where a component should be lifted.

Rendering performance follows the same lever: since props (and their updates) follow the owner tree, separating components along owner-tree lines lets you avoid re-rendering parts of the UI that don't depend on the changed data — the author covers this in a follow-up post, "Parents & Owners in React: Rendering Performance".

## gotchas
- Lifting components inverts control: it can simplify code by cutting the props you pass through, but it also makes the higher-level (root) components more complex and forces lower-level components to be more generic/flexible than you may want — not the right call in every case.
