---
source: https://medium.com/globant/achieving-clean-and-maintainable-react-component-tests-b3d5e0483307
fetched: 2026-09-13
published: 2023-07-31
status: fresh
---
Wraps a tested component in a defaults-providing wrapper component, then exposes every query used against it as getters on a plain "dialog" object, so tests stop repeating boilerplate props and raw `getByTestId` calls. Reach for it once more than a couple of tests render the same component and query the same elements.

## how
1. Create a wrapper typed with `Partial<ComponentProps<typeof X>>` so it always has valid default props, and callers only pass what a given test cares about.
2. Move every query into getters on a "dialog" object, grouping related elements (e.g. `buttons.confirm`) so tests read as `dialog.buttons.confirm` instead of `screen.getByTestId(...)`.

```tsx
const ConfirmModalDefault = (
  props: Partial<ComponentProps<typeof ConfirmModal>>
) => (
  <ConfirmModal
    title="Some title"
    onConfirm={jest.fn()}
    onCancel={jest.fn()}
    {...props}
  />
);

const dialog = {
  get title() {
    return screen.getByTestId("Modal.Title");
  },
  get body() {
    return screen.queryByTestId("Modal.Body");
  },
  buttons: {
    get confirm() {
      return screen.getByTestId("Modal.Buttons.Confirm");
    },
    get cancel() {
      return screen.getByTestId("Modal.Buttons.Cancel");
    },
  },
};
```

## gotchas
- Type each getter's return value (e.g. `screen.queryByTestId<HTMLButtonElement>(...)`) so the test writer gets element-specific typing back.
