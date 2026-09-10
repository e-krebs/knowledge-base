---
source: https://modernwebweekly.substack.com/p/modern-web-weekly-52
fetched: 2026-09-10
status: fresh
---
When a view transition moves an item between lists, the moved item can slide behind its neighbours. The fix is a higher `z-index` on the moved item, but `z-index` does nothing on an element with `position: static` unless that element is a flex or grid item. Reach for `display: flex` or `display: grid` on the parent whenever a view transition needs to reorder stacking.

## how
Add a class with a `z-index` for the duration of the transition:
```js
li.classList.add('active');

const transition = document.startViewTransition(move);
await transition.finished;

li.classList.remove('active');
```
With a plain `<li>` (`position: static`) the `z-index` has no effect. Flex and grid items create a stacking context when given a `z-index` other than `auto`, even at `position: static`, so set `display: flex; flex-direction: column` on the parent `<ul>` to keep the vertical list and make the `z-index` apply.

The behaviour is in the [Flexbox spec](https://www.w3.org/TR/css-flexbox-1/#painting) and the [Grid spec](https://www.w3.org/TR/css-grid-1/#z-order), and the [codepen demo](https://codepen.io/dannymoerkerke/pen/ExMEPaW) shows it.

## gotchas
- A `z-index` fix that "always worked" was working because the element happened to be a flex item; on a block element it silently does nothing.
