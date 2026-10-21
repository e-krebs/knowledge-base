---
source: https://www.epicreact.dev/preserving-and-resetting-state-in-react-l2dxl
fetched: 2026-09-11
status: fresh
---
React keeps a component's state tied to its position in the render tree, not to what the component "is" — so toggling between two different component trees at the same position (an `if`/`return` that sometimes wraps children and sometimes returns them directly) resets state on every switch, even though the children look the same.

## how
```jsx
// resets state whenever `wrap` flips: the tree shape at this position changes
if (props.wrap) {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  )
}

return children
```

## gotchas
- keep the tree shape stable: always render `Wrapper` and toggle its styling/behavior with a prop instead of conditionally rendering it
- to intentionally reset state instead, give the component a different `key`
- or lift the state up to a parent component so it survives the tree changing underneath it
