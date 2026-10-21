---
source: https://web.dev/blog/intl-segmenter
fetched: 2026-09-11
published: 2024-04-18
status: fresh
---
`Intl.Segmenter` does locale-sensitive text segmentation, splitting a string into words, sentences, or graphemes according to the rules of a given locale. Reach for it instead of `String.split()` on whitespace whenever text might be in a language — like Chinese or Japanese — that doesn't use spaces to separate words, where a whitespace split gives wrong results.

## how
Create a segmenter for a locale and a `granularity` (`"grapheme"`, `"word"`, or `"sentence"`), then call `segment()` to get an iterable of segments:

```js
const segmenter = new Intl.Segmenter('ja-JP', { granularity: 'word' });

const segments = segmenter.segment(str);
console.table(Array.from(segments));
```

## gotchas
- Baseline support: Chrome/Edge 87, Firefox 125, Safari 14.1 — confirmed still current as of today, so it's safe to use without a fallback.
