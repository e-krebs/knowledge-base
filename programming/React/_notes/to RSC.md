---
source: https://www.mux.com/blog/what-are-react-server-components
fetched: 2026-09-13
published: 2023-07-19
status: fresh
---
React Server Components let you mark which components run only on the server and which ship to the client, cutting bundle size and letting components fetch their own data directly instead of drilling props down from a page-level loader. Reach for the incremental path below when moving an existing app onto RSC without rewriting it all at once.

## how
Migration path, as the source frames it:
1. Add `"use client"` at the root of the app — this converts everything to Client Components, so the app just works like a normal SSR app while you migrate.
2. Move the directive as low in the tree as you can; drop it entirely from components that don't need client-side interactivity.
3. Adopt advanced patterns once real performance issues show up — mixing Client and Server Components, wrapping slow Server Components in `Suspense`.

```jsx
"use client"

export default function App() {
  <>
    <Player />
    <Title />
  </>
}
```

Mixing pattern: a Client Component can only import other Client Components (anything it imports becomes client code too), so pass a Server Component in as `children` or a prop instead of importing it:
```jsx
function ServerComponentA() {
  return (
    <ClientComponent>
      <ServerComponentB />
    </ClientComponent>
  )
}
```

You can't make half a file a Server Component and half a Client Component — split into two files instead (a `.server.js` file imports a `.client.js` file and passes pre-rendered content down as props).

Check: import the `server-only` package into a file — it errors at build time if that module ever ends up in the client bundle, which is the reliable way to confirm code stays server-side.

## gotchas
- React Context doesn't work in Server Components — share data across a static subtree with plain modules or CSS custom properties instead.
- The article calls CSS-in-JS a nonstarter; styled-components 6.3 (January 2026) supports RSC, so check the library first.
- RSC is no longer Next.js only: React Router, TanStack Start and Waku ship it too.
