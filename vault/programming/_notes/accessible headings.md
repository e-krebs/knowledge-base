---
source: https://luhr.co/blog/2023/09/12/all-about-accessible-headings/
fetched: 2026-09-13
published: 2023-09-12
status: fresh
---
Headings (`<h1>`–`<h6>`) give sighted users a scannable visual hierarchy and give assistive-technology users a navigable outline of a page's structure. Reach for this note when structuring a page's heading levels, or when auditing existing markup for heading anti-patterns like eyebrow text, linked headings, or a nav-as-`<h1>`.

## how
Core rules:
- Use a single, unique `<h1>` per page: "every page's heading outline should begin with a single, unique heading that clearly and succinctly identifies the main focus of that page."
- Don't skip heading levels: "A heading should not be more than 1 level deeper than the previous heading."
- Don't pick a heading level for its font size: use CSS for visual styling, headings only to describe content.
- Pair a landmark with a heading via `aria-labelledby`, since a bare `<section>` has no accessible name otherwise:

```html
<section aria-labelledby="features-section-heading">
	<h2 id="features-section-heading">Features</h2>
</section>
```

Common pattern fixes:
- **Eyebrow text before large text**: don't make the large narrative text an `<h1>`/`<h2>` and the small eyebrow a `<p>`. Make the eyebrow the heading, the large text a paragraph.
- **Home link as `<h1>`**: don't wrap the nav home link in `<h1>`. Keep nav as plain links; put the page's real `<h1>` in `<main>`.
- **Linked headings**: put the link inside the heading, not the heading inside the link:

```html
<h2>
	<a href="/a-year-in-review">A year in review</a>
</h2>
```

Evaluate the outline with the WAVE browser extension, or by ear: NVDA's Elements List (`Insert + F5`) or `H`/`Shift+H` to jump headings, VoiceOver's Rotor Mode (`Control + Option + U`).

## gotchas
- `<hgroup>` adds no semantics: "no assistive technology communicates any additional semantics with `<hgroup>`, so the heading and paragraph are treated normally."
- the HTML outline algorithm (auto heading levels from nested landmarks) was never implemented by assistive technology and is not advised by the living standard — assign heading levels explicitly instead.
- don't confuse "heading" with `<header>` (a landmark) or `<title>`/the `title` attribute (metadata/tooltip, inconsistently announced).
