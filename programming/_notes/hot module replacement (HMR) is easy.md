---
source: https://bjornlu.com/blog/hot-module-replacement-is-easy
fetched: 2026-09-13
published: 2024-02-05
status: fresh
---
HMR swaps a module's code in a running app without a full page reload, so an edit shows up immediately in the browser. Reach for this when a module needs to react to its own updates (state reset, cleanup, opting out of HMR) instead of relying on the bundler's default full-reload fallback — covers Vite's implementation specifically.

## how
Four APIs on `import.meta.hot` in Vite:

**`accept()`** — replaces the old module with the new one; makes the module root of an "HMR boundary" (itself + its imports). `accept(cb)` is self-accepting; `accept(deps, cb)` accepts changes from listed imports.
```
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => { data = newModule.data })
}
```
**`dispose()`** — cleans up side effects (listeners, timers, state) right before the module is replaced or removed.
```
if (import.meta.hot) {
  import.meta.hot.dispose(() => { globalThis.__my_lib_data__ = {} })
}
```
**`prune()`** — final cleanup called once when a module is removed entirely (file deleted), detected during Vite's import-analysis phase.
```
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.prune(() => { removeStyle('/src/style.css') })
}
```
**`invalidate()`** — an action, not a hook: call inside `accept()` when the module can't update safely. Tells the Vite server to treat it as updated and re-run propagation.
```
import.meta.hot.accept((newModule) => {
  if (!(data in newModule)) import.meta.hot.invalidate()
})
```
**Propagation flow**, run once an edited file's modules are found in the module graph and passed through plugins' `handleHotUpdate()`:
- Walk the updated module's importers recursively looking for an accepted module.
- If found, check whether it accepts *this* change (self-accepting, or listing the changed dependency) — if yes, stop; the HMR client runs HMR on it.
- If not, keep propagating upward through its own importers, up to the root `index.html`, triggering a full page reload if none accept.
- With multiple HMR boundaries, each importer path is checked independently; one path lacking an accepted module falls the whole update back to a full reload.

## gotchas
- These APIs only run if a module (or a plugin, e.g. for Vue/Svelte) calls them — otherwise any edit falls back to a full page reload.
- Vite handles propagation server-side (unlike Webpack, client-side), simpler but requires the HMR APIs to be statically analyzable.
- Vite 6+ SSR HMR uses a `ModuleRunner`; Vite 5 and earlier always full-reloaded on server-side edits.
