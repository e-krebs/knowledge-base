---
source: https://howtotestfrontend.com/resources/react-act-function-everything-you-need-to-know
fetched: 2026-09-13
published: 2025-10-25
status: fresh
---
`act()` wraps React state updates and side effects in a test so they fully flush before assertions run, avoiding assertions against stale state. RTL's `userEvent`, `findBy...`, and `waitFor` already wrap it internally, so you only reach for it directly for manual state changes: raw DOM clicks, fake-timer advances, or hook updates via `renderHook()`.

## how
Always import from `@testing-library/react`, never from `react` directly:

```js
import { act } from '@testing-library/react';

await act(async () => {
  button.click();
});

expect(heading).toHaveTextContent('Count: 1');
```

Use `act()` when:
- testing hooks with `renderHook()` and calling functions that update state
- manually triggering state changes (e.g. calling `.click()` directly on a DOM element)
- manually dispatching events, not via `userEvent`
- state changes happen in `setTimeout`/`setInterval` or fake timers (`vi.advanceTimersByTime`)
- state changes after an awaited promise resolves

Don't use it when:
- wrapping RTL calls like `userEvent.click()`, `findBy...`, or `waitFor()` — they already call `act()` internally
- `await screen.findByText(...)` or `await waitFor(() => expect(...))` would cover the same wait

## gotchas
- always use the async form, `await act(async () => {...})`; the sync-only form has plans to be deprecated
- if you skip RTL entirely, set `global.IS_REACT_ACT_ENVIRONMENT = true` in your test setup or `act()` will warn
