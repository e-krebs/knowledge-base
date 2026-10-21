---
source: https://www.amitmerchant.com/two-ways-to-safely-break-a-long-word-in-html/
fetched: 2026-09-13
published: 2023-01-19
status: fresh
---
When a long word doesn't fit its container, it overflows and breaks the layout. Two native HTML markers tell the browser where it is allowed to break the word: the `<wbr>` tag and the `&shy;` entity. Either only triggers a break at the marked point that actually overflows, not at every marked point in the word. Reach for `<wbr>` for a clean break with no extra character, and `&shy;` when you also want a hyphen to appear at the break.

## how
```html
<!-- <wbr>: break with no extra character -->
<p>super<wbr>califragilistic<wbr>expialidocious</p>

<!-- &shy;: break with a visible hyphen -->
<p>super&shy;califragilistic&shy;expialidocious</p>
```

## gotchas
- the browser breaks only where the word actually overflows, not at every `<wbr>`/`&shy;` mark
- `&shy;` renders a hyphen (`-`) at the break; `<wbr>` does not
- no native alternative has replaced either mechanism; both remain the current recommended way to mark a soft break point
