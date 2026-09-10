---
source: https://cruncher.ch/blog/printing-music-with-css-grid/
fetched: 2026-09-10
published: 2024-04-24
status: fresh
---
Music notation maps naturally onto a grid: pitch runs up the vertical axis, time runs left to right. This technique defines a `.stave` class with named CSS Grid rows for each pitch, then uses attribute selectors on a `data-pitch` attribute to drop SVG note-head symbols onto the right row — giving fluid, responsive, print-friendly music rendering without a custom layout engine or JS positioning. The same idea extends to a `.bar` class mapping rhythmic position to named grid columns via a `data-beat` attribute.

## how
Named grid lines carry the pitch axis; a `^=`/`$=` attribute selector (tolerant of enharmonic spellings like G♭4/G4/G♯4, since all end in `4`) maps any element's `data-pitch` straight to its row:

```css
.stave {
    display: grid;
    row-gap: 0;
    grid-template-rows:
        [A5] 0.25em [G5] 0.25em [F5] 0.25em [E5] 0.25em
        [D5] 0.25em [C5] 0.25em [B4] 0.25em [A4] 0.25em
        [G4] 0.25em [F4] 0.25em [E4] 0.25em [D4] 0.25em
        [C4] 0.25em;
    background-image: url('/path/to/stave.svg');
    background-repeat: no-repeat;
    background-size: 100% 2.25em;
}

.stave > [data-pitch^="G"][data-pitch$="4"] { grid-row-start: G4; }
```

```html
<div class="stave">
    <svg data-pitch="G4" class="head"><use href="#head[2]"></use></svg>
</div>
```

## gotchas
- The page carries an "Update 20 Oct 2025" note pointing to a newer `<scribe-music>` custom element (stephen.band/scribe/) as the author's current approach — this grid technique is the earlier iteration.
