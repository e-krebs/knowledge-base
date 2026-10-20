---
source: https://www.bram.us/2026/09/23/responsive-iframes/
also: https://alfy.blog/2026/10/09/iframe-that-finally-fit-their-content.html
fetched: 2026-10-20
published: 2026-09-23
status: fresh
---
Chrome 154 adds `frame-sizing`, which lets an `<iframe>` size itself to the intrinsic size of its embedded document, with no `postMessage` plus `ResizeObserver` script on each side. Use it for comment widgets, payment forms, multi-step forms, social embeds and `srcdoc` previews you render yourself. It is a two-way opt-in: the embedder sets the CSS, the embedded page agrees through a meta tag.

## how
Embedder CSS:
```css
iframe {
  frame-sizing: content-height;
  width: 100%;
}
```
Embedded document, in the HTML `<head>` from the start (adding it by JavaScript does not work):
```html
<meta name="responsive-embedded-sizing" content="allow-origins=https://shop.example">
```
- Size is sent after load; when content changes later, the embedded page calls `window.requestResize()`.
- `frame-sizing` values: `auto`, `content-height`, `content-width`, plus `content-inline-size` and `content-block-size`. It combines with limits such as `max-height: 80vh`.
- Progressive enhancement: keep a fixed height by default and switch where supported.
```css
.embed { width: 100%; height: 500px; }
@supports (frame-sizing: content-height) {
  .embed { height: auto; frame-sizing: content-height; }
}
```
```js
if ('requestResize' in window) window.requestResize();
```
The old `postMessage` code can stay as a fallback.

## gotchas
- Chromium only (Chrome 154); Firefox and Safari do not support it (Bram.us tracks Firefox bug 2035008 and WebKit bug 314713). Other browsers ignore it, so a fixed-height iframe stays the baseline.
- The embedded page must cooperate: only the third party can add the meta tag and call `requestResize()`. For a payment provider the real question is whether it supports this.
- Layout shift: the iframe loads then grows, pushing content below; a sensible `min-height` reduces the jump, and it can hurt Core Web Vitals above the fold.
- Avoid `allow-origins=*` without a reason: any site could read the page height, which can leak state (taller when logged in). List only the embedding origins; this complements CSP `frame-ancestors`.
