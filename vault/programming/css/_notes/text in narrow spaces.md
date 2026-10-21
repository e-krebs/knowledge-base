---
source: https://shrutibalasa.substack.com/p/this-css-property-helps-you-display?utm_medium=email
fetched: 2026-09-10
published: 2023-01-25
status: fresh
---
Long unbroken words in narrow columns or blocks leave ragged whitespace on the right edge of wrapped lines. `hyphens: auto` lets the browser insert hyphenation points automatically to close that gap. Reach for it on constrained-width text where the default word-wrapping looks uneven.

## how
```css
hyphens: auto
```

Applied to a narrow text block, this automatically splits long words — e.g. "disapprovingly" becomes "disapprov-ingly" — across lines with a hyphen instead of leaving the whole word on one line, producing more balanced text distribution.

## gotchas
- Not universally appropriate — whether to use it depends on the specific design context.
