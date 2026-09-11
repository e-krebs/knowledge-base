---
source: https://dev.to/jkettmann/data-structures-in-frontend-javascript-in-the-real-world-with-react-code-examples-3506
fetched: 2026-09-11
published: 2022-11-18
status: fresh
---
Frontend data doesn't usually need textbook data-structure implementations, but the same shapes — map, set, stack, queue, tree — show up constantly disguised as plain objects and arrays. Picking the wrong one is a common source of messy rendering/update logic, so it's worth recognizing which shape a given piece of UI state actually is.

### Map
Key-value storage; native `Map` preserves key types (object keys aren't stringified, unlike plain-object keys) and is optimized for lookup by key.
React use case: cross-referencing two datasets, e.g. resolving a message's `userId` to a user name without an O(n) `.find()` per message — build `new Map(users.map(({id, name}) => [id, name]))` once, then `namesById.get(userId)`.

### Set
A keyed collection of unique values, closer to an array than an object; checking membership is fast.
React use case: tracking selected row ids in a table (`useState(new Set())`), toggling with `add`/`delete`/`has` — avoids the bug-prone pattern of a parallel `selected` boolean array that must stay index-synced with re-sortable rows.

### Stack
LIFO: push/pop from the same end. Not native in JS; implemented on a plain array.
React use case: an undo history — push each user action onto a `history` array on change, pop (immutably, via `concat`/`slice` rather than `push`/`pop`, since React state must stay immutable) to undo it.

### Queue
FIFO: push at one end, remove from the other. Also just an array in JS (`push` + `shift`).
React use case: a notification queue — append new notifications to the end, and `setTimeout`-driven removal takes from the front (`slice(1)`) so they clear in the order they arrived.

### Tree
A nested parent/children structure, usually paired with recursive rendering functions.
React use case: nested menus or threaded comments. A nested-object tree is easy to read and render recursively, but a flat array of `{id, parent, children}` records is easier to update immutably — trade recursive simplicity for flat-update-friendliness depending on whether the tree needs frequent mutation.

## gotchas
- Deeply recursive rendering can hit the JS engine's call-stack limit (the article demonstrates a crash around depth ~11000) — flatten deeply nested trees rather than recursing arbitrarily deep.
- React's requirement for immutable state updates means custom/mutable data-structure implementations (e.g. a textbook linked list) rarely pay off on the frontend — cloning them for each update usually erases any performance win.
