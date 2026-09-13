---
source: https://howtotestfrontend.com/resources/react-testing-interview-questions
fetched: 2026-09-13
published: 2026-06-27
status: fresh
---
A set of frontend-testing gotchas that regularly trip engineers up — `act()`, debounced inputs under fake timers, jsdom's missing `IntersectionObserver`, and testing keyboard drag-and-drop. Reach for it when you hit one of these specific situations rather than as general testing advice.

## how
- **act() warnings**: `act()` flushes queued state updates and re-renders before you assert; ignoring the warning risks asserting against stale UI. `userEvent` and `waitFor` already wrap themselves in it internally — you only need to add it manually around raw calls like `jest.advanceTimersByTime`.
- **Debounced input under fake timers**: asserting right after typing fails (the debounce hasn't fired yet), and `await waitFor(() => expect(onSearch).toHaveBeenCalled())` just lets the real debounce run in real time. Use fake timers, configure `userEvent.setup({ advanceTimers: jest.advanceTimersByTime })` so typing still works, then advance timers inside `act()`.
```tsx
const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
await user.type(screen.getByPlaceholderText('Search...'), 'react');
expect(onSearch).not.toHaveBeenCalled(); // still debouncing

act(() => {
  jest.advanceTimersByTime(300);
});
expect(onSearch).toHaveBeenCalledWith('react');
```
- **IntersectionObserver in jsdom**: jsdom ships no `IntersectionObserver`, so using it throws `ReferenceError: IntersectionObserver is not defined`. Either run the test in a real browser (Playwright/Cypress/Vitest Browser Mode), or stub the global and trigger callbacks manually (`jsdom-testing-mocks` has a premade one).
```ts
class MockIO {
  constructor(private callback) {}
  observe = (el) => observers.set(el, this.callback);
  unobserve = (el) => observers.delete(el);
  disconnect = () => observers.clear();
}
vi.stubGlobal('IntersectionObserver', MockIO);
```
- **Keyboard drag-and-drop**: simulating `mouseDown → mouseMove → mouseUp` doesn't work in jsdom since there's no real layout to read positions from. Drive the library's keyboard handler instead (e.g. `@dnd-kit`'s built-in keyboard support) with `fireEvent.keyDown`.
```tsx
act(() => handle.focus());
fireEvent.keyDown(handle, { key: ' ', code: 'Space' }); // pick up
fireEvent.keyDown(handle, { key: 'ArrowDown', code: 'ArrowDown' }); // move down
fireEvent.keyDown(handle, { key: ' ', code: 'Space' }); // drop
```
