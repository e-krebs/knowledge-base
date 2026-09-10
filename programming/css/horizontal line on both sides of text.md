---
source: https://shrutibalasa.substack.com/p/css-simplified-issue-24-23-01-05
fetched: 2026-09-10
published: 2023-01-12
status: fresh
---
Flanking a heading with a horizontal rule on each side is usually done with extra markup or a background-image trick. This technique uses only `::before`/`::after` pseudo-elements inside a flex container, so it adds no DOM elements, stays responsive, and works against any background color.

## how
```html
<h2>Your Heading Text</h2>
```

```css
h2 {
  display: flex;
  align-items: center;
}

h2::before,
h2::after {
  content: '';
  flex: 1;
  border-top: 1px solid;
  margin: 0 10px;
}
```

`display: flex` plus `align-items: center` lines everything up horizontally and vertically; `flex: 1` on both pseudo-elements makes the two lines expand equally to fill the remaining space; the margins add breathing room between text and lines.
