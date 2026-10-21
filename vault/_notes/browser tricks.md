---
source: https://alan.norbauer.com/articles/browser-debugging-tricks
fetched: 2026-09-14
published: 2024-02-18
status: fresh
---
Alan Norbauer's cheat sheet collects DevTools tricks that go beyond plain breakpoints and `console.log`: conditional-breakpoint side effects, console command-line APIs (`monitor`, `copy`, `$0`-`$4`), and small injected scripts for tracing calls, snapshotting DOM/state, and controlling exactly when execution pauses. Reach for these when a plain breakpoint or log line isn't enough — tracing which caller fired a bug, timing one code path, or inspecting an element that vanishes on mouseover.

## how
### Advanced conditional breakpoints
- Logpoint/tracepoint: put `console.log(...)` as the breakpoint condition to log without pausing; `console.count` adds a hit counter (native logpoints now ship in Chrome/Edge/Firefox too)
- Watch-pane snapshot: watch `console.table(localStorage)` to dump storage on every pause
- DOM-mutation watch: set a DOM mutation breakpoint, then watch `(window.doms=window.doms||[]).push(document.documentElement.outerHTML)` — always pauses, no log-only variant exists
- Trace a caller: `console.trace` as the condition on the suspect function, then click the last stack frame in the output
- Override behavior: rewrite an argument inside the condition itself, e.g. `id = 1, false` to force `id` while still returning `false` so the breakpoint never pauses
- Quick perf timing: `console.time('label')` / `console.timeEnd('label')` as conditions on a start and end breakpoint
- Break on arg count: `arguments.callee.length === 3`
- Break on arity mismatch: `arguments.callee.length != arguments.length`
- Skip page load: `performance.now() > 5000`
- Skip N seconds: `window.baseline = window.baseline || Date.now(), (Date.now()-window.baseline) > 5000`; reset anytime with `window.baseline = Date.now()`
- Break on CSS state: `getComputedStyle(document.body).backgroundColor === "rgb(255,0,0)"`
- Even calls only: `window.counter=(window.counter||0)+1, window.counter % 2 === 0`
- Random sample: `Math.random() < 0.1`
- Never Pause Here: right-click the gutter → sets a permanently-false conditional breakpoint on that line
- Auto instance IDs: in the constructor, `(window.instances=window.instances||[]).push(this)`, then look up `window.instances.indexOf(this)`
- Programmatic toggle: gate breakpoints on `window.enableBreakpoints`; flip it from the console, from another breakpoint's condition, or `setTimeout(() => window.enableBreakpoints = true, 5000)`

### monitor() class calls
- Trace every method on a class: `var p = Dog.prototype; Object.getOwnPropertyNames(p).forEach(k => monitor(p[k]))`
- Same from an instance instead of a known class: `var p = instance.constructor.prototype; ...forEach(k => monitor(p[k]))`
- Use `debug(fn)` instead of `monitor(fn)` to pause execution instead of just logging

### Call and debug a function
- Type `debugger; fn(1);` in the console, then "step into next function call" to land inside `fn`
- Or call `debug(fn)` once so every future call to `fn` pauses automatically

### Pause execution on URL change
- Override navigation hooks: `history.pushState = dbg; history.replaceState = dbg; window.onhashchange = dbg; window.onpopstate = dbg;` with `dbg = () => { debugger; }`
- Doesn't catch `location.replace`/`location.assign` (page unloads immediately); use `debug(window.location.replace)` / `debug(window.location.assign)` for those instead

### Debugging property reads
- Convert `{configOption: true}` to `{get configOption() { debugger; return true; }}` to break on every read of that property

### Use copy()
- Clipboard-copy without string truncation: `copy(document.documentElement.outerHTML)`, `copy(performance.getEntriesByType("resource"))`, `copy(JSON.parse(blob))`, `copy(localStorage)`

### Debugging HTML/CSS
- Freeze the DOM: `ctrl+\` (Chrome/Windows) pauses JS so mouseover/mutation can't change the DOM under you
- Catch a vanishing element: `setTimeout(function(){ debugger; }, 5000)`, then trigger the UI within the 5-second window before it pauses
- Snapshot the DOM once: `copy(document.documentElement.outerHTML)`; every second, push to an array: `setInterval(() => doms.push(document.documentElement.outerHTML), 1000)`; or log it straight to console each second
- Watch focus changes: poll `document.activeElement` in a `setInterval`, log when it differs from the last-seen value
- Find bold elements: `Array.from(document.querySelectorAll("*")).filter(e => ["bold","700"].includes(getComputedStyle(e).fontWeight))`; scope to `$0.querySelectorAll("*")` for descendants of the selected element only
- `$0` through `$4` reference the 5 most recently inspected elements in Chrome/Edge
- `getEventListeners($0)` lists listeners on the selected element (Chrome)
- `monitorEvents($0)` logs every event on the selected element; `monitorEvents($0, ["control","key"])` scopes to specific categories

## gotchas
- The URL-change override doesn't stop navigation and can't catch `location.replace`/`location.assign`, since the page unloads right after the call — use `debug()` on those two methods instead
- There is no way to make a DOM mutation breakpoint log-only; it always pauses execution
- The page's screenshots date from its 2020 update and no longer match the DevTools UI; the tricks themselves still work in Chrome and Firefox (checked 2026-09)
