---
source: https://barvian.me/react-exit-animations
fetched: 2026-09-11
published: 2026-02-05
status: stale
---
Exit animations often look distracting because the state update that closes/removes a component also changes its contents mid-animation. `Suspense` already renders a suspended subtree without committing DOM changes, so wrapping the exiting content in a small `Freeze` component (a `Suspense` that un-hides the browser's forced `display: none`) freezes it visually while it animates out. Reach for this when a component's exit animation flickers or updates content it's mid-way through animating away.

## how
```tsx
export function Freeze({ frozen, children }: { frozen: boolean; children: React.ReactNode }) {
	const elementsRef = React.useRef(new Set<HTMLElement>())
	const fragmentRef: React.RefCallback<React.FragmentInstance> = (frag) => {
		if (!frag) return
		const observer = new ElementsObserver(elementsRef)
		frag.observeUsing(observer)
		return () => frag?.unobserveUsing(observer)
	}
	// An insertion effect is the earliest opportunity to undo Suspense's `display: none`
	React.useInsertionEffect(() => {
		if (!frozen) return
		elementsRef.current.forEach((element) => { element.style.display = '' })
	}, [frozen])

	return (
		<React.Fragment ref={fragmentRef}>
			<React.Suspense>
				{frozen && <Suspend />}
				{children}
			</React.Suspense>
		</React.Fragment>
	)
}
const infinitePromise = new Promise<never>(() => {})
function Suspend() {
	React.use(infinitePromise)
	return null
}
```
Usage: `<Freeze frozen={isExiting}>{children}</Freeze>` around the content that should stop updating during its exit animation.

## gotchas
- Wipes any inline `display` style the element had before it was frozen.
- It's a trick, not an API guarantee — could break in a future React version; tested on React 18 & 19.2.
- Successor emerging: React 19.2 (stable) shipped the `Activity` component, and Motion built `AnimateActivity` on top of it as a more official exit-animation solution — but `AnimateActivity` is still Motion+ early access and `Activity` alone doesn't replace the Suspense-freeze mechanics, so this manual trick still works for now.
