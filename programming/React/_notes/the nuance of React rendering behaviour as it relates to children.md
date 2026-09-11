---
source: https://blacksheepcode.com/posts/nuance_of_react_rendering_behaviour
fetched: 2026-09-11
published: 2025-09-22
status: stale
---
A component that renders a child directly (`<RenderTracker />`) re-renders that child on every state change, while a component that receives the same element via `props.children` does not — even though React's own "UI as a tree" docs draw no distinction between the two. Reach for this when a subtree re-renders more than expected and you want to understand why, before reaching for `memo`.

## how
Compiled JSX shows why: a directly-rendered child is a fresh element object created on every call of the parent function, but `props.children` is a reference the parent receives as an argument and simply passes through unchanged.
```js
// direct child: SomeThing is referenced anew each render
function ChildrenStyleOne() {
  return jsxRuntimeExports.jsxs("div", {
    children: [
      jsxRuntimeExports.jsx("p", { children: "A regular node" }),
      jsxRuntimeExports.jsx(SomeThing, { text: "world!" }), // new object each call
    ],
  });
}

// props.children: the same reference is passed through untouched
function ChildrenStyleTwo(props) {
  return jsxRuntimeExports.jsxs("div", {
    children: [
      jsxRuntimeExports.jsx("p", { children: "A regular node" }),
      props.children, // straight reference, unchanged across calls
    ],
  });
}
```
Calling `ChildrenStyleOne({})` twice produces two different (`===` false) element objects for `SomeThing`; calling `ChildrenStyleTwo` twice with the same `children` prop produces the same (`===` true) object. React skips re-rendering a subtree when the node it finds there is shallowly (`===`) equal to the one from the previous render — which is why only the `props.children` case is skipped.

## gotchas
- Superseded by React Compiler 1.0 (stable since 2025-10-07; opt-in via `babel-plugin-react-compiler` or a bundler flag, e.g. Next.js `reactCompiler: true`), which automatically memoizes components and removes the need to reason about this by hand — but the compiler is not enabled everywhere, so this children-vs-direct-render model still matters on any codebase without it.
