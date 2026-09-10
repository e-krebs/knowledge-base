---
source: https://bsky.app/profile/did:plc:6sxf5ndtba4gsh3kp6hrt5g4/post/3lcedcdj4qk2y
fetched: 2026-09-10
published: 2024-12-03
status: stale
---
Text that turns black or white by itself from any background color, with no JavaScript. Relative color syntax reads the background's lightness in LCH, and a `calc()` pushes it to 0 or 100 depending on which side of 50% it falls. Reach for it on badges, tags or user-chosen colors where contrast must hold for any value.

## how
```css
.magic {
  --bg: red;
  background: var(--bg);
  /* Swap between white or black based on the background. */
  color: lch(from var(--bg) calc((50 - l) * infinity) 0 0);
}
```
`(50 - l) * infinity` is a huge positive number for a dark background and a huge negative one for a light background, and `lch()` clamps it to white or black.

## gotchas
- The native replacement, `contrast-color()`, reached Baseline newly available in April 2026 and is not widely available yet, so the trick still covers the browsers it misses.
- The thread points to a longer treatment, Lea Verou's [On compliance vs readability: generating text colors with CSS](https://lea.verou.me/blog/2024/contrast-color/).
- The code lived in an image on the post; the rule above is a transcription.
