---
source: https://www.smashingmagazine.com/2025/11/css-gamepad-api-visual-debugging-css-layers/
fetched: 2026-09-10
published: 2025-11-14
status: fresh
---
Gamepad input is invisible by default — the Gamepad API only exposes raw numeric arrays via polling, with no built-in visual feedback. This technique uses CSS Cascade Layers (`@layer base, active, debug`) to keep default button styling, "active/pressed" styling, and debug overlays in separate, predictable priority tiers, so a `requestAnimationFrame` polling loop can toggle an `active` class per button without specificity fights. Reach for this whenever several independent visual states (default, interactive, debug) need to layer over the same elements.

## how
```css
@layer base, active, debug;

@layer base {
  .button {
    background: #333;
    border-radius: 50%;
    width: 70px;
    height: 70px;
  }
}

@layer active {
  .button.active {
    background: #0f0;
    transform: scale(1.1);
  }
}

@layer debug {
  .button::after {
    content: attr(data-value);
    font-size: 12px;
    color: #fff;
  }
}
```
The polling loop then just toggles the class — `btnA.classList.toggle("active", gp.buttons[0].pressed)` — and the declared layer order decides which rule wins, with no extra selector weight needed.
