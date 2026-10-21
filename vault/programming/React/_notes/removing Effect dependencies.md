---
source: https://react.dev/learn/removing-effect-dependencies
fetched: 2026-09-11
status: fresh
---
A checklist for trimming an Effect's dependency array without lying to the linter: each question below finds the real code change that removes a dependency, instead of suppressing `react-hooks/exhaustive-deps`. Reach for it whenever an Effect re-runs more often than it should.

## how
### Should this code move to an event handler?
Logic tied to one interaction (e.g. POST + notification on form submit) doesn't belong in an Effect at all. Put it in the event handler so it stops needing to "react" to unrelated state like `theme`.

### Is the Effect doing several unrelated things?
An Effect that fetches `cities` for a `country` and also `areas` for a `city` re-fetches cities every time the city changes. Split it into two Effects, each with its own dependency list, so the two synchronizations don't trigger each other.

### Are you reading state to calculate the next state?
Replace `setMessages([...messages, receivedMessage])` with the updater form `setMessages(msgs => [...msgs, receivedMessage])`. The Effect no longer reads `messages`, so it doesn't need it as a dependency.

### Do you want to read a value without reacting to it?
Wrap the non-reactive read (`isMuted`, or an `onReceiveMessage` prop) in `useEffectEvent`. The Effect keeps `roomId` as its only dependency and won't resynchronize just because the wrapped value changed.

### Does a reactive value change unintentionally?
Objects and functions are a new reference on every render, so an `options` object declared in the component body forces the Effect to reconnect on every unrelated re-render. Move static objects/functions outside the component, build dynamic ones inside the Effect, or read primitive fields (`options.roomId`, `options.serverUrl`) outside the Effect and depend on those instead.

## gotchas
- Never suppress the dependency linter — a stale closure (like an `onTick` that always sees the render's original `count`) is the kind of bug it exists to catch.
- You don't choose an Effect's dependencies; the list describes what the code reads. To change the list, change the code first.
