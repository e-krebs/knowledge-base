---
source: https://www.joshwcomeau.com/react/server-components/
fetched: 2026-09-13
published: 2023-09-06
status: fresh
---
React Server Components let a component run once on the server to produce markup that's sent to the client and never re-rendered there — no client JS, no state, no effects. Reach for them when you want to cut bundle size and skip client-side data-fetching round trips for content that doesn't need to react to user interaction after the first render.

## how
- SSR in two lines: the server renders the initial HTML so the page isn't a blank white screen while JS downloads; the client then hydrates that HTML, re-running the same component code to attach event handlers and effects.
- A Server Component runs once on the server: no state (state changes require a re-render, which Server Components never do) and no effects (effects fire client-side, and Server Component code never reaches the client).
- All components are Server Components by default; add `"use client"` at the top of a file to opt it into being a Client Component.
- Boundary rule: a Client Component can only import other Client Components — anything it imports becomes client code too. But children or props passed *into* a Client Component (rather than imported by it) can stay Server Components, because the parent decides what they render, not the child.
- Compatible environments: RSC needs deep integration with the bundler, server, and router, so it isn't a drop-in React upgrade — check a framework's own RSC support before assuming it works.
- Workaround: pull the stateful piece out into its own small Client Component and pass the rest of the tree in as `children`, so the parent stays a Server Component.

A Server Component's rendered output gets inlined for the client to reuse instead of re-generating it:
```html
<script>
  self.__next['$Homepage-1'] = {
    type: 'p',
    props: null,
    children: "Hello world!",
  };
</script>
```

## gotchas
- Client Components can only import other Client Components — a Server Component imported directly by one becomes a Client Component too.
- Server Components shrink the JS bundle but inline their rendered output into the HTML, so the HTML payload grows even as total bytes usually drop.
