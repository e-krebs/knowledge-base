---
source: https://iangmcdowell.com/blog/posts/laying-out-a-book-with-css/
fetched: 2026-09-11
published: 2023-03-19
status: stale
---
CSS's paged-media features (`@page`, `@page :left`/`:right`, page-margin boxes, `break-after`, `hyphens`) can lay out a full print book — page size, running headers that differ by page side, page numbers, chapter breaks — directly from HTML/CSS, no desktop publishing software required. Reach for this when you need a print-ready PDF from HTML content and want page numbers, alternating margins/headers, or forced chapter breaks.

## how
Set page size and a page-number counter:
```css
body { counter-reset: page_num; }

@page {
  margin-top: .7in;
  margin-bottom: .58in;
  size: 5.5in 8.5in;
  counter-increment: page_num;
  @bottom-center { content: counter(page_num); font-size: 9pt; }
}
```

Different margins and running headers per page side (binding side needs a wider margin than the outer edge):
```css
@page :left {
  margin-left: .5in; margin-right: .75in;
  @top-center { content: "AUTHOR NAME"; }
}

@page :right {
  margin-left: .75in; margin-right: .5in;
  @top-center { content: "BOOK TITLE"; }
}
```

Force each chapter onto a new page, and hide the running header on a chapter's first page by painting over it with a white box (there's no clean `:first-page`-style way to do this):
```css
.chapter { break-after: always; }

h2::before {
  content: '';
  position: absolute;
  top: -1in; left: 0;
  width: 100%; height: 2in;
  background-color: white;
}
```

Auto-hyphenate justified body text — requires a declared `lang` on `<html>` (e.g. `<html lang="en-us">`) or it silently does nothing:
```css
body {
  hyphens: auto;
  hyphenate-limit-chars: 6 3 2;
}
```
`orphans`/`widows` (lines left alone at the top/bottom of a page) already default to `2` in CSS, so most books need no extra rule for them.

## gotchas
- No pure-CSS way exists to prevent an orphaned single word on a paragraph's last line — the source suggests replacing the paragraph's last space with `&nbsp;` as a workaround.
- Stale: `@bottom-center`/`@top-center` page-margin box content is now supported natively as **native CSS `@page` margin boxes** (Chrome 131+, Safari 18.2+; not yet Baseline — still unsupported in Firefox), so a paged-media renderer like WeasyPrint or paged.js is only needed for Firefox or true cross-browser output, not for page numbers/headers on Chromium or Safari.
