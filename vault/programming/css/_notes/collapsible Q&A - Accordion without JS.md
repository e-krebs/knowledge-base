---
source: https://shrutibalasa.substack.com/p/collapsible-q-and-as-with-pure-html
fetched: 2026-09-10
published: 2023-05-17
status: fresh
---
Native `<details>`/`<summary>` builds a collapsible FAQ or accordion with no JavaScript: the browser handles the open/closed toggle, and the `[open]` attribute plus `::-webkit-details-marker` give full control over the styling. Reach for it whenever a collapsible section doesn't need scripted behavior beyond expand/collapse.

## how
```html
<details>
  <summary>
    Is there a trial period for your product?
  </summary>
  Yes, we offer a 14-day free trial period so you can experience the product's benefits first-hand.
</details>
```
Style the open state, drop the default marker, and swap in a custom icon that flips on open:
```css
details[open] {
  background-color: #f1f5ff;
}
details[open] > summary {
  font-size: 1.2rem;
}
summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
}
summary::-webkit-details-marker {
  display: none;
}
details[open] > summary > span {
  transform: rotate(180deg);
}
```
```html
<summary>
  <p>Is there a trial period for your product?</p>
  <span><i class="fa fa-chevron-down"></i></span>
</summary>
```
