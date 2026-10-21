---
source: https://nerdy.dev/css-mixins-ready-for-experimentation
fetched: 2026-09-11
published: 2025-03-26
status: fresh
---
CSS `@mixin` lets you define a named, reusable chunk of style declarations and apply it to a rule with `@apply` — distinct from `@function`, which returns a single value. Reach for a mixin when you want to package multiple declarations (not just one value) for reuse across rules.

## how
```css
@mixin --box {
  aspect-ratio: 1;
  inline-size: 100px;
  block-size: 100px;
}
```
Using it:
```css
.box {
  @apply --box;
}
```

## gotchas
- Experimental as of March 26, 2025: requires Chrome Canary, launched from the command line with the `CSSMixins` flag: `open -a "Google Chrome Canary" --args --enable-features=CSSMixins`.
