---
source: https://www.builder.io/blog/visual-guide-to-nodejs-event-loop
fetched: 2026-09-13
published: 2023-03-23
status: fresh
---
The event loop is what lets Node run async I/O without blocking the single JS thread: once the call stack is empty, it drains a fixed sequence of queues in priority order. Reach for this model when you need to reason about the order callbacks (timers, I/O, `setImmediate`, `process.nextTick`, Promises) actually fire in.

## how
All synchronous code runs to completion first — the event loop only acts once the call stack is empty. There are six queues, drained in this order, with the microtask queues (nextTick, then Promise) flushed after every phase:

1. Microtasks: `process.nextTick` queue, then Promise queue.
2. Timers phase: expired `setTimeout`/`setInterval` callbacks.
3. Microtasks again.
4. I/O phase: callbacks from `fs`, `http`, etc.
5. Microtasks again.
6. Check phase: `setImmediate` callbacks.
7. Microtasks again.
8. Close callbacks phase (e.g. socket `close` events).
9. Microtasks again.

If more callbacks remain queued, the loop runs another full pass; otherwise it exits. Consequences that follow directly from this order:
- A callback only runs once the call stack is empty — Node never interrupts running code to fire one.
- `setTimeout`/`setInterval` callbacks are given priority over I/O callbacks that become ready at the same time.
- Async operations without a native OS mechanism (e.g. some file I/O) run on libuv's thread pool so they don't block the main thread; operations with OS-level async support (e.g. networking) use OS primitives directly.
