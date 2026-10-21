---
source: https://www.refactoringui.com/previews/building-your-color-palette
fetched: 2026-09-11
status: fresh
---
A methodology for building a design-system color palette by hand rather than generating it from a single seed color. Split the palette into greys, primary color(s), and accent colors, give each one a full range of pre-defined shades, and pick every shade by eye instead of computing it on the fly. Reach for this when starting a UI's color system from scratch.

## how
- Plan for three categories: 8-10 grey shades (text, backgrounds, panels), 5-10 shades of one or two primary colors (main actions, navigation), and several accent colors (yellow/pink/teal for highlights, red/yellow/green for semantic states) each with their own shade range.
- If elements need to be distinguished or categorized (graph lines, calendar events, tags), you may need even more accent colors — a complex UI can need as many as ten colors with 5-10 shades each.
- Never derive shades on the fly with preprocessor functions like `lighten()`/`darken()` — define a fixed set of shades up front so you don't end up with dozens of near-identical colors that all look the same.
- Pick the base color first — the color your lighter/darker shades are built from. For primary/accent colors, a good rule of thumb is one that would work well as a button background; there's no "start at 50% lightness" rule, so rely on your eyes.
- Pick the darkest and lightest shades next, using their eventual use as a guide: darkest for text, lightest for tinting a background. A simple alert component (which needs both) is a good place to pick them.
- Fill in the gaps using a 900 (darkest) / 500 (base) / 100 (lightest) numbering: pick 700 and 300 first (midpoints of each half), then 800, 600, 400, and 200 the same way. Nine shades total is a convenient, easy-to-divide count that avoids both too few options and decision paralysis.
- Greys follow the same edge-then-gap-filling process, but without a meaningful "base" color — pick the darkest text color and lightest off-white background first, since true black tends to look unnatural.
- Ultra-light shades of a primary/accent color work well as tinted alert or panel backgrounds, while the darkest shades work best for text.

## gotchas
- Treat the systematic scale as a starting point, not a rule — once you're using the colors in real designs, tweak individual shades by eye, but avoid adding new ad hoc shades often or the palette stops being a system.
- There's no fixed formula for picking the base, darkest, or lightest shade (no "start at 50% lightness") — every color behaves differently, so trust your eyes over the numbers.
