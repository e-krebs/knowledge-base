---
source: https://www.raymondcamden.com/2025/08/22/unit-formatting-with-intl-in-javascript
fetched: 2026-09-11
published: 2025-08-22
status: fresh
---
`Intl.NumberFormat`'s `style: 'unit'` option formats a number together with a locale-aware unit label (bytes, meters, ounces, and so on). Reach for it whenever you need to display a quantity of some measurement — file size, distance, weight — formatted correctly for the current locale instead of hand-building unit strings.

## how
List the units the runtime supports with `Intl.supportedValuesOf('unit')`. Intl only renders the unit; you still have to pick which unit level to use, e.g. this byte-size formatter:

```js
function formatBytes(bytes, locale = 'en-US') {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  const formatter = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: units[i],
    unitDisplay: 'narrow', // or 'short', 'long'
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}
```

Swap the hardcoded `'en-US'` default for `navigator.language` to follow the browser's locale.

## gotchas
- Baseline since 2023 and supported since Firefox 78 (2020) and Safari 14.5+ — the only historical gap was pre-2021 Apple OSes, long resolved, so it's safe to use everywhere today
