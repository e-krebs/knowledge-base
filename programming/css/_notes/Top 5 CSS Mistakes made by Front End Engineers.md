---
source: https://www.greatfrontend.com/blog/top-css-mistakes-made-by-front-end-engineers
fetched: 2026-09-10
published: 2024-03-05
status: fresh
---
Five recurring CSS mistakes and their fixes: forcing fixed dimensions, blurring layout vs content elements, misusing padding/margin/gap, forgetting which layout mode a property needs, and reaching for only grid or only flex. Useful as a quick self-check before shipping a component.

## how
- **Fixed width/height.**
  - Fixed dimensions force elements to keep a specific size regardless of context — a `width: 900px` element overflows a mobile screen.
  - Fix: pair `width` with `max-width: 100%`, and swap `height` for `min-height` so the box can still grow with its content.
  - Keep true fixed sizes only for icons, sticky nav/footer/sidebar, and scrollable element groups.
- **Layout vs content elements.**
  - Content elements (buttons, inputs, paragraphs, cards, links) hold content.
  - Layout elements are invisible wrappers (flexbox, grid, `gap`, margin) that position content elements.
  - Don't put `margin-top` on a button directly — let the parent layout element manage the spacing instead.
- **padding / margin / gap.**
  - Use `gap` to space siblings inside a flex or grid container.
  - Use `padding` for internal whitespace on content elements.
  - Reserve `margin` mainly for typography (headings, paragraphs); otherwise wrap content in a layout container rather than margining it directly.
- **Layout modes.**
  - `z-index` does nothing in the default "flow" layout — it only applies once an element is "positioned" (`position: relative/absolute/fixed/sticky`).
  - `gap` needs flex or grid mode; `top`/`left`/`right`/`bottom` need positioned mode.
  - Knowing which properties need which mode saves debugging time.
- **Grid vs flex.**
  - CSS Grid handles 2-dimensional, page-level layouts well (e.g. a holy-grail header/sidebar/main/footer).
  - Flexbox suits 1-dimensional stacking, like nav items or inline arrangements.
