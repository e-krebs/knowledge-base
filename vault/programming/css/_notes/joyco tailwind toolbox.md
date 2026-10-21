---
source: https://hub.joyco.studio/toolbox/tailwind
fetched: 2026-09-13
status: fresh
---
A grab bag of small Tailwind v4 snippets from joyco's toolbox: a combined hover/focus variant, per-font-size line-height config, an ancestor-state variant, pointer-type variants, and a custom `slot-*` variant plugin for targeting children by `data-slot`. Pull individual snippets in as needed rather than treating this as one cohesive technique.

## how
### Hover + focus variant
Combines `hover` and `focus-visible` into one variant, called `hocus`, for elements that should style the same way on either.

```css
@custom-variant hocus (&:is(:hover, :focus-visible));
```

### Set line-height per font size
Attach line-height, letter-spacing and font-weight to a custom font-size step.

```css
@theme {
  --text-tiny: 0.625rem;
  --text-tiny--line-height: 1.5rem;
  --text-tiny--letter-spacing: 0.125rem;
  --text-tiny--font-weight: 500;
}
```

### Ancestor state styling
`in-*` styles an element based on an ancestor's state or class — useful for drawer overlays or conditional layouts.

```html
<div class="in-[.notifs-drawer-open]:opacity-100">
```

### Detect pointer type (mouse vs touch)
Uses the `pointer` media feature to style elements based on whether the input is a fine pointer (mouse) or coarse pointer (touch).

```css
@variant has-mouse {
  @media (pointer: fine) {
    @slot;
  }
}

@variant has-touch-screen {
  @media (pointer: coarse) {
    @slot;
  }
}
```

```html
<input type="checkbox" class="has-mouse:size-4 has-touch-screen:size-8" />
```

### Slot variant (data-slot targeting)
A `matchVariant`-based `slot-*` variant that targets children by their `data-slot` attribute, so a parent class can style slotted children without nested selectors.

```ts
import type { PluginAPI } from "tailwindcss/plugin"

export default function ({ matchVariant }: PluginAPI) {
  matchVariant("slot", (value: string) => `& [data-slot="${value}"]`)
}
```

Load it via `@plugin` in your CSS, then use it from the parent:

```css
@plugin "./styles/slot-variant.ts";
```

```html
<button class="slot-[icon]:size-4 slot-[label]:font-medium">
  <svg data-slot="icon" />
  <span data-slot="label">Click me</span>
</button>
```
