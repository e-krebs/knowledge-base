---
source: https://darn.es/code-pen-web-component/
fetched: 2026-09-13
published: 2024-06-18
status: fresh
---
The `<code-pen>` Web Component wraps a `<code>` element (or up to three) and adds a button that opens the code pre-filled in the CodePen editor. Reach for it when a page shows a code snippet and you want a one-click "try it in CodePen" without hand-building a CodePen embed or share link.

## how
Install and load it, then wrap a `<pre><code>` block:

```html
<script type="module" src="code-pen.js"></script>

<code-pen>
  <pre>
    <code>&lt;p&gt;Hello world&lt;/p&gt;</code>
  </pre>
</code-pen>
```

Install: `npm i @daviddarnes/code-pen`.

Wrap up to three `code` elements to fill HTML, CSS and JS in that order. Attributes:
- `css` / `js` — put a single code sample into the CSS or JS editor instead of HTML (the default)
- `html="sel"` / `css="sel"` / `js="sel"` — pick source elements by selector instead of position, e.g. `css="textarea"` or `html=".language-html"`, for out-of-order or extra elements
- `title` — sets the pre-filled pen's title
- `label` — changes the "Open in CodePen" button text
- `contenteditable` on the code container (or use a `textarea`/`input` instead of `code`) — lets readers edit the code before it opens in CodePen
- `template` — use a custom template for specific instances
