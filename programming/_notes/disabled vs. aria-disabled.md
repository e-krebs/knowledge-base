---
source: https://kittygiraudel.com/2024/03/29/on-disabled-and-aria-disabled-attributes/
fetched: 2026-09-13
published: 2024-03-29
status: fresh
---
`disabled` and `aria-disabled` both mark a control as disabled, but they diverge on what happens to focusability, operability, and form submission. Pick between them based on whether the control's discoverability and interactivity still matter for the task at hand, not on a blanket "disabled bad, aria-disabled good" rule.

## how
- `disabled`: unfocusable, unmodifiable, excluded from constraint validation, not sent with the form. Most user agents also grey it out visually.
- `aria-disabled`: conveys disabled semantics to assistive tech only. Focusability, operability, and form submission are unchanged.
- Use `disabled` when a field becomes genuinely irrelevant based on other fields' values: it can be safely omitted from discovery, doesn't need to be tabbed to, and shouldn't be sent with the form because it's moot.
- Use `aria-disabled="true"` when the control must stay reachable and interactive even though it isn't ready to act yet — the canonical case is a submit button before the form is complete. It remains focusable and tabbable, and can still be used to trigger form validation, which is exactly what you want instead of a silently unreachable button.
- Neither attribute "optimizes" for DX vs UX as a blanket rule; both are meaningful attributes with their own tradeoffs, and knowing which fits a given control is part of the job.

## gotchas
- `pointer-events: none` disables click events only — the element can still be tabbed to, focused, and interacted with via keyboard, so it doesn't make a control unreachable the way `disabled` does. Keep the keyboard experience in mind whenever you reach for it.
