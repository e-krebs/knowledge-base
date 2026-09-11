---
source: https://krassnig.dev/blog/you-might-not-need-a-use-effect-async-hook.html
fetched: 2026-09-11
status: fresh
---
Custom `useAsync`-style hooks break ESLint's `exhaustive-deps` check because it can no longer see inside the hook's dependency array. The `no-async-hook` package's `Async`/`Effect` helpers instead wrap a plain async function so it's called *inside* `useEffect`'s own callback — ESLint verifies deps as normal — while still giving you an `AbortSignal` for cancellation. Reach for it instead of a bespoke async hook whenever you want cancellable async work in an effect without losing lint coverage.

## how
```tsx
useEffect(() => Async(async signal => {
	await delay(1000, signal);
	const person = await findPersonById(personId, signal);
	setName(person.firstName + ' ' + person.lastName);
}), [personId]);
```
`Async` must be called as `() => Async(...)`, not passed directly to `useEffect` — otherwise ESLint can't verify its deps and won't run the promise immediately.

`Effect` is the inverse: it turns a callback-style API into a cancellable promise, for use inside an `Async` block:

```tsx
const delay = (milliseconds: number, signal: AbortSignal): Promise<void> =>
	Effect<void>(resolve => {
		const timeoutId = setTimeout(() => resolve(), milliseconds);
		return () => clearTimeout(timeoutId);
	}, signal);
```

To distinguish a cancellation from a real error, check `signal.aborted` in the `catch` block and rethrow when it's true:

```tsx
try {
	return await anotherAsyncFunction(signal);
} catch (error) {
	if (signal.aborted) throw error; // DO NOT catch cancellations!
	console.error(error);
}
```

## gotchas
- `fetch` and `axios` support `AbortSignal` natively; `XHR` does not (it has its own `abort()` method).
- React 19's `use` hook only covers Suspense-integrated reads, not general cancellable async effects, and the docs' own "ignore flag" pattern skips `AbortController` entirely — so this wrapper remains an undisplaced approach.
