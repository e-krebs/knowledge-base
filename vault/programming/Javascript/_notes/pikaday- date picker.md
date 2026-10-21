---
source: https://pikaday.dbushell.com/
fetched: 2026-09-11
published: 2025-11-10
status: fresh
---
Despite the URL, this is not the Pikaday library's homepage — it's a guide arguing that a custom JavaScript date-picker widget is rarely the right call, and laying out what to reach for instead: native `date`/`time`/`datetime-local` inputs, separate day/month/year inputs, a masked single text input, or plain `radio`/`datalist` choices for a constrained set of options. Reach for one of these before reaching for a JS calendar widget, especially for a simple or internal form.

## how
- Native `<input type="date">` / `type="time">` / `type="datetime-local">` — one line to implement; the browser handles accessibility, performance, and internationalization for you.
- Separate inputs (e.g. select elements for day/month/year, styled after GOV.UK's date input component) for memorable dates — fewer interactions, no typing errors, but be careful with numeric month labels: screen readers can misread "1" as "the 1st".
- A single masked text input with client-side validation, confirming the final value via the `Intl` API — but updating the input's value with JavaScript can break native undo/redo.
- Two plain inputs, or a `radio` group, instead of a dual-calendar range picker — a range UI spanning two calendars is hard to use without a pointer.
- A plain text input plus a `datalist` for suggestions, when an exact date isn't required; `datalist` also layers onto native `date`/`time` inputs.

## gotchas
- Native date pickers aren't perfect either — they have their own accessibility issues.
- Styling is deliberately limited: the on-page part of a native input can be partially styled, but the popup UI can't — that's by design, since it stays familiar across OS and input method.
