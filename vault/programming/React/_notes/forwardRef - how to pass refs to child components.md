---
source: https://dmitripavlutin.com/react-forwardref/
fetched: 2026-09-11
published: 2023-04-06
status: stale
---
`forwardRef()` lets a parent component get a ref to a DOM element (or imperative API) that lives inside a child component, since a plain `ref` prop on a function component just warns and returns `undefined`. Pair it with `useImperativeHandle()` when the parent needs more than the raw DOM node — a curated object of methods instead.

## how
```jsx
import { useRef, useEffect, forwardRef } from 'react'

export function Parent() {
  const elementRef = useRef()
  useEffect(() => {
    console.log(elementRef.current) // logs <div>Hello, World!</div>
  }, [])
  return <Child ref={elementRef} />
}

const Child = forwardRef(function(props, ref) {
  return <div ref={ref}>Hello, World!</div>
})
```
To expose a custom API instead of the raw DOM node, add `useImperativeHandle`:
```jsx
import { useRef, forwardRef, useImperativeHandle } from 'react'

const FocusableInput = forwardRef(function (props, ref) {
  const inputRef = useRef()
  useImperativeHandle(ref, function () {
    return {
      focus() { inputRef.current.focus() },
      blur() { inputRef.current.blur() }
    }
  }, [])
  return <input type="text" ref={inputRef} />
})
```
Refs can be forwarded more than one level down by wrapping each intermediate component in `forwardRef()` and passing the ref straight through.

## gotchas
- A forwarded ref reads as `undefined`/`null` if it isn't assigned to the target element's `ref` attribute inside the child, or if that element is conditionally unmounted.
- Passing a ref through a custom prop (e.g. `elementRef`) works but breaks props immutability and the consistent `ref` API across class/function components/HTML tags — prefer `forwardRef`.
- Wrapping an anonymous function in `forwardRef()` loses the component's name in React DevTools; use a named function expression.
- Applies to React 18 and below: since React 19, `ref` is a plain prop on function components and `forwardRef` is on a deprecation path — replacement: ref as a prop (React 19+, react.dev/reference/react/forwardRef).
