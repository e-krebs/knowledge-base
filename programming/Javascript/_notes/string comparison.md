---
source: https://bytes.dev/archives/214
fetched: 2026-09-13
published: 2023-08-17
status: fresh
---
JavaScript's default `<`/`>` string comparison is not language-sensitive, so sorting names with accented characters (Émile, Ólafur, Zoë) puts them in the wrong order. `Intl.Collator` fixes this by doing a locale-aware comparison instead.

## how
Buggy version, using plain `<`/`>`:
```js
if (a.firstName < b.firstName) return -1;
```
Fixed version, using `Intl.Collator`:
```js
function sortAlphabetically(arr) {
  const collator = new Intl.Collator("en", { sensitivity: "base" });
  return arr.sort((a, b) => collator.compare(a.firstName, b.firstName));
}
```

## gotchas
- Create the `Intl.Collator` once and reuse it across comparisons — it's faster than calling `localeCompare` per pair.
