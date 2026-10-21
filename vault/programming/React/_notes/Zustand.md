---
source: https://tkdodo.eu/blog/working-with-zustand
fetched: 2026-09-11
published: 2022-11-20
status: fresh
---
A tight list of usage tips for Zustand, the tiny (~1.1kB) unopinionated global-state library that lets components subscribe to a store via selectors. Reach for these when structuring a new store or reviewing why a Zustand-backed component re-renders too often.

## how

### Only export custom hooks
Don't export the raw store; export one hook per piece of state so consumers can't accidentally subscribe to everything.
```js
const useBearStore = create((set) => ({
  bears: 0,
  fish: 0,
  increasePopulation: (by) => set((state) => ({ bears: state.bears + by })),
}))
export const useBears = () => useBearStore((state) => state.bears)
```

### Prefer atomic selectors
A selector returning a new object/array is never `===` equal across renders, so it re-renders on every store change. Passing `shallow` from `zustand/shallow` as the comparator fixes it, but one selector per field is simpler and avoids the problem entirely:
```js
export const useBears = () => useBearStore((state) => state.bears)
export const useFish = () => useBearStore((state) => state.fish)
```

### Separate actions from state
Actions never change, so group them under their own key and expose one hook for all of them — subscribing to "all actions" costs nothing since they're static:
```js
const useBearStore = create((set) => ({
  bears: 0,
  fish: 0,
  actions: {
    increasePopulation: (by) => set((state) => ({ bears: state.bears + by })),
    eatFish: () => set((state) => ({ fish: state.fish - 1 })),
  },
}))
export const useBearActions = () => useBearStore((state) => state.actions)
```

### Model actions as events, not setters
Keep the business logic (e.g. "increase population") inside the store's actions; components just call the action and the store decides what to do — same principle as the Redux style guide.

### Keep the scope of your store small
Unlike Redux's single store, use multiple small Zustand stores, each owning one piece of state. Combine them (or with `useQuery`/`useParams`) via a custom hook:
```js
export const useFilteredTodos = () => {
  const filters = useAppliedFilters()
  return useQuery({ queryKey: ['todos', filters], queryFn: () => getTodos(filters) })
}
```

## gotchas
- Zustand's built-in slices feature for combining stores exists but isn't straightforward, especially with TypeScript — reach for Redux Toolkit instead if you specifically need that.
