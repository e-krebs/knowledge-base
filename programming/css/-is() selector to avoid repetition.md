---
source: https://shrutibalasa.substack.com/p/have-you-used-the-is-selector-to
fetched: 2026-09-10
published: 2023-05-03
status: fresh
---
The `:is()` selector takes a comma-separated list of selectors and matches any element that satisfies at least one of them, letting you collapse long repetitive selector lists into one compact rule. Reach for it when the same style targets several tag combinations across several containers, such as headings and lists inside both a main area and a sidebar.

## how
Before, every combination is spelled out:
```css
main h1,
main h2,
main h3,
main ul,
main ol,
aside h1,
aside h2,
aside h3,
aside ul,
aside ol {
  text-transform: uppercase;
  color: #65b;
}
```
After, nesting two `:is()` groups covers the same elements:
```css
:is(main, aside) :is(h1, h2, h3, ul, ol) {
  text-transform: uppercase;
  color: #65b;
}
```
