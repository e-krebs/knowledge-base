---
source: https://piccalil.li/blog/a-primer-on-the-cascade-and-specificity/
fetched: 2026-09-11
published: 2024-04-18
status: stale
---
The cascade decides which of several conflicting rules applies to an element, first by declaration type and origin, then — within the same weight — by specificity score. Reach for this whenever dev tools show a style crossed out and you need to know why a different rule won.

## how
Order of importance (least to most specific): normal declarations → active `@keyframes` animations → `!important` declarations.

Order of origin (least to most specific): user-agent base styles → local user styles → authored CSS → authored `!important` → local user styles with `!important` → user-agent `!important`.

Specificity score format is `hundreds-tens-singles` (plus an extra digit each for inline styles and `!important`):

```css
*                 /* 0-0-0 —     0 points */
h1                /* 0-0-1 —     1 point  */
::before          /* 0-0-1 —     1 point  */
.my-element       /* 0-1-0 —    10 points */
:hover            /* 0-1-0 —    10 points */
[href]            /* 0-1-0 —    10 points */
#myElement        /* 1-0-0 —   100 points */
/* style="..." */ /* 1-0-0-0 — 1,000 points */
/* !important  */ /* 1-0-0-0-0 — 10,000 points */
```

`:is()` and `:not()` take the specificity of their most specific argument — they're not a way to boost score. `:where()`, and anything nested inside it, contributes zero specificity, which is why reset stylesheets wrap selectors in it to stay easy to override. Child/sibling combinators (`>`, `~`, `+`) add no specificity of their own.

## gotchas
- `!important` is both a cascade-order and a specificity concern — don't treat it as purely one or the other.
- CSS Cascade Level 6's `@scope` "scoping proximity" reached Baseline newly available in January 2026 (Firefox 146) — it inserts a tiebreaker between specificity and source order for `@scope`-limited rules, which this cascade-order list predates and doesn't cover.
