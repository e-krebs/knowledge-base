---
source: https://www.aleksandrhovhannisyan.com/blog/react-context-nested-components/
fetched: 2026-09-11
published: 2023-02-05
status: fresh
---
React Context can be abused to detect whether a component is nested inside another instance of itself, which is useful for DOM validation (e.g. banning a button from containing another button) since neither HTML, the browser, nor React stops that, and a linter only catches it within a single file. Reach for this when you need to enforce a parent/child rule across arbitrarily deep, cross-file component trees.

## how
A component renders its own context provider and also consumes that same context. If the value it reads back is the default, there's no ancestor; if it reads the provided value, an instance of itself is somewhere above it in the tree.

```jsx
const ButtonAncestryContext = createContext(false);
const useButtonAncestry = () => useContext(ButtonAncestryContext);

const Button = (props) => {
  // true if there's another Button above us in the DOM...
  const hasButtonParent = useButtonAncestry();

  // ...and if that's the case, we have an invalid DOM
  if (hasButtonParent) {
    throw new Error(`Invalid DOM: buttons cannot be children of buttons.`);
  }

  return (
    <ButtonAncestryContext.Provider value={true}>
      <button {...props} />
    </ButtonAncestryContext.Provider>
  );
};
```

Generalize by renaming the context to something like `InteractiveAncestryContext` and exporting a shared `InteractiveAncestryProvider`, so `Button`, `Link`, `Input`, etc. can all opt into the same cross-type nesting check. The same trick works with a value other than a boolean — e.g. storing a reference to a popper instance so a nested popper can exclude its parent when closing all other open poppers.

## gotchas
- If the component is rendered conditionally or behind gating logic, the build won't fail — you get an uncaught runtime error instead of a compile-time one.
