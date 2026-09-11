---
source: https://www.kirupa.com/javascript/detecting_browser_zoom_changes.htm
fetched: 2026-09-11
status: fresh
---
There's no dedicated `zoom` event — zooming fires a `resize` event just like resizing the window does. Reach for this technique when you need to tell the two apart, e.g. to preserve exact visual output in a canvas-based UI.

## how
The browser window size (`window.outerWidth`/`outerHeight`) stays fixed across a zoom; the viewport size (`window.innerWidth`/`innerHeight`) shrinks or grows instead. Comparing the two on every `resize` lets you compute a zoom percentage and detect real changes to it.

```js
class ZoomDetector {
  constructor() {
    this.lastWidth = window.innerWidth;
    this.lastScale = this.getZoomLevel();
    window.addEventListener('resize', () => requestAnimationFrame(() => this.checkZoom()));
    // pinch-to-zoom, when window width itself hasn't changed
    window.visualViewport?.addEventListener('resize', () => {
      if (window.innerWidth === this.lastWidth) this.checkZoom();
    });
  }

  getZoomLevel() {
    return Math.round(window.outerWidth / window.innerWidth * 100);
  }

  checkZoom() {
    const currentScale = this.getZoomLevel();
    const currentWidth = window.innerWidth;
    if (currentScale !== this.lastScale || currentWidth !== this.lastWidth) {
      const direction = currentScale > this.lastScale ? 'in' : 'out';
      window.dispatchEvent(new CustomEvent('zoom', { detail: { newScale: currentScale, direction } }));
      this.lastScale = currentScale;
      this.lastWidth = currentWidth;
    }
  }
}

new ZoomDetector();
window.addEventListener('zoom', (e) => { /* react to e.detail */ });
```

## gotchas
- Doesn't work consistently in Firefox — confirmed still true in 2026: Firefox's `outerWidth`/`innerWidth` ratio stays inconsistent, and Visual Viewport's `scale` only reflects pinch-zoom, not page/ctrl-zoom.
