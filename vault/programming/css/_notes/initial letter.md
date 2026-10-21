---
source: https://blog.stephaniestimac.com/posts/2023/1/css-initial-letter/
fetched: 2026-09-10
published: 2023-01-12
status: fresh
---
`initial-letter` sizes and positions a `::first-letter` drop cap in terms of line height, replacing markup hacks like wrapping the letter in its own `div`. Reach for it when you want a drop cap that scales cleanly with the surrounding text instead of a hand-tuned `font-size` override — it produces better alignment than sizing the letter with something like `font-size: 2lh`.

## how
```css
p::first-letter {
  initial-letter: 3;
}
```

The number sets how many lines tall the letter renders. An optional second value tunes its vertical positioning:

```css
p::first-letter {
  initial-letter: 3 4;
}
```

A fuller example:

```css
initial-letter: 4 6;
padding: 2.2rem 2.6rem;
font-weight: 900;
margin-right: .5rem;
```

## gotchas
- Outlines don't render on an element styled with `initial-letter`; `text-shadow` is a workaround.
- `initial-letter-align`, `initial-letter-wrap`, multi-character initial letters, and certain inline-box positioning aren't implemented yet.
- Support (confirmed current as of 2026): Chrome and Safari implement it (Safari incompletely); Firefox still ships it only experimentally, behind a flag.
