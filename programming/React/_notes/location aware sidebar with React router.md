---
source: https://fireship.dev/react-router-sidebar-breadcrumbs
fetched: 2026-09-11
status: fresh
---
Render two sibling `<Routes>` trees keyed off the same `path`s — one for the main body, one for the sidebar — so unrelated parts of the page can independently swap content based on the current location. Reach for it when a sidebar, breadcrumb, or other secondary UI needs route-specific text without threading that logic through the main route's component tree.

## how
```jsx
const routes = [
  { path: "/", main: () => <Home />, sidebar: () => <p>Home page...</p> },
  { path: "/profile", main: () => <Profile />, sidebar: () => <p>Profile page...</p> },
  { path: "/settings", main: () => <Settings />, sidebar: () => <p>Settings page...</p> },
];

export default function App() {
  return (
    <div className="wrapper">
      <div className="sidebar">
        <Routes>
          {routes.map(({ path, sidebar }) => (
            <Route key={path} path={path} element={sidebar()} />
          ))}
        </Routes>
      </div>
      <Routes>
        {routes.map(({ path, main }) => (
          <Route key={path} path={path} element={main()} />
        ))}
      </Routes>
    </div>
  );
}
```
A `<Routes>` component can be rendered anywhere, as many times as needed — each instance independently matches its own `<Route>` children against the current location.

## gotchas
- targets React Router v6 explicitly; check your version before applying this
- nested layout routes with `<Outlet/>` are the documented alternative since React Router v6, carried into the current v7 (per freshness evidence)
