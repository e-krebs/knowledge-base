---
source: https://jakub.kr/writing/details-that-make-interfaces-feel-better
fetched: 2026-09-14
published: 2026-03-10
status: fresh
---
Jakub Krehel's list of small, mostly-CSS interface details — text wrapping, spacing, icon and shadow choices — that individually look minor but compound into an interface that feels more polished. Reach for it as a pass over an existing UI once the core layout is done.

## how
- Text wrapping: `text-wrap: balance` on titles distributes text evenly across lines; `text-wrap: pretty` on paragraphs prevents orphaned words; pair balance on the title with pretty on the description.
- Concentric border radius: when nesting rounded boxes, outer radius = inner radius + padding, so the visible band stays a consistent width.
- Animate icons contextually: animate `opacity`, `scale`, and `blur` on icons shown/hidden contextually (e.g. copy → check) rather than swapping with no transition.
- Make text crispy: `-webkit-font-smoothing: antialiased` (or Tailwind's `antialiased`) on the layout renders macOS text thinner and crisper than the default subpixel smoothing.
- Use tabular numbers: `font-variant-numeric: tabular-nums` (or Tailwind's `tabular-nums`) keeps digit width equal so updating numbers don't shift layout.
- Make animations interruptible: use CSS transitions (interpolate toward the latest state, interruptible) for interactive elements; use keyframe animations for one-time staged sequences that shouldn't retarget mid-run.
- Split and stagger entering elements: animate title, description, and buttons individually with a staggered delay (e.g. 100ms apart) instead of animating one container as a block.
- Make exit animations subtle: exit with less motion than enter — e.g. animate `opacity`/`filter: blur()`/`x` partway (`-70%`) instead of sliding fully off-screen.
- Align optically, not geometrically: give the icon side of a button slightly less padding than the text side so the content reads as centered, even though it isn't geometrically.
- Use shadows instead of borders: a layered `box-shadow` reads as a border in both light and dark mode and adapts better over image or colored backgrounds.
- Add an outline to images: a 1px black/white outline at 10% opacity with `outline-offset: -1px` gives images a consistent edge and sense of depth.

## gotchas
- `tabular-nums` changes how some fonts (e.g. Inter) render numerals, not just their width.
