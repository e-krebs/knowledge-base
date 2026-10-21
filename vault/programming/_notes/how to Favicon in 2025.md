---
source: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
fetched: 2026-09-13
published: 2026-01-21
status: fresh
---
Instead of generating a pile of PNG sizes, a modern favicon set needs just three `<link>` tags — an ICO, an SVG, and an Apple touch icon — plus a web app manifest if the site is a PWA. Use this as the default icon set for any site, and add the manifest only when you need home-screen install support.

## how
```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- 180×180 -->
```

For a PWA, also add:
```html
<link rel="manifest" href="/manifest.webmanifest">
```
```json
// manifest.webmanifest
{
  "icons": [
    { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/icon-mask.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" },
    { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" }
  ]
}
```

## gotchas
- add `sizes="32x32"` to the `.ico` `<link>` to work around a Chrome bug that otherwise picks the ICO over the SVG
- maskable icons need extra padding: the safe zone is a 409×409 circle inside the 512×512 canvas — check with maskable.app
- the article is actively maintained and has been retitled from its original "six files" framing to the current three-file set
