---
source: https://twofoldframework.com/blog/composable-streaming-with-suspense
fetched: 2026-09-11
published: 2025-06-16
status: fresh
---
Wrapping any component in `<Suspense>` streams its content down as soon as it's ready, over a single HTTP connection, regardless of render order — and it composes with libraries that were never designed with streaming in mind. Reach for it to push the async part of a UI (a dropdown's options, a list of comments) down to just the slice that actually depends on data, so the rest stays interactive immediately instead of waiting on the whole component.

## how
```jsx
// Suspense wraps only the async options, not the whole Listbox
function ChatBox() {
  return (
    <form>
      <textarea defaultValue="Chat with your favorite AI model..." />
      <ModelsListbox>
        <Suspense fallback={<span>Loading models...</span>}>
          <CurrentUsersOptions />
        </Suspense>
      </ModelsListbox>
    </form>
  );
}

async function CurrentUsersOptions() {
  const currentUser = await getCurrentUser();
  const models = await getModelsForUser(currentUser);
  return <ModelsOptions models={models} />;
}
```
`<ModelsListbox>` (a "use client" component) just renders `<Listbox>` with `{children}` inside `<ListboxOptions>`, and `<ModelsOptions>` maps `models` to `<ListboxOption>`s — neither needed to know about Suspense.

## gotchas
- moving `<Suspense>` down to just the async slice keeps the parent (the chat box, submittable with a default model) interactive while that slice loads, instead of blocking on it
- the library being wrapped (Headless UI's `<Listbox>` here) needs no streaming-awareness of its own — composability is what makes this work
