---
source: https://sinja.io/blog/guide-to-concurrency-in-react-18
fetched: 2026-09-11
published: 2023-11-10
status: fresh
---
React 18 splits state updates into two priorities: urgent updates (the default, synchronous, uninterruptible) and transition updates (low-priority, interruptible, can be discarded and restarted). Reach for the transition APIs when a state change drives an expensive or Suspense-triggering render — a long list, a search result — that would otherwise freeze urgent updates like typing into an input.

## how

### startTransition
Wrap the low-priority state update; call it outside the component, and only pass it synchronous functions (React 18.2).
```jsx
const onInputChange = (value) => {
    setInputValue(value);       // urgent
    startTransition(() => {
        setSearchQuery(value);  // transition
    });
};
```

### useTransition
Hook version; returns an `isPending` flag alongside `startTransition` for an inline loading indicator.
```jsx
const [isPending, startTransition] = useTransition();
const onInputChange = (value) => {
    setInputValue(value);
    startTransition(() => setSearchQuery(value));
};
// <SectionHeader isLoading={isPending} />
```

### useDeferredValue
Wraps a value directly instead of a setter — useful when the same state feeds both a critical component (the input) and a heavy one (the results).
```jsx
const [inputValue, setInputValue] = useState("");
const searchQuery = useDeferredValue(inputValue);
// isLoading = inputValue !== searchQuery
```

## gotchas
- CPU-bound components rendered inside a transition should be wrapped in `React.memo`, otherwise they re-render on every high-priority render even with unchanged props.
- React can only yield between component renders, never mid-component — one or two heavy components won't benefit much; concurrency shines when many moderately slow components add up.
- `useTransition` triggers two renders: one urgent render to flip `isPending` to `true`, then the low-priority render for the actual update.
