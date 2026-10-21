---
source: https://martinfowler.com/articles/data-fetch-spa.html
fetched: 2026-09-11
published: 2024-05-29
status: fresh
---
Five patterns for fetching remote data in a single-page app while staying responsive: wrap queries with meta-state, fetch independent queries in parallel, declare fallback UI in markup, split code into on-demand bundles, and prefetch ahead of need. Reach for the one that matches the problem — a request waterfall, a large unused bundle, a predictable next action — rather than adopting all five at once.

## how
### Asynchronous State Handler
Wrap each remote call in a hook exposing its metadata, instead of scattering `loading`/`error` state per component.
```js
function useService<T>(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<T>();
  const fetch = async () => {
    try { setLoading(true); setData(await get<T>(url)); }
    catch (e) { setError(e as Error); }
    finally { setLoading(false); }
  };
  return { loading, error, data, fetch };
}
```
When to use: worthwhile once an app has enough data-fetching call sites that the loading/error boilerplate repeats; for a small app it's fine to keep fetching logic inline in the component.

### Parallel Data Fetching
Two independent queries (e.g. a user and their friends) shouldn't run sequentially just because they're read in the same component tree — run them with `Promise.all` near the root instead of deep in each consumer (Fetch-Then-Render, vs the default Fetch-On-Render that creates a request waterfall).
```js
const getProfileData = async (id: string) =>
  Promise.all([get<User>(`/users/${id}`), get<User[]>(`/users/${id}/friends`)]);
```
When to use: whenever queries are independent of each other. Not usable when one request needs data produced by another (e.g. a recommendation feed that depends on the user's interests fetched first), or when a request must reflect real-time state (e.g. re-checking an item's status right before showing an action menu).

### Fallback Markup
Declare loading/error fallbacks in markup instead of branching on state inside the component:
```jsx
<Suspense fallback={<FriendsSkeleton />}>
  <Friends id={id} />
</Suspense>
```
With a Suspense-integrated fetcher, the component itself just reads data (`useSWR(key, fetcher, { suspense: true })`) and renders — no `loading`/`error` branches. When to use: strong fit once your app already has standard loading/error/empty components to reuse; adds overhead for simple apps and gives less per-error-type control than branching by hand.

### Code Splitting
Load a component's module only when needed via `React.lazy` + `Suspense`, e.g. a popover's detail card that pulls in a large UI package:
```jsx
const UserDetailCard = React.lazy(() => import("./user-detail-card.tsx"));
// ...
<Suspense fallback={<div>Loading...</div>}>
  <UserDetailCard id={user.id} />
</Suspense>
```
When to use: for large, conditionally-needed bundles (a rarely-opened panel, a heavy chart lib). A user-triggered load (e.g. on hover) still costs the time to download + parse the chunk before it can fetch its own data — pairing it with Prefetching removes that second wait.

### Prefetching
Start loading data (or a resource) before it's needed, predicting the user's next action — e.g. on `mouseenter` of the element that will open a popover:
```jsx
import { preload } from "swr";
const handleMouseEnter = () => {
  preload(`/user/${user.id}/details`, () => getUserDetail(user.id));
};
```
The consumer then reads from the same cache key (`useSWR`) and renders immediately once the bundle arrives, since the data request already ran in parallel with it. When to use: when initial load time matters and some user actions (hover, click) reliably predict what's needed next; skip it until that need is clear — wrong predictions delay the resources users actually needed.

## gotchas
- Suspense-based data fetching (Fallback Markup) matured from a library-dependent, semi-experimental pattern into a stable, first-class React mechanism once React 19 shipped (Dec 2024) — the article's caveat that it "still requires third-party libraries" is dated for that part.
