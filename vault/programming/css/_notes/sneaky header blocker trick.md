---
source: https://www.joshwcomeau.com/css/header-blockers/
fetched: 2026-09-10
published: 2026-03-23
status: fresh
---
A `position: fixed` header stays fully transparent; a `position: sticky` "blocker" element sits behind it at the top of each page section, color-matched to that section's background. Because a sticky element unsticks and scrolls away once it passes the end of its own container, each blocker hands off to the next automatically as the user scrolls — creating the illusion of the header's background changing, with no JavaScript.

## how
```html
<style>
  html {
    --blue: hsl(210deg 80% 85%);
    --header-height: 4rem;
  }
  header {
    position: fixed;
    z-index: 1;
    top: 0;
    height: var(--header-height);
  }
  .blocker {
    position: sticky;
    top: 0;
    height: var(--header-height);
  }
  .hero .blocker { background: var(--blue); }
  .main-content .blocker { background: white; }
</style>

<header>Sticky Header</header>
<div class="hero">
  <div class="blocker"></div>
  <h1>Article Title</h1>
</div>
<main class="main-content">
  <div class="blocker"></div>
  <p>...</p>
</main>
```
Each `.blocker` matches its section's height to the header's height and sits at `top: 0`, parking directly behind the fixed header until its section scrolls past.

## gotchas
- A sticky element unsticks and scrolls out of view once it reaches the end of its parent container — that drives the hand-off, but each section needs at least `--header-height` of empty space above its content for the blocker to rest in when scrolled to the top.
