---
source: https://kettanaito.com/blog/dont-sleep-on-abort-controller
fetched: 2026-09-11
published: 2024-09-18
status: fresh
---
`AbortController` is the standard cancellation primitive: it hands out an `AbortSignal` that any consumer can watch, plus an `.abort()` method that fires the signal's `abort` event. Reach for it anywhere an operation might need cancelling — a component unmounting, a user clicking "cancel", a newer request superseding an older one — since consumers only need to listen for that one shared event.

## how

### Event listeners
Pass `signal` to `addEventListener`; `controller.abort()` removes it — and every other listener sharing that signal — at once, e.g. as a single `useEffect` cleanup for several listeners:
```js
useEffect(() => {
  const controller = new AbortController()
  window.addEventListener('resize', handleResize, { signal: controller.signal })
  window.addEventListener('hashchange', handleHashChange, { signal: controller.signal })
  return () => controller.abort() // removes ALL listeners on this signal
}, [])
```

### Fetch
`fetch()` accepts `signal`; aborting rejects the pending request. Node's `http` module honors it too.
```js
const response = fetch('/upload', { method: 'POST', body: file, signal: controller.signal })
```

### Timeout
`AbortSignal.timeout()` skips creating a controller when all you need is a deadline.
```js
fetch(url, { signal: AbortSignal.timeout(3000) })
```

### Combining signals
`AbortSignal.any()` merges several signals into one; any of them firing trips the merged signal.
```js
channel.addEventListener('message', handleMessage, {
  signal: AbortSignal.any([publicController.signal, internalController.signal]),
})
```

### Streams
`WritableStream` exposes `signal` on its controller; `writer.abort()` bubbles into it.
```js
write(chunk, controller) {
  controller.signal.addEventListener('abort', () => { /* handle abort */ })
}
```

### Custom abortables
Any function can accept a `signal` and listen for `'abort'` to become cancellable, e.g. wrapping a Drizzle ORM transaction to reject with a rollback error:
```js
options.signal?.addEventListener('abort', async () => {
  reject(new TransactionRollbackError())
})
```

## gotchas
- The abort reason (`controller.abort(reason)`) lands on `signal.reason` — pass a string, `Error`, or object to make cancellation reasons inspectable
- Baseline: `AbortController`/`AbortSignal` (including the `signal` listener option, `AbortSignal.timeout`, `AbortSignal.any`) remain the standard cancellation primitive, with no newer mechanism found
