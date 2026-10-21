---
source: https://moderncss.dev/how-custom-property-values-are-computed/
fetched: 2026-09-11
published: 2024-07-19
status: fresh
---
Custom properties are checked for syntactic validity at parse time, but whether their value actually works for the property it's assigned to is only resolved later, at "computed value time" (CVT) — by then the cascade has already discarded other candidate values. Know this before relying on a custom property's fallback behavior in cutting-edge CSS, or debugging why a value that "looks right" isn't applying.

## how
An invalid value at CVT doesn't fall back to a previously cascaded value — it falls back to the inherited or initial value instead, because those candidates were already thrown out:

```css
html { color: red; }
p { color: blue; }
.card { --color: #notacolor; }
.card p { color: var(--color); }
```

`.card p` renders `red` (inherited), not `blue` — the cascaded `blue` was discarded once `var(--color)` was accepted as syntactically valid.

The same trap hits feature fallbacks. A `var()` fallback for an unsupported unit doesn't rescue the property's prior declaration:

```css
h2 {
  font-size: clamp(1.25rem, var(--h2-fluid, 1rem + 1.5vw), 2.5rem);
  font-size: clamp(1.25rem, var(--h2-fluid, 5cqi), 2.5rem);
}
```

In a browser without `cqi` support, the second declaration wins the cascade, then fails at CVT and falls back to `font-size`'s *initial* value (`medium`, ~1rem) — not the first declaration. Wrap the modern declaration in `@supports` instead so unsupporting browsers never see it:

```css
@supports (font-size: 1cqi) {
  h2 {
    font-size: clamp(1.25rem, var(--h2-fluid, 5cqi), 2.5rem);
  }
}
```

`@property` is the other fix: it lets a custom property define its own `initial-value`, used when the computed value is invalid, instead of the property's generic initial value.

## gotchas
- A custom property's computed value is calculated once per element and only inherits downward — a descendant reassigning a `:root`-level variable it depends on cannot retroactively change an already-computed calculation.
- Browser devtools can misleadingly still show the failing (unsupported) rule as "applied" in an unsupporting browser, making CVT failures hard to spot by inspection alone.
- `@property` has been Baseline newly available since July 2024, exactly as the post states.
