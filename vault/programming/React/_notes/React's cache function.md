---
source: https://playfulprogramming.com/posts/explaining-reacts-cache-function/
fetched: 2026-09-11
published: 2023-12-17
status: stale
---
`cache()` wraps a pure function so that repeated calls with the same arguments — even from different, unrelated component instances in the same render pass — return the memoized result instead of recomputing. Unlike `useMemo`, it needs no change to the calling component and shares its cached results across components. Reach for it when several components in one render need the same derived value, or to pre-fetch data with `use()` before the component that needs it actually renders.

## how
```jsx
const getTheme = cache((primaryColor) => {
  const [secondary, tertiary] = generateComplimentaryColors(primaryColor);
  return { primaryColor, secondary, tertiary };
});

function ThemePreviewRow({ type, themeColor }) {
  // computed once even though called from multiple component instances
  const theme = getTheme(themeColor);
  return <tr>{/* render theme[type] */}</tr>;
}
```
Pre-loading async data before the component that needs it renders:
```jsx
import { cache, use } from "react";

const getMovie = cache(async (id) => await db.movie.get(id));

async function MovieDetails({ id }) {
  const movie = use(getMovie(id));
  return (/* ... */);
}

function MoviePage({ id }) {
  getMovie(id); // pre-fetch before MovieDetails renders
  return <MovieDetails id={id} />;
}
```

## gotchas
- Errors thrown inside the wrapped function are memoized too — a failing call only runs (and throws) once, even when triggered from many component instances.
- Differs from `memo`, which memoizes a component's own re-render by props, not a plain function's return value.
- Superseded: `cache()` is now stable and documented in React 19, RSC-only (react.dev/reference/react/cache) — this article (Dec 2023) still describes it as canary-only and experimental.
