---
source: https://www.raymondcamden.com/2025/02/13/using-intldurationformat-for-localized-durations
fetched: 2026-09-11
published: 2025-02-13
status: fresh
---
`Intl.DurationFormat` turns a structured duration object (days/hours/minutes/etc.) into a locale-correct string in one of four styles — long, short, narrow, or digital. Reach for it instead of hand-building duration strings whenever you need to show elapsed or remaining time in the user's own locale.

## how
```js
let duration = { days: 1, hours: 5, minutes: 32 };

let durationFormatter = new Intl.DurationFormat(navigator.language, { style: 'long' });

durationFormatter.format(duration);
// en: "1 day, 5 hours, 32 minutes"
// fr: "1 jour, 5 heures et 32 minutes"
// style 'digital' with just hours+minutes: "5:32:00"
```

The formatter takes the units as given — it won't roll a large `minutes` value over into hours for you, so break a raw millisecond difference into units yourself first:

```js
const MINUTE = 60 * 1000, HOUR = 60 * MINUTE, DAY = 24 * HOUR;
let diff = Math.abs(d1.getTime() - d2.getTime());
let result = { days: 0, hours: 0, minutes: 0 };
if (diff >= DAY) { result.days = Math.floor(diff / DAY); diff -= result.days * DAY; }
if (diff >= HOUR) { result.hours = Math.floor(diff / HOUR); diff -= result.hours * HOUR; }
if (diff >= MINUTE) { result.minutes = Math.floor(diff / MINUTE); diff -= result.minutes * MINUTE; }
durationFormatter.format(result);
```

## gotchas
- Passing `{ minutes: 360 }` prints "360 minutes", not "6 hours" — the API formats exactly the units you hand it, so convert first.
- What units to include (skip weeks when you already have months? drop seconds?) is a judgment call the API doesn't make for you.
