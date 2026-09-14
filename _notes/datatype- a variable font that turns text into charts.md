---
source: https://franktisellano.github.io/datatype/
fetched: 2026-09-14
status: fresh
---
Datatype is an OpenType variable font that turns a short text expression into an inline chart via ligature substitution — no JavaScript, images, or rendering library involved. Reach for it when a chart needs to sit directly inside running text or a table cell (e.g. a sparkline next to a stock price) without pulling in a charting library.

## how
Load the font, then apply it to any element wrapping the chart syntax:

```css
@font-face {
  font-family: 'Datatype';
  src: url('Datatype.woff2') format('woff2');
  font-display: swap;
}

.chart {
  font-family: 'Datatype', sans-serif;
  /* Optional: adjust axes */
  font-variation-settings: 'wdth' 15;
  font-weight: 400;
}
```

```html
Sales <span class="chart">{l:20,40,70,50,90}</span> are up.
Budget <span class="chart">{p:73}</span> utilized.
Results <span class="chart">{b:30,70,20,90}</span> by quarter.
```

Chart syntax:
- Bar chart `{b:values}` — comma-separated values, each 0–100, up to 20 bars.
- Sparkline `{l:values}` — comma-separated values, each 0–100, up to 20 points.
- Pie chart `{p:value}` — a single value, 0–100, the percentage filled.

## gotchas
- Values must stay within 0–100; bars and sparklines cap at 20 points each.
