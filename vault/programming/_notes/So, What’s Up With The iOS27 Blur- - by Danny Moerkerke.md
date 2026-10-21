---
source: https://modernwebweekly.substack.com/p/so-whats-up-with-the-ios27-blur
fetched: 2026-10-20
published: 2026-09-30
status: fresh
---
On iOS27, an installed PWA renders a blur at the top of the screen that reaches well below the status bar and covers content near the top. The only tested way to get a solid status bar without the blur is a thin `position: fixed` element with a background color at the very top. The article also covers desktop PWA title bar content and file handling.

## how
Solid status bar on iOS27 (tested by the author): add a fixed element with a background color. The status bar takes its color and stays solid on scroll. The element must be:
- at least 6px high
- at least 80% wide
- within 4px of the top of the screen

Desktop title bar content, in `manifest.json`:
```json
{
  "display_override": ["window-controls-overlay"]
}
```
```css
.window-controls {
  position: fixed;
  left: env(titlebar-area-x);
  top: env(titlebar-area-y);
  width: env(titlebar-area-width);
  height: env(titlebar-area-height);
  window-drag: move;
}
```
`navigator.windowControlsOverlay` exposes `visible`, `getTitlebarAreaRect()` and a `geometrychange` event.

File handling: declare `file_handlers` (`action`, `accept` MIME types and extensions) and `launch_handler.client_mode` (`auto`, `focus-existing`, `navigate-existing`, `navigate-new`) in the manifest, then consume files:
```js
launchQueue.setConsumer(async (launchParams) => {
  for (const fileHandle of launchParams.files) {
    const file = await fileHandle.getFile();
  }
});
```

## gotchas
- No effect on the iOS27 blur: `theme-color` (unsupported since iOS26), `apple-mobile-web-app-status-bar-style` (deprecated), or a `background-color` on `<body>` (the status bar matches it but the blur still renders below, with a gradient on scroll-up).
- The blur is much larger in the installed PWA than in Safari, where it is about the status bar height.
- The author found no way to get a transparent status bar without the blur.
- Window controls overlay and file handling are desktop only (Chromium-based browsers on macOS, Windows; file handling also ChromeOS). In Edge the overlay has no toggle and is always shown.
