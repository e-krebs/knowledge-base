---
source: https://www.propelauth.com/post/using-usemutation-to-make-an-advanced-toggle-in-react
fetched: 2026-09-11
published: 2023-05-24
status: fresh
---
Builds a toggle that updates instantly (optimistically), shows a loading spinner while a request is in flight, and rolls back with an error icon if the request fails — using React Query's `useMutation` lifecycle hooks against a shared cache. Reach for this when a control (a settings toggle, a checkbox) must feel instant but is backed by a real API call that can fail.

## how
```js
useMutation({
    mutationFn: updateConfig,

    onMutate: async (partialConfigUpdate) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ['config'] })

        // Snapshot the previous value
        const previousConfig = queryClient.getQueryData(['config'])

        // Optimistically update to the new value
        queryClient.setQueryData(['config'], (oldConfig) => ({
            ...oldConfig,
            ...partialConfigUpdate,
        }))

        // Return a context object with the snapshotted value
        return { previousConfig }
    },
    onError: (err, partialConfigUpdate, context) => {
        // roll back our config update using the context
        queryClient.setQueryData(['config'], context?.previousConfig)
    },
    onSettled: (mutationResponse, err, partialConfigUpdate, context) => {
        // Other config changes could've happened, let's trigger a refetch
        //   but notably, our UI has been correct since the mutation started
        queryClient.invalidateQueries({ queryKey: ['config'] })
    },
})
```
Layer a status hook (loading/success/error, cleared after a timeout via something like Mantine's `useTimeout`) on top to drive spinner/check/X icons, then wrap both concerns in one reusable hook (`useAutoUpdatingMutation`) that a `<Toggle>` calls on change.

## gotchas
- Cancel in-flight queries for that key first (`queryClient.cancelQueries`) before writing the optimistic value, or a refetch that resolves later can overwrite it.
- Always undo the optimistic change in `onError` using the snapshot taken in `onMutate` — otherwise a failed request leaves the UI in the wrong state.
