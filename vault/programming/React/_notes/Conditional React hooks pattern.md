---
source: https://robinmalfait.com/blog/conditional-react-hooks-pattern
fetched: 2026-09-11
published: 2024-06-02
status: fresh
---
Hooks can't be called conditionally, but a hook can take an `enabled` boolean and check it first thing inside its own effect body — so the effect's setup (an event listener, a scroll lock) never runs at all when the feature is disabled, instead of running and immediately no-oping. Reach for it whenever a hook's side effect should only be active while a component is in a given state, like a `<Dialog/>` being open.

## how
```ts
function useOutsideClick(
  enabled: boolean,
  elementRef: React.MutableRefObject<HTMLElement | null>,
  cb: () => void,
) {
  useEffect(() => {
    if (!enabled) return
    let element = elementRef.current
    if (!element) return
    function handle(e: MouseEvent) {
      if (!element.contains(e.target)) cb()
    }
    document.addEventListener('click', handle)
    return () => document.removeEventListener('click', handle)
  }, [enabled, elementRef, cb])
}
function useScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    let previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = previous }
  }, [enabled])
}

function Dialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  let elementRef = useRef<HTMLElement | null>(null)
  useOutsideClick(isOpen, elementRef, () => onClose())
  useScrollLock(isOpen)
  return isOpen ? <div ref={elementRef} role="dialog" /> : null
}
```

## gotchas
- the hook call itself still isn't conditional — the condition lives inside the effect body, guarded as its first statement
- Headless UI puts `enabled` as the first argument rather than the last (which would allow a default value); that's a stylistic choice, made because they always pass an explicit value and because Prettier formats it more to their liking that way
