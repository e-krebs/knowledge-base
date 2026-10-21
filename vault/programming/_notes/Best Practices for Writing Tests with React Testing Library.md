---
source: https://claritydev.net/blog/improving-react-testing-library-tests
fetched: 2026-09-13
published: 2024-03-12
status: fresh
---
A rundown of common React Testing Library mistakes and fixes: which query to reach for by default, `userEvent` vs `fireEvent`, and how to wait for async UI without over-using `waitFor`. Reach for it when writing or reviewing RTL tests, especially ones querying forms or anything that renders after a fetch.

## how
- Default to `*ByRole` with a `name` option (`getByRole("textbox", { name: "Name" })`); it needs the label properly associated via `htmlFor`/`id` (or `aria-label`) to resolve an accessible name.
- Fall back to `*ByLabelText` for inputs with no default role (password, email).
- Avoid `*ByText`/regex text matches for interactive elements (e.g. a submit button) — prefer `getByRole("button", { name: ... })`, since a broad match can hit unrelated text.
- Use `userEvent` over `fireEvent` for interactions; set it up once per test with a helper.
- Replace `waitFor` + `getBy*` with `findBy*` when waiting for an element to appear after an async render; use `waitForElementToBeRemoved` when waiting for one to disappear.
- Wrap fake-timer flushes in `act()` to fix "not wrapped in act(...)" warnings.

```jsx
function setup(jsx) {
  return { user: userEvent.setup(), ...render(jsx) };
}

describe("Form", () => {
  it("should save correct data on submit", async () => {
    const mockSave = jest.fn();
    const { user } = setup(<Form saveData={mockSave} />);

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Test");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(mockSave).toHaveBeenLastCalledWith({ ...defaultData, name: "Test" });
  });
});
```

```js
jest.useFakeTimers();
act(() => {
  jest.runAllTimers();
});
jest.useRealTimers();
```

## gotchas
- `*ByRole` is more robust than `*ByLabelText` (survives switching `<label>` for `aria-label`), but inputs without a default role still need `*ByLabelText`.
- Import `act` from React Testing Library, not from `react-dom/test-utils`.
- `userEvent` methods are async as of v13+ — `await` every call.
