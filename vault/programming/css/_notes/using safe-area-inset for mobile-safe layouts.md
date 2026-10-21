---
source: https://polypane.app/blog/using-safe-area-inset-to-build-mobile-safe-layouts/
fetched: 2026-09-11
published: 2026-05-06
status: fresh
---
`env(safe-area-inset-*)` exposes how much space a phone's notch, dynamic island, camera cutout, or home-indicator gesture area takes up on each screen edge, so fixed headers, floating buttons, and full-screen dialogs can avoid sitting behind system UI. Reach for it on any layout that opts into the full viewport with `viewport-fit=cover`.

## how
```html
<meta name="viewport" content="width=device-width, viewport-fit=cover" />
```
```css
body {
  padding-top: calc(env(safe-area-inset-top) + 1rem);
  padding-right: calc(env(safe-area-inset-right) + 1rem);
  padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  padding-left: calc(env(safe-area-inset-left) + 1rem);
}
```
- Layer two fallbacks: a plain padding declaration before the `calc()` one for browsers without `env()`, and a fallback value inside `env()` itself — `env(safe-area-inset-top, 1rem)` — for the (largely theoretical) case where `env()` is supported but the variable isn't.
- For UI that must hold a stable reserved zone rather than track the live inset (a persistent cookie banner, a full-screen dialog), use `safe-area-max-inset-*`, which stays put even as the browser chrome collapses/expands, with a fallback to the live inset:
```css
.bottom-spacer {
  padding-bottom: calc(env(safe-area-max-inset-bottom, env(safe-area-inset-bottom)) + 1rem);
}
```

## gotchas
- The insets equal exactly the system UI's own size — they add no breathing-room margin, so add your own spacing on top via `calc()`.
- Insets are non-zero only on real mobile devices; desktop browsers and Chrome's responsive device emulation always report `0`, so these bugs are easy to miss until real-device testing.
- `safe-area-max-inset-*` is Chromium-only (shipped Chrome 135) — no Safari or Firefox support, so always pair it with the `env()` fallback shown above.
