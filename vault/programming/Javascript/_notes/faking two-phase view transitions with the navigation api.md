---
source: https://www.bram.us/2025/11/17/faking-two-phase-view-transitions-with-the-navigation-apis-precommithandler/
fetched: 2026-09-11
published: 2025-11-17
status: stale
---
The Navigation API's `precommitHandler` lets you defer a navigation's commit, so you can run one View Transition into a loading/preview state immediately on click, then a second one into the real content once it has actually loaded — faking a "two-phase" transition that Cross-Document View Transitions can't do alone (those only start once the navigation commits, which is late on a slow connection). Reach for it when a same-origin navigation's next page takes a moment to be ready and a stalled click feels worse than a placeholder transition.

## how
Intercept the `navigate` event; start the outgoing transition and fetch inside `precommitHandler`, then await it and start the incoming transition inside `handler` once data has arrived:

```js
let outgoingViewTransition, incomingViewTransition;

navigation.addEventListener("navigate", (e) => {
  e.intercept({
    precommitHandler: async () => {
      outgoingViewTransition = document.startViewTransition({
        update: () => { document.documentElement.dataset.pendingTransition = 'true'; },
      });
      const response = await fetch(e.destination.url, { signal: e.signal });
    },
    handler: async () => {
      if (outgoingViewTransition) await outgoingViewTransition.finished;
      incomingViewTransition = document.startViewTransition({
        update: () => {
          delete document.documentElement.dataset.pendingTransition;
          document.body.replaceWith(pageData.$body);
        },
      });
    }
  });
});
```

## gotchas
- There's no `nextDocumentReadyToRender` signal yet, so the hack either fires unconditionally or not at all — skipping the loading state on a fast connection needs a manual `AbortSignal` workaround.
- Without `ViewTransition.waitUntil()` (not available when this was written), a frame glitch can appear if the transition finishes before data has loaded; the workaround is a duplicate loading overlay toggled via a data attribute.
- Successor: the Navigation API overall reached Baseline newly available in January 2026 (Chrome, Edge, Firefox 147, Safari 26.2), but `precommitHandler` itself is still absent from Safari 26.2 and remains a named Interop 2026 focus area — it stays Chromium-first, not yet Baseline on its own.
