---
source: https://nodejsdesignpatterns.com/blog/nodejs-http-request/
fetched: 2026-09-13
published: 2026-01-29
status: fresh
---
Since Node 18, the global `fetch()` is the recommended way to make HTTP requests — same API as the browser, no dependency. Reach for the lower-level `http`/`https` modules or `undici.request()` only for pre-18 compatibility, legacy stream-based APIs, or high-throughput code where `fetch()`'s WebStreams overhead matters.

## how
```js
try {
  const response = await fetch('https://api.example.com/data', {
    signal: AbortSignal.timeout(5000), // always set a timeout
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
} catch (error) {
  if (error.name === 'TimeoutError') console.error('Request timed out')
  else console.error('Request failed:', error.message)
}
```
- `fetch()`'s promise rejects only on network errors (DNS, connection refused, timeout) — a 4xx/5xx still resolves, so always check `response.ok`.
- Streaming upload: pass a `ReadableStream`/`fs.createReadStream()` as `body` with `duplex: 'half'` (required whenever the body is a stream). Streaming download: read `response.body` as a `ReadableStream`, or pipe it to disk via `Readable.fromWeb(response.body)` + `pipeline()`.
- Build URLs with `new URL()` + `url.searchParams.append()`, never string concatenation — it handles encoding and blocks parameter injection from user input.
- Retry transient failures with exponential backoff, and don't retry blindly on every non-OK status — only ones worth retrying (429, 503).
- Mock HTTP in tests with undici's `MockAgent` (`npm install undici --save-dev`) — `disableNetConnect()` catches accidental real requests, and restoring the original dispatcher in `afterEach` avoids leaking mocks between tests.

## gotchas
- `undici.request()` bypasses `fetch()`'s WebStreams layer and can be 7-10x faster; `http.request()` with keep-alive can be ~50% faster than `fetch()`. Irrelevant for most apps — network latency dominates — but worth knowing for high-throughput gateways/proxies.
- Don't set the `Content-Type` header yourself when sending `FormData` — `fetch()` sets it automatically with the correct multipart boundary.
