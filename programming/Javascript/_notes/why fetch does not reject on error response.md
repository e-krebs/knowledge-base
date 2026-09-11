---
source: https://kettanaito.com/blog/why-fetch-promise-doesnt-reject-on-error-responses
fetched: 2026-09-11
published: 2023-10-12
status: fresh
---
The Promise returned by `fetch()` only reflects the state of the *request*, not of the response's HTTP status — so a 404 or 500 response still resolves the promise, it just resolves with `response.ok === false`. A request is "successful" from the network code's perspective once it was sent to the server in its entirety; what the server answers with is a separate, application-level concern that `fetch()` deliberately doesn't judge for you.

## how
Always check `response.ok` (or the status) explicitly instead of assuming a non-2xx response will land in `.catch()`:

```js
fetch(request)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Server responded with ${response.statusCode}`)
    }

    return response.json()
  })
  .catch((error) => {
    // Handle request errors.
  })
```

## gotchas
- The fetch promise rejects only for: an incorrectly constructed request, a network error (DNS failure, unreachable network), or an aborted request — never for an HTTP error status.
