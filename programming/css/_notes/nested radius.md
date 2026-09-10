---
source: https://twitter.com/aleksliving/status/1687889580555407361
fetched: 2026-09-10
published: 2023-08-05
status: fresh
---
Nested rounded boxes look off when both use the same `border-radius`: the outer corner then looks tighter than the inner one. Set the outer radius to the inner radius plus the padding between them, and the two curves stay concentric.

## how
The tweet's image compares `outer r = inner r` (20px and 20px, 8px padding, wrong) with `outer r = inner r + padding` (28px and 20px, right):
```css
.outer {
  padding: 8px;
  border-radius: calc(20px + 8px); /* inner radius + padding */
}
.inner {
  border-radius: 20px;
}
```

## gotchas
- The rule lives in an image on the tweet; the snippet above is written from its numbers. [[then math behind]] has the derivation.
