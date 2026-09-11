---
source: https://www.developerway.com/posts/debouncing-in-react
fetched: 2026-09-11
published: 2023-01-05
status: fresh
---
Debounce delays a callback until a quiet period has passed, collapsing a burst of calls (keystrokes) into one; throttle guarantees the callback still fires at a regular interval no matter how often it's triggered. Reach for debounce when you want one final value (search-as-you-type), and throttle when you need periodic progress with bounded data loss (autosave, scroll handlers).

## how
The debounced/throttled function must be created exactly once — on mount — otherwise every re-render recreates its internal timer and it degenerates into a plain delay. Attach the changing callback to a `ref` so the debounce wrapper itself never needs to be recreated:
```jsx
const useDebounce = (callback) => {
  const ref = useRef();
  useEffect(() => { ref.current = callback; }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => ref.current?.();
    return debounce(func, 1000);
  }, []); // no dependencies — created once, on mount

  return debouncedCallback;
};
```
Usage — `value` stays live in the callback via the ref, without recreating the debounce:
```jsx
const Input = () => {
  const [value, setValue] = useState();
  const debouncedRequest = useDebounce(() => console.log(value));

  const onChange = (e) => {
    setValue(e.target.value);
    debouncedRequest();
  };
  return <input onChange={onChange} value={value} />;
}
```

## gotchas
- Calling `debounce(fn, wait)` directly in the component body re-creates the timer on every re-render, turning debounce into a plain delay — it must be created only once.
- A `ref` initialized as `useRef(debounce(...))` freezes any state/props read inside the callback at mount time (closure); reassigning `ref.current` on every relevant dependency, rather than recreating the debounce call, keeps access to the latest state without breaking the timer.
- The same technique and caveats apply to throttle — the only difference is throttle fires periodically during a burst, debounce fires once after it settles.
