## rendering
📝 [[why react renders]]
📝 [[the journey of a react component]]
📝 [[how virtual DOM in implemented in React]]
[A virtual DOM in 200 lines of JavaScript](https://lazamar.github.io/virtual-dom/) — ends with a queued update loop that diffs and patches the real dom

## refs
📝 [[forwardRef - how to pass refs to child components|forwardRef / how to pass refs to child components]]
📝 [[How To Use forwardRef With Generic Components]]
📝 [[refs in React- from access to DOM to imperative API|refs in React: from access to DOM to imperative API]]
📝 [[avoiding useEffect with callback refs]]

## concurrency
📝 [[concurrency in React]]
[Concurent React (and some Suspense)](https://blog.codeminer42.com/everything-you-need-to-know-about-concurrent-react-with-a-little-bit-of-suspense) — low and high priority renders are single-tiered, with no in-between levels
📝 [[Exploring using Suspense with React Query]]
[React's evolution from Hooks to Concurrent React](https://tigerabrodi.blog/reacts-evolution-from-hooks-to-concurrent-react) — fiber splits rendering into a pausable render phase and an uninterruptible commit phase
[React Concurrent Features: An Overview](https://certificates.dev/blog/react-concurrent-features-an-overview) — each hook maps to one coordination problem, shown with runnable code examples
📝 [[Concurrent React, External Stores, and Tearing]]
📝 [[you may be looking for a useSyncExternalStore]]

## effects
📝 [[separating events from effects]]
📝 [[removing Effect dependencies]]
📝 [[how to debounce & throttle in react]]

## performance
📝 [[Optimizing React performance without refs and memo]]
[PureComponent vs. Functional Components with hooks](https://www.developerway.com/posts/pure-components-vs-functional-and-hooks) — memo replaces PureComponent, prefer useCallback over updater functions over mirrored refs

## errors, cache & actions
📝 [[handle errors in React]]
📝 [[React's cache function]]
[useActionState](https://github.com/react/react/pull/28491) — the PR renaming useFormState and adding isPending, shipped in React 19
