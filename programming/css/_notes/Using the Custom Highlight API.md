---
source: https://frontendmasters.com/blog/using-the-custom-highlight-api/
fetched: 2026-09-11
published: 2025-08-07
status: fresh
---
The Custom Highlight API applies `::highlight()` styling to arbitrary text ranges via a JS `Range()`/`Highlight()` pair, with no `<span>`s and no DOM changes. Reach for it when you need to style found or selected text — search-result highlighting, syntax highlighting — without touching the DOM structure or paying its performance cost on heavy pages.

## how
1. Get a `textNode` (e.g. `document.querySelector("p").firstChild`).
2. Build a `Range()` with `setStart`/`setEnd` between two character offsets.
3. Register it with `CSS.highlights.set(name, new Highlight(range))`.
4. Style it in CSS with `::highlight(name)`.

```js
const WORD_TO_HIGHLIGHT = "wisdom";
const NAME_OF_HIGHLIGHT = "our-highlight";

const textNode = document.querySelector("p").firstChild;
const textContent = textNode.textContent;

const startIndex = textContent.indexOf(WORD_TO_HIGHLIGHT);
const endIndex = startIndex + WORD_TO_HIGHLIGHT.length;

const range = new Range();
range.setStart(textNode, startIndex);
range.setEnd(textNode, endIndex);

const highlight = new Highlight(range);
CSS.highlights.set(NAME_OF_HIGHLIGHT, highlight);
```

A single `Highlight()` accepts multiple `Range`s, so one `::highlight()` name can cover every match of a search term across a block of text — useful for building a custom in-page search UI.

## gotchas
- This API is client-side only, so there's a pop-in delay between content appearing and highlights (e.g. syntax highlighting) applying — server-rendered spans avoid that delay when performance/accessibility allow it.
- `::highlight()` is now ~93% globally supported (Chrome/Edge 105+, Safari 17.2+, Firefox full since 149) with no native replacement in sight.
