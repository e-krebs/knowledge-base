---
source: https://polypane.app/blog/offset-parent-and-stacking-context-positioning-elements-in-all-three-dimensions/
fetched: 2026-09-11
published: 2023-07-06
status: fresh
---
The *offset parent* determines where an absolutely/relatively positioned element's `top`/`right`/`bottom`/`left` are measured from, while a *stacking context* determines how `z-index` values compete on the depth (z) axis. Reach for these concepts whenever `position: absolute` lands in the wrong spot, or `z-index` "doesn't work" — the fix is almost always to check what the offset parent or containing stacking context actually is.

## how
The offset parent is the nearest ancestor with a `position` other than `static` (or `body` if none). Give that ancestor positioning to anchor a child to it instead of the page:

```css
.parent { position: relative; } /* now the offset parent */

.parent span {
  position: absolute;
  top: 0;
  left: 0;
}
```
Find it in JS with `element.offsetParent`.

Stacking contexts default to the `html` element, and `z-index` only competes against siblings *within the same* stacking context — a low z-index in a high-z-index context still beats a high z-index in a low-z-index context. Any of these properties creates a new stacking context on an element:

- `position: fixed` or `sticky`
- `z-index` other than `auto` (with `position` set, or in flex/grid)
- `opacity` less than 1
- `mix-blend-mode` other than `normal`
- `filter`, `backdrop-filter`, `transform`, `perspective`, `clip-path`, `mask`/`mask-image`/`mask-box-image` other than `none`
- `isolation: isolate`
- `container-type: size` or `inline-size`
- `will-change` set to any of the above properties
- `contain: layout | paint | strict | content`

To scope a `z-index` change without it escaping into an ancestor's stacking context, isolate the wrapper explicitly:

```css
.parent { isolation: isolate; } /* new stacking context */
.parent span { z-index: -1; }   /* only drops behind siblings inside .parent */
```

## gotchas
- There's no JS equivalent of `offsetParent` for finding the stacking-context parent — you have to walk ancestors checking for the trigger properties above.
