---
source: https://ishadeed.com/article/field-sizing/
fetched: 2026-09-11
published: 2025-10-31
status: stale
---
`field-sizing: content` sizes an input or select to fit its current content or selected option, a job that used to require JavaScript. Reach for it on form fields where the width should track what's typed or selected — conversational forms, pagination selects, subdomain/username inputs, hero filter selects — rather than sitting at a fixed width.

## how
```css
select {
  field-sizing: content;
}
```

Because the field now grows to its content, cap it so a long value can't blow out the layout:

```css
select {
  max-width: 100%;
}
```

It degrades safely as a progressive enhancement: unsupported browsers just keep the field at its normal fixed/default width.

## gotchas
- `field-sizing: content` respects placeholder text as a minimum width, so a field won't collapse smaller than its placeholder.
- Freshness (2026-09): the post said Chrome only with Safari/Firefox expected; `field-sizing` has since reached Baseline newly available (June 16 2026, after Firefox 152 and Safari 26.2 shipped it).
