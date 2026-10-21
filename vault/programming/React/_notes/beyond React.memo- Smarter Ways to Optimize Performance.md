---
source: https://cekrem.github.io/posts/beyond-react-memo-smarter-performance-optimization/
fetched: 2026-09-11
published: 2025-03-11
status: fresh
---
Before reaching for `React.memo`, check whether composition alone removes the re-render: move state down into a small component that owns it, or pass a slow subtree through as `children`/props so it's created once by the parent and merely referenced (not recreated) by the state-owning child. Reach for this when a state change is re-rendering components that don't depend on it — including state hidden inside a custom hook, which does not isolate re-renders by itself.

## how
Move state down so only the component that owns it re-renders:
```jsx
const ButtonWithModalDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open dialog</Button>
      {isOpen && <ModalDialog onClose={() => setIsOpen(false)} />}
    </>
  );
};
// App renders <ButtonWithModalDialog /> next to <VerySlowComponent />, which now never re-renders when the dialog opens.
```

Pass slow subtrees as `children` instead of memoizing them:
```jsx
const ScrollableWithFloatingNav = ({ children }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  return (
    <div className="scrollable" onScroll={(e) => setScrollPosition(e.target.scrollTop)}>
      <FloatingNavigation position={scrollPosition} />
      {children}
    </div>
  );
};
// <ScrollableWithFloatingNav><VerySlowComponent /></ScrollableWithFloatingNav>
// VerySlowComponent is created in App's scope and passed through by reference, unchanged.
```
`children` elements are created in the parent's scope, so the state-owning child just passes along the same references — React skips re-rendering them.

## gotchas
- A custom hook holding state doesn't isolate re-renders on its own — it just abstracts the state management; the component calling the hook still re-renders on every state change, so the hook's consumer needs moving down too, same as inline state.
