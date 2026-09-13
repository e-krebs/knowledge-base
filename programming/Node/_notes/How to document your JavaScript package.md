---
source: https://deno.com/blog/document-javascript-package
fetched: 2026-09-13
published: 2024-05-10
status: fresh
---
JSDoc comments couple documentation with the code itself, so it can be rendered as HTML, markdown, JSON, or shown directly in an editor's tooltips and autocomplete. Reach for this checklist when publishing a package (e.g. to JSR) and you want users productive without leaving their editor.

## how
- Write a concise first paragraph — it's the summary shown in tooltips, autocomplete, and search. Describe *what* the function does, not how:
```js
/** Replaces all spaces in a string with underscores. */
function replaceSpacesWithUnderscores(value) {
  return value.replace(/ /g, "_");
}
```
- Add type information (TypeScript types, or `@param`/`@returns` tags) so editors can autocomplete and users can filter functions by signature.
- Add runnable examples with `@example`:
```ts
/**
 * @example Find a substring in a string
 * ```ts
 * const index = find("hello world", "world"); // 6
 * ```
 */
```
- Document every exported symbol — functions, classes, interfaces, type aliases, and each method/property on them, including constructors. For multi-module packages, add a `@module`-tagged comment per file.
- Use markdown inside comments (headings, lists, links, code spans) for longer explanations; on JSR, `[!IMPORTANT]` highlights callouts.
- Link to other symbols with `@link`/`@linkcode`/`@linkplain` — `@linkcode` also resolves built-ins like `ArrayBuffer` to MDN.
- Check documentation examples type-check with `deno test --doc`, and lint for missing docs/return types with `deno doc --lint`.

## gotchas
- Only the first paragraph of a `@module` comment shows on the package's main docs page — put the essential summary there, not buried after it.
