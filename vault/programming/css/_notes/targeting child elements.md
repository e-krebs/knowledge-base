---
source: https://cekrem.github.io/posts/tailwind-targeting-child-elements/
fetched: 2026-09-13
published: 2025-12-11
status: fresh
---
Tailwind's arbitrary variants let you write any CSS selector in bracket notation after `&`, so you can style elements you don't control — CMS content, third-party components, dynamically generated HTML — without leaving the utility-class paradigm. Reach for this when a full stylesheet feels like overkill for one or two rules, or you want the styling colocated with the component that renders the content; for anything beyond that, a small vanilla CSS stylesheet is usually simpler and more maintainable.

## how
`&` represents the current element; everything after it is a standard CSS selector, with `_` standing in for a space (descendant) and `>` for a direct child:

```html
<!-- direct children -->
<div class="[&>div]:border [&>div]:p-4">...</div>
<div class="[&>*:first-child]:mt-0">...</div>
<div class="[&>*:last-child]:border-b-0">...</div>

<!-- all descendants -->
<div class="[&_a]:no-underline [&_a:hover]:underline">...</div>
<div class="[&_li]:list-disc [&_li]:ml-6">...</div>
<div class="[&_img]:rounded-lg">...</div>

<!-- pseudo-states on children -->
<div class="[&>button:hover]:bg-blue-600">...</div>
<form class="[&_input:disabled]:bg-gray-100 [&_input:disabled]:cursor-not-allowed">...</form>
```

`[&_a]:font-semibold` compiles to:

```css
.\[\&_a\]\:font-semibold a {
  font-weight: 600;
}
```

## gotchas
- Tailwind v4's `*:` and `**:` variants cover the uniform all-children case, not tag-specific selectors — they don't replace `[&_a]`/`[&_li]`-style selectors for targeting one element type.
