---
source: https://web.archive.org/web/20250717044055/https://www.jacobparis.com/content/svg-icons
fetched: 2026-09-13
status: stale
---
An SVG sprite bundles many icons as `<symbol>` elements inside one hidden SVG file, and each usage site references one by id with `<use href="#id">` — one HTTP request and one cached asset instead of inlining SVG markup everywhere. Reach for this over inline JSX icons once an icon set is used in more than a couple of places.

## how
The sprite, holding every icon as a `<symbol>`:
```html
<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">
  <symbol id="icon-circle" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="16" />
  </symbol>
  <symbol id="icon-square" viewBox="0 0 32 32">
    <rect x="0" y="0" width="32" height="32" />
  </symbol>
</svg>
```
Consuming an icon anywhere on the page:
```html
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <use href="#icon-circle" />
</svg>
```
A React `Icon` component wrapping the same pattern, so call sites just pass an id:
```tsx
const icons = ["icon-circle", "icon-square"];

function Icon({ id, ...props }) {
  return (
    <svg {...props}>
      <use href={`/images/sprite.svg#${id}`} />
    </svg>
  );
}
```
The source page's tooling angle (jacobparis.com, Remix-specific): a `build-icons.ts` script glob-reads a folder of individual SVGs, strips `xmlns`/`width`/`height` from each, renames the root element to `<symbol id="...">`, and writes them all into one `sprite.svg` — plus a generated `IconName` union type so the `Icon` component's `name` prop autocompletes and errors on typos. Wired to `npm run build:icons`, and to Sly CLI's `postinstall` hook so adding an icon regenerates the sprite and the type automatically.

## gotchas
- The source page (jacobparis.com/content/svg-icons) 404s today and is only reachable via web.archive.org. Its listed successor, `/content/svg-icons-with-cli`, also 404s on direct fetch.
