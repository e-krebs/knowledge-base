---
source: https://denodell.com/blog/html-best-kept-secret-output-tag
fetched: 2026-09-13
published: 2025-10-01
status: fresh
---
`<output>` is the native HTML element for the result of a calculation or user action. It's implicitly mapped to `role="status"` (like `aria-live="polite" aria-atomic="true"`), so screen readers announce updates automatically. Reach for it instead of a `<div>` plus a manual ARIA live region whenever you're rendering a computed value that depends on user input, and link it to its source inputs with `for`.

## how
```html
<input id="a" type="number"> +
<input id="b" type="number"> =
<output for="a b"></output>
```
`<output>` doesn't require a `<form>` and can be used anywhere you update dynamic text from user input. It's inline by default, so style it like a `<span>`. Same pattern for form validation feedback:
```html
<label for="password">Password</label>
<input type="password" id="password" name="password">
<output for="password">
  Password strength: Strong
</output>
```

## gotchas
- Some screen readers don't reliably announce `<output>` updates yet; add an explicit `role="status"` (`<output role="status">`) until support improves.
- `<output>` is for results tied to user input/actions, not global notifications — use `role="status"`/`role="alert"` on a generic element for toasts instead.
