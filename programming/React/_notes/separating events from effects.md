---
source: https://react.dev/learn/separating-events-from-effects
fetched: 2026-09-11
status: fresh
---
Deciding whether logic belongs in an event handler or an Effect, and how to keep an Effect reactive to only the values it should react to. Event handlers run only in response to a specific interaction and don't need to declare dependencies; Effects re-run whenever a prop or state value they read changes. Reach for `useEffectEvent` when part of an Effect's logic (reading the latest theme, item count, or a prop callback) must stay non-reactive while the rest of the Effect still needs to resynchronize.

## how
```js
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
}
```
`onConnected` always reads the latest `theme` without `theme` needing to be a dependency, so the chat only reconnects when `roomId` changes, not when the theme toggles.

## gotchas
- Only call Effect Events from inside Effects.
- Never pass an Effect Event to another component or Hook — declare it directly next to the Effect that uses it.
- Never suppress the dependency linter as a substitute for an Effect Event; suppressing it hides real stale-value bugs.
- `useEffectEvent` is stable since React 19.2 (per live freshness check) — the live react.dev page already uses the un-prefixed import shown above.
