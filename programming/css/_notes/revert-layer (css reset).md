---
source: https://www.mayank.co/blog/revert-layer
fetched: 2026-09-11
published: 2024-01-30
status: fresh
---
`revert-layer` reverts a property to whatever it was in the previous cascade layer (or the previous origin, if there is no previous layer), unlike `revert` which jumps straight to user-agent styles and loses useful presentational defaults (`draggable`, `contenteditable`, SVG/image attributes). Reach for it whenever you need to scope, version, or selectively undo styles built with `@layer` without fighting specificity.

## how
Isolate a subtree from document styles (better encapsulation than shadow DOM for inherited typographic properties too):

```css
my-demo {
  &, * {
    all: revert-layer;
  }
}
```

Selectively bring back a reset property for one context, e.g. list styles inside prose content:

```css
.prose :is(ul, ol) {
  @layer reset {
    list-style: revert-layer;
  }
}
```

Give a custom property a fallback that behaves as if it was never set, instead of throwing away a lower layer's declaration:

```css
width: var(--size, revert-layer);
height: var(--size, revert-layer);
fill: var(--fill, revert-layer);
```

## gotchas
- `revert-layer !important` is not a substitute for raising specificity when versioning styles by layer — it also blocks any subsequent layer's styles from applying.
- If you stack multiple layers, each one needs its own `revert-layer` to fully undo — reverting only the top layer leaves the ones below it in effect.
