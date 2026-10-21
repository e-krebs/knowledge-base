---
source: https://developer.chrome.com/blog/command-and-commandfor
fetched: 2026-09-13
published: 2025-03-07
status: fresh
---
`command` and `commandfor` let a button declare, in HTML, which action to run on another element by `id` — no click handler needed. They enhance and replace `popovertarget`/`popovertargetaction`, and the browser manages the matching `aria-expanded`/`aria-details` relations and focus for you.

## how
```html
<button commandfor="my-menu" command="show-popover">
  Open Menu
</button>
<div popover id="my-menu">
  <!-- ... -->
</div>
```

Built-in `command` values:
- `show-popover` → `el.showPopover()`
- `hide-popover` → `el.hidePopover()`
- `toggle-popover` → `el.togglePopover()`
- `show-modal` → `dialogEl.showModal()`
- `close` → `dialogEl.close()`

A custom command (`--` prefix) skips that built-in behavior and just dispatches a `command` event on the target element, carrying the value on `event.command`:

```js
image.addEventListener("command", (event) => {
  if (event.command == "--rotate-landscape") {
    image.style.rotate = "-90deg";
  } else if (event.command == "--rotate-portrait") {
    image.style.rotate = "0deg";
  }
});
```

## gotchas
- `commandfor` takes an element `id` and can't cross a shadow boundary; set the `.commandForElement` property from JS instead to target an element across shadow roots
