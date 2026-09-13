---
source: https://nerdy.dev/closedby-any
fetched: 2026-09-13
published: 2025-10-16
status: fresh
---
`closedBy="any"` is a declarative attribute on `<dialog>` that adds light-dismiss: clicking or tapping outside the dialog closes it, no JavaScript needed. Reach for it instead of a manual outside-click listener whenever a dialog just needs to close on an outside click.

## how
```html
<dialog closedBy="any">
  <p>Hi, I'm a dialog.</p>
</dialog>
```
JS fallback for browsers that don't support it yet:
```js
someDialog.addEventListener('click', ({target:dialog}) => {
  if (dialog.nodeName === 'DIALOG')
    dialog.close('dismiss')
})
```

## gotchas
- Stable Safari still lacks `closedBy` as of September 2026 (freshness-a.json); keep the JS fallback for cross-browser dismiss.
