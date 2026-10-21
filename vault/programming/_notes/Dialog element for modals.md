---
source: https://blog.webdevsimplified.com/2023-04/html-dialog/
fetched: 2026-09-13
published: 2023-04-24
status: stale
---
The `<dialog>` element gives you a native modal/non-modal popup with built-in focus handling and ARIA, so you don't have to hand-roll accessibility for a modal. Open it non-modally with `show()` or as a true modal with `showModal()`, close it with `close()` (a modal also closes on `Esc`), and style the box and its `::backdrop` like any other element. Reach for it whenever you need a popup or modal and want the accessibility basics for free.

## how
```html
<dialog id="my-dialog">
  <!-- Dialog Content -->
</dialog>
```
```js
const dialog = document.querySelector("dialog")
dialog.show()      // Opens a non-modal dialog
dialog.showModal() // Opens a modal
dialog.close()     // Closes the dialog
```

Closing on an outside click isn't built in: the `::backdrop` is a child of `<dialog>`, so a click listener has to check whether the click landed inside the dialog's own box.

```js
dialog.addEventListener("click", e => {
  const dialogDimensions = dialog.getBoundingClientRect()
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close()
  }
})
```

## gotchas
- clicking outside the dialog does not close it by default; the listener above is the manual workaround
- `closedby="any"` is now the declarative replacement for that manual listener — shipped in Chrome 134, Edge 134 and Firefox 141, but stable Safari still doesn't have it as of 2026-09
