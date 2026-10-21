---
source: https://www.developerway.com/posts/fetching-in-react-lost-promises
fetched: 2026-09-11
published: 2022-11-09
status: fresh
---
Fetching in `useEffect` keyed on a prop like `id` can race: if the prop changes again before the first fetch resolves, the stale response can land after the fresh one and overwrite it, producing flickering or wrong content. Reach for one of these fixes whenever a component re-fetches on a changing dependency (tabs, search, pagination) instead of mounting fresh each time.

## how
Drop stale results with a per-effect-run flag set in the cleanup function:
```js
useEffect(() => {
  let isActive = true;
  fetch(`/some-data-url/${id}`)
    .then((r) => r.json())
    .then((r) => {
      if (isActive) setData(r);
    });
  return () => { isActive = false; };
}, [id]);
```
Or cancel the previous request outright with `AbortController`, so only the latest one can ever resolve:
```js
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then((r) => r.json())
    .then((r) => setData(r))
    .catch((error) => {
      if (error.name !== 'AbortError') { /* a real error! */ }
    });
  return () => { controller.abort(); };
}, [url]);
```

## gotchas
- Forcing a remount with `<Page id={page} key={page} />` also "fixes" it (unmounted components can't call stale setters) but isn't recommended: it can hurt performance and cause unexpected focus/state bugs and re-triggered effects further down the tree.
- Aborting a request rejects its promise — catch and specifically ignore `AbortError`, or it surfaces as a real error.
- `async/await` has exactly the same race condition as `.then` chains; it's just different syntax over the same Promise.
