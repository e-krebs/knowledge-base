---
source: https://laktek.com/modal-dialogs-without-react-javascript
fetched: 2026-09-13
published: 2025-11-09
status: fresh
---
A `<dialog popover>` combined with `popovertarget`/`popovertargetaction` on a `<button>` opens and closes a dialog declaratively, with no JavaScript, and works across all major browsers including Safari. It's non-modal — the rest of the page stays interactive — so upgrade to a true modal with a single line of JS calling `showModal()`/`close()` on the dialog.

## how
```html
<button popovertarget="sample-dialog" popovertargetaction="toggle">
  Open Dialog
</button>

<dialog popover id="sample-dialog">
    <div>This is a sample dialog</div>
    <button popovertarget="sample-dialog" popovertargetaction="hide">Close</button>
</dialog>
```
To make it modal instead, swap the popover attributes for a one-line JS call:
```html
<button onClick="document.getElementById('sample-dialog').showModal()">
  Open Dialog
</button>
<dialog id="sample-dialog">
  <div>This is a sample dialog</div>
  <button onClick="document.getElementById('sample-dialog').close()">
    Close
  </button>
</dialog>
```

## gotchas
- The article claims Safari doesn't support `command`/`commandfor` — that's now outdated: Safari 26.2 (shipped 2025-12) added `command`/`commandfor`, so the caveat no longer applies (freshness-b.json).
