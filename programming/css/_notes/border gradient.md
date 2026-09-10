---
source: https://twitter.com/jonathan_wilke/status/1610524049758724097
fetched: 2026-09-10
published: 2023-01-04
status: stale
---
A gradient border from two stacked elements: the outer one carries the gradient as its background and a small padding, the inner one carries a solid background, so only the padding ring shows the gradient. Reach for it when `border-image` is more than you want and the card has a solid background anyway.

## how
```html
<!-- outer div which has the gradient as background -->
<div class="relative mx-auto max-w-md rounded-lg bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg">
  <!-- inner div for the content -->
  <div class="bg-white p-7 rounded-md">
    <h1 class="font-bold text-xl mb-2">Border gradient example</h1>
    <p>Create beautiful cards with gradient borders with Tailwind CSS.</p>
  </div>
</div>
```
The outer `p-0.5` is the border width, and the inner radius is one step smaller than the outer so the corners stay concentric.

## gotchas
- `background-clip: border-area` does this natively with one element, but in September 2026 it ships in Chrome 150+ and WebKit only, not Firefox.
- The tweet's code lives in a Tailwind Play link, [play.tailwindcss.com/J9JVuWfuFc](https://play.tailwindcss.com/J9JVuWfuFc); the snippet above is copied from it.
