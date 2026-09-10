---
source: https://www.greatfrontend.com/blog/top-css-mistakes-made-by-front-end-engineers
fetched: 2026-09-10
published: 2024-03-05
status: fresh
---
Five recurring CSS mistakes a Senior Frontend Engineer at Pinterest sees repeatedly, each paired with its fix. Most come down to fighting the browser's default responsiveness, or skipping past which "layout mode" a property actually needs. Useful as a pre-ship checklist for a new component, or as review-comment language.

## how

### 1. Using width and height properties incorrectly
HTML is responsive by default; fixed `width`/`height` breaks that by forcing a box to keep an exact size no matter the context — a `width: 900px` element overflows on mobile, and a fixed `height` clips content that grows past it.

```css
/* rebuilt from the article's numbers, which it shows as screenshots */
/* before */
.el { width: 900px; }
.box { height: 250px; }

/* after */
.el { width: 900px; max-width: 100%; }
.box { min-height: 250px; }
```

Fixed sizes stay fine for icons, sticky nav/footer/sidebar, and a group of elements meant to scroll (with `overflow: auto` on the parent).

### 2. Misunderstanding "layout elements" and "content elements"
Content elements (buttons, inputs, paragraphs, cards, links) hold content; layout elements are the invisible wrappers — flexbox, grid, `gap`, margin — that place them. Putting `margin-top` straight on a button mixes those responsibilities; a wrapper `<div>` with `display: flex` and `justify-content: center` should own that spacing instead.

```css
/* the article's own trick for spotting the split: outline everything */
* {
  border: 1px solid red;
}
```

### 3. Choosing between padding, margin, gap incorrectly
`gap` spaces siblings inside a flex/grid container without the parent-knows-about-its-neighbor coupling that per-child margin creates.

```css
/* before: each .tag manages its own spacing */
.tag { margin-left: 8px; }
.tag:first-child { margin-left: 0; }

/* after: the row (a layout element) owns the spacing */
.tagRow {
  display: flex;
  gap: 8px;
}
```

Padding stays on content elements as internal whitespace; margin is still fine on typography (headings, paragraphs), since their spacing varies case by case rather than following a fixed rhythm.

### 4. Not knowing about layout modes
`z-index` only exists in "positioned" layout mode — in the default "flow" mode it does nothing, so the element that comes later in the DOM simply renders on top regardless of `z-index`.

```css
/* before: z-index has no effect in flow mode — .red wins because it's later in the DOM */
.blue { z-index: 5000; background-color: blue; }
.red  { z-index: 4000; background-color: red; margin-top: -100px; }

/* after: position: relative enters positioned mode, so z-index now applies */
.blue { position: relative; z-index: 5000; background-color: blue; }
.red  { position: relative; z-index: 4000; background-color: red; margin-top: -100px; }
```

Same story for `gap` (needs flex or grid mode) and `top`/`left`/`right`/`bottom` (need positioned mode).

### 5. Using only grid or only flex
Grid suits 2-dimensional, page-level layouts; flexbox suits 1-dimensional stacking like nav items. The classic holy-grail header/sidebar/main/footer layout is the canonical grid case:

```css
.parent {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
}
header { grid-column: 1 / 4; }
.left-side { grid-column: 1 / 2; }
main { grid-column: 2 / 3; }
.right-side { grid-column: 3 / 4; }
footer { grid-column: 1 / 4; }
```
