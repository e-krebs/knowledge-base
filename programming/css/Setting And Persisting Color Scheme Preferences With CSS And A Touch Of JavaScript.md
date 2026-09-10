---
source: https://www.smashingmagazine.com/2024/03/setting-persisting-color-scheme-preferences-css-javascript/
fetched: 2026-09-10
published: 2024-03-25
status: fresh
---
Letting users pick system/light/dark used to mean JS toggling classes and tracking state. Now `prefers-color-scheme`, the `color-scheme` property, and `:has()` bound to a native `<select>` cover the styling; JavaScript is reduced to persisting the chosen option in `localStorage` across reloads.

## how
```css
:root {
  color-scheme: var(--color-scheme, light);

  @media (prefers-color-scheme: dark) {
    --color-scheme: dark;
  }
}
```
A native select gives the user explicit control, and `:has()` reacts to it without JS:
```html
<select id="color-scheme">
  <option value="system" selected>System</option>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
```
```css
:root:has(select option[value="dark"]:checked) {
  --color-scheme: dark;
}
```
Persistence is the only part JS still owns — store the selected value on `input` and restore it on load:
```javascript
function storeColorSchemePreference({ target }) {
  const colorScheme = target.querySelector(":checked").value;
  localStorage.setItem(colorSchemeStorageItemName, colorScheme);
}
```

## gotchas
- `color-scheme` itself doesn't animate — pair `transition-duration` on the other affected properties with a `(prefers-reduced-motion: reduce)` override that drops it to `0s`.
- Without `:has()` support, fall back with `@supports not selector(:has(body))`: hide the picker and rely on `prefers-color-scheme` alone.
