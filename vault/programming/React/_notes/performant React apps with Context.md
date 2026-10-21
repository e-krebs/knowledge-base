---
source: https://www.developerway.com/posts/how-to-write-performant-react-apps-with-context
fetched: 2026-09-11
published: 2022-02-07
status: fresh
---
A Context consumer re-renders whenever the context value changes, regardless of which part of that value it actually reads. Rather than reaching for a state library the moment this hurts, you can shrink the blast radius in stages: split state from API into two contexts, keep the API object referentially stable, then split the state itself into one context per field. Reach for this progression when you want to keep plain Context but a single monolithic value is causing unrelated consumers to re-render together.

## how
Split one context into a data context and an API context so consumers that only need callbacks don't re-render on state changes:
```ts
const FormDataContext = createContext<State>({} as State);
const FormAPIContext = createContext<API>({} as API);
```

Keep the API object stable across state updates by driving it with `useReducer`/`dispatch` instead of `setState`, so the `useMemo` wrapping it can drop `state` from its dependencies:
```ts
const api = useMemo(() => {
  const onDiscountChange = (discount: number) => {
    dispatch({ type: 'updateDiscount', discount });
  };
  // ...other actions, all dispatching
  return { onSave, onDiscountChange, onNameChange, onCountryChange };
  // no more dependency on state! The api value will stay the same
}, []);
```

Split the state context itself into one context per field, so a consumer only re-renders when the field it reads actually changes:
```ts
const FormNameContext = createContext<State['name']>({} as State['name']);
const FormCountryContext = createContext<State['country']>({} as State['country']);
const FormDiscountContext = createContext<State['discount']>({} as State['discount']);

export const useFormName = () => useContext(FormNameContext);
export const useFormCountry = () => useContext(FormCountryContext);
export const useFormDiscount = () => useContext(FormDiscountContext);
```
A component that calls `useFormCountry()` no longer re-renders when the name field changes.
