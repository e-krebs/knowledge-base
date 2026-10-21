---
source: https://www.matuzo.at/blog/2026/html-boilerplate
fetched: 2026-09-13
published: 2026-08-17
status: fresh
---
Manuel Matuzović's head-of-document boilerplate, updated for 2026, lists every tag he considers required or essential for a basic HTML page, each with his reason for keeping it. Use it as a scaffold checklist, then layer on the optional extras (no-js class, text-scale, print stylesheet, RSS, etc.) only when a page actually needs them.

## how
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <title>Unique page title - My Site</title>
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="canonical" href="https://web.site/page">
  <meta name="description" content="Page description">
  <meta property="og:image" content="https://web.site/sm.jpg">
  <meta property="og:url" content="https://web.site/page">
</head>
<body>
  <!-- Content -->
</body>
</html>
```
- `<!DOCTYPE html>` — no longer defines a different rendering mode, but still required for compatibility.
- `lang="en"` — defines the page's natural language; drives pronunciation, translation, and more.
- `charset="UTF-8"` — must come before `<title>` or characters in the title can render wrong.
- `viewport` `width=device-width` — sets viewport width to the device width; `initial-scale=1` is no longer needed except in rare old-iOS/Android edge cases.
- `<title>` — unique per page; shown in the tab, search results, and bookmarks.
- `favicon.ico` — 32x32 icon for legacy browsers; needed alongside the SVG or iOS 18 shows no icon at all.
- `favicon.svg` — vector icon, scales cleanly and can use CSS for dark mode.
- `apple-touch-icon` — 180x180 icon used when the page is added to an iOS home screen.
- `manifest` — gives Android the icons for home screen, dialogs, and PWA splash screen.
- `canonical` — avoids SEO duplicate-content issues when a page is reachable at multiple URLs.
- `description` — shown on search result pages, though engines may substitute their own summary.
- `og:image` — image shown when the link is shared on social media or chat apps.
- `og:url` — canonical URL for social scrapers, so links with tracking params aren't cached as separate pages.
