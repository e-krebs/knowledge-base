---
source: https://zeroheight.com/blog/new-html-and-css-features-you-should-be-using-in-your-design-system/
fetched: 2026-10-20
status: fresh
---
Recent native HTML and CSS features that let a design system adapt to context without a build step, JavaScript or extra dependencies. Reach for them when a component should react to its content, scope its styles, or layer on top of the page without z-index fights.

## how
- `sibling-index()` returns an element's position among its siblings, `sibling-count()` the number of siblings including itself. Use the count to scale spacing or heading sizes automatically, instead of hard-coding each case.
- `:has` styles a parent from its children, and with `+` and `~` it selects relationally, e.g. a badge placed differently when it directly follows a heading. Unlike `sibling-count()`, each item count must be handled separately.

```css
div:has(img) {}
ol:has(> li:nth-child(5)) {}
```

- `@custom-media` puts breakpoints behind tokens instead of hard-coded media queries.
- `popover` attribute: give the element an id and `popover`, point a button's `popovertarget` at that id. Popovers sit on the top layer (no z-index battles), `::backdrop` darkens the page, `:popover-open` targets the open state.
- `@scope` bounds a component's styles. The "donut scope" excludes an inner region:

```css
@scope (.card) to (.content) {
  img {
    border-radius: 8px;
  }
}
```

- `text-box-trim` (which edge to trim) with `text-box-edge` (how much) removes the extra space above and below text, replacing negative margin or line-height hacks. Both are Baseline Newly Available and degrade nicely.
- Colors: variables, color spaces, color mixing and inline light/dark theming are all in browsers now (the article defers to an earlier zeroheight post).

## gotchas
- Support is not universal for every feature in the list; most degrade gracefully, but check support before production use.
- `@custom-media` is not yet fully supported; the article suggests a build step such as PostCSS Custom Media in the meantime.
