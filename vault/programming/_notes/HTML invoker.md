---
source: https://utilitybend.com/blog/an-update-on-invokers-invoker-commands-in-html
fetched: 2026-09-13
published: 2024-07-15 (updated 2025-03-10)
status: fresh
---
The `command`/`commandfor` attributes let a button trigger built-in actions on a dialog or popover, or dispatch a custom event for your own JS, without wiring up a click handler. Reach for them for dialog open/close, popover show/hide/toggle, and small custom widgets (steppers, pickers) that need to react to a button by ID.

## how
```html
<button commandfor="my-modal" command="show-modal">Trigger dialog</button>
<dialog id="my-modal">This is my dialog</dialog>

<button commandfor="my-modal" command="close">
  Close
</button>
```

`commandfor` also targets popovers, with `command` values `toggle-popover`, `hide-popover`, `show-popover` (the equivalent of `popovertargetaction`'s `toggle`/`show`/`hide`).

A custom command (`--` prefix) skips the built-in behavior and just dispatches a `command` event on the target, which you read via `e.source`:

```html
<div class="counter-button">
  <input id="my-counter" type="number" value="0" />
  <button commandfor="my-counter" command="--add-num" value="10">+10</button>
</div>

<script>
const counter = document.getElementById("my-counter");
counter.addEventListener("command", (e) => {
  if (e.command === "--add-num") {
    counter.value = Number(counter.value) + Number(e.source.value);
  }
});
</script>
```

## gotchas
- if a button has both `popovertarget` and `commandfor`, `commandfor` wins and `popovertarget` is ignored
- this syntax reached Baseline in December 2025 across Chrome 135, Firefox 144 and Safari 26.2
