---
source: https://www.epicreact.dev/use-react-view-transition-to-smoothly-transition-images-and-titles-lu6ks
fetched: 2026-09-11
status: fresh
---
React's `<ViewTransition>` component wraps the platform View Transition API: give two elements on different pages/screens the same `name` prop and React animates between them automatically instead of jumping. Reach for it when a shared element (a poster image, a title) should visually persist across a navigation, and you're already navigating inside `startTransition` (most routers do this for you).

## how
```jsx
{/* List card */}
<ViewTransition name={`movie-poster-${movie.id}`}>
  <img
    src={movie.poster}
    alt={`${movie.title} poster`}
    className="mb-4 h-64 w-full rounded-lg object-cover"
  />
</ViewTransition>

{/* Details page — same name */}
<ViewTransition name={`movie-poster-${movie.id}`}>
  <img
    src={movie.poster}
    alt={`${movie.title} poster`}
    className="h-96 w-full rounded-lg object-cover"
  />
</ViewTransition>
```
Titles can transition the same way with their own shared name (`movie-title-${movie.id}`). By default this cross-fades; customize with the platform's view-transition pseudo-elements:
```css
::view-transition-old(movie-poster-1) {
  animation-duration: 500ms;
}
::view-transition-new(movie-poster-1) {
  animation-duration: 500ms;
}
```

## gotchas
- Each `name` must be unique across the whole app at any given moment — two simultaneously mounted elements with the same name throw.
- Only activates inside a `startTransition` call; most routers wrap navigation in one automatically, but manual navigation needs it explicit.
- The component must wrap DOM nodes directly and can't be placed after other elements within the same parent.
- Went stable in React 19.3 (shipped September 9, 2026); the name-matching API described here is unchanged from the Canary version — per freshness evidence.
