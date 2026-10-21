---
source: https://angular.love/exploring-how-virtual-dom-is-implemented-in-react
fetched: 2026-09-11
published: 2022-05-02
status: fresh
---
Explains React's virtual DOM as a tree of `FiberNode`s, and how the `current`/`workInProgress`/`alternate` trio lets React find exactly what changed before committing everything to the real DOM in one batch. Reach for this when you need to reason about why React skips whole subtrees during reconciliation, or what "commit phase" actually operates on.

## how
Each React element gets a `FiberNode`, linked to its neighbors via `child`, `sibling`, and `return` (the parent, called `return` for historical reasons):
```js
AppFiberNode.child === ArticleFiberNode
H2FiberNode.sibling === PFiberNode
H2FiberNode.return === ArticleFiberNode // and PFiberNode.return === ArticleFiberNode
```
Every `FiberNode` also has an `alternate` pointing to its counterpart in the other tree:
```js
// workInProgress === current.alternate        → true
// workInProgress.alternate === current        → true
current === current.alternate.alternate        // true
```
`current` is what's currently on screen; `workInProgress` is the tree being built with pending changes. When state changes (e.g. `setCount`), React marks the branch from the root down to the component that owns that state as dirty, then creates a `workInProgress` node for every node in that dirty subtree — even siblings unaffected by the change, since their parent can't know in advance which descendant changed. Untouched subtrees (siblings outside the dirty branch) are skipped entirely. Once all `workInProgress` nodes are resolved, React commits the whole batch to the real DOM at once, and `workInProgress` becomes the new `current` for the next cycle.

## gotchas
- A `workInProgress` node existing for a fiber doesn't mean that fiber changed — it may just sit on the path to a descendant that did, and gets skipped at commit if nothing in it actually differs.
- A static child element (e.g. `<h3>hello</h3>`) still gets a new object every re-render of its parent, because re-rendering re-invokes `createElement` — identical output, new reference.
