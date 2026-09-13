---
source: https://frontendmastery.com/posts/building-future-facing-frontend-architectures/
fetched: 2026-09-13
published: 2022-06-13
status: fresh
---
Top-down (draw boxes around the design, build the top-level component, pass data down through props) versus bottom-up (catalog the small pieces first, compose them into the top-level component) is the key fork in component design. Top-down is the intuitive default and fine for small cases, but on a large, multi-team codebase it drifts into monolithic, hard-to-change components; bottom-up is slower to start but stays adaptable, so reach for it on shared components with a long lifespan.

## how
Where top-down goes wrong: each new requirement gets bolted on as another prop and another internal conditional, because undoing the existing abstraction is slower under deadline pressure than adding a flag — this organic growth is how components become monolithic.

Strategies for avoiding monolithic components:
- Balancing single responsibility vs DRY — tolerate duplication at points of consumption rather than abstracting early
- Inversion of control — expose slots via `children` or render props instead of accepting configuration data the component forks logic on
- Open for extension — export the small primitives alongside the specialized component so consumers can recompose them
- Leveraging storybook driven development — build every state (loading, error, partial data, impossible states) in isolation to surface the component's real shape early
- Name components for what they do, avoid generic names that invite unrelated changes
- Avoid prop names that encode implementation details (`isSomething`) instead of what the prop actually controls
- Avoid defining components inside a render method (they remount every render)

```jsx
// top-down: consumer passes data, component forks on it
<Button isLoading={loading} />

// inversion of control: component exposes a slot instead
<Button before={loading ? <LoadingSpinner /> : null} />
```

Breaking down an existing monolithic component uses standard refactoring catalog moves (components are just functions):
- Remove Flag Argument
- Replace Conditional with Polymorphism
- Pull Up Field
- Rename Variable
- Inline Function

## gotchas
- Premature abstraction: seeing duplication at composition sites and DRYing it up immediately tends to lock in the wrong abstraction, which is harder to undo than living with no abstraction for a while.
