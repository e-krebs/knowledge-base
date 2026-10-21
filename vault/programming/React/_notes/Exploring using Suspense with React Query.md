---
source: https://www.teemutaskula.com/blog/exploring-query-suspense
fetched: 2026-09-11
published: 2025-03-22
status: fresh
---
`useSuspenseQuery` re-suspends and shows the boundary fallback again every time its query key changes, which is a bad experience for pagination, sorting, or filtering. Wrapping the query key in `useDeferredValue` keeps the previous (stale) data on screen while the new key resolves in the background, exposing an `isSuspending` flag for an inline indicator instead. Reach for this over `useTransition` when you want deferral to apply automatically, without wrapping every state setter that can change the query key.

## how
```jsx
import { useDeferredValue } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useSuspenseQueryDeferred(options) {
  const deferredQueryKey = useDeferredValue(options.queryKey);

  const query = useSuspenseQuery({
    ...options,
    queryKey: deferredQueryKey,
  });

  query.isSuspending = options.queryKey !== deferredQueryKey;

  return query;
}
```
Use it exactly like `useSuspenseQuery`, but read `query.isSuspending` for an inline loading state instead of relying on the Suspense fallback:
```jsx
const { data, isSuspending } = useSuspenseQueryDeferred({
  queryKey: ["todos", search, project],
  queryFn: () => fetchTodos({ search, project }),
});
```

## gotchas
- `queryKey` is usually a freshly created array on every render; since `useDeferredValue` compares with `Object.is`, `isSuspending` flips on every re-render unless the key is memoized to a stable reference first (e.g. with a deep-compare memo).
- Spreading the query into a new object (`{ ...query, isSuspending }`) disables React Query's render-optimization tracking — attach `isSuspending` directly onto the returned query object instead.
- `useTransition` is the alternative, but it requires wrapping every state setter that changes the query key, and doesn't work when that setter lives in a different component from the query (e.g. URL-driven state) — `useDeferredValue` avoids both problems.
- Suspense for data fetching isn't a good fit for non-dependent-but-optional content (autocomplete, below-the-fold, modals opened on demand) — use it only for data that's required and non-dependent for a view to render.
