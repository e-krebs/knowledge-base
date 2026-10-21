---
source: https://www.smashingmagazine.com/2024/04/iconography-design-systems-troubleshooting-maintenance/
fetched: 2026-09-13
published: 2024-04-03
status: fresh
---
Iconography is the atom-level layer of a design system, and it drifts out of consistency fastest because icons get added by different people over time. This is a working set of grid, sizing, weight and naming rules plus a troubleshooting checklist for taming an icon set that has already gone inconsistent. Reach for it when starting an icon library from scratch, or when auditing one that has become a mishmash of styles and sizes.

## how
Grid and sizing rules:
- Use a 24px grid for standard icons, 44px for larger ones.
- Each grid has a padding area (2px) and a live area (20px) that the icon body must stay inside.
- The live area shape (circular, square, horizontal- or vertical-rectangular) depends on the icon's content — decide it before drawing.
- 24px is the primary/golden-standard size (Google Material Design), covering up to 90% of icons.
- Resize by 4px steps when an icon must deviate (24 → 20 → 16 → 12, or 24 → 28 → 32).

Stroke and fill rules:
- Test several outline weights before committing to one; fine-detail icons are the most sensitive to this.
- Use one unified outline weight for every icon in the set (the author settles on 2pt) — mixed weights are hard to write guidelines for.
- Offer both a solid and an outline variant only where the solid variant actually improves recognition/accessibility.
- Keep corner, counter-stroke and stroke-terminal treatment unified across the set (icon "anatomy").

Naming and status tracking:
- Group icons into semantic sections (e.g. Transport → Ground Transport / Air Transport), not arbitrary buckets.
- Attach a description to each icon: tags (search keywords), usage (what it's for), group name, and a link to the design/doc that uses it.
- Color-code icon names by production status while iterating: green = finished, orange = needs improvement, red cross = needs deleting/redrawing.
- Keep the non-rasterised source of every icon on its own page/hierarchy, so a matching icon can be drawn later from the same vector forms.
- Apply "Outline Stroke" before turning an icon into a component — this is what makes later color changes and scaling reliable.
- Name icon colors by interaction state (primary, hover, disabled), not by hex or vibe.

Troubleshooting checklist for an already-inconsistent set:
1. Put every icon on one layout to see repeated patterns and outliers at a glance.
2. Split icons into subcategories (e.g. by size/style: regular, detailed, illustrations).
3. Write creation guidelines per subcategory, one Figma page per type, named after the base size.
4. Re-apply the grid/weight/fill rules above to normalize each subcategory.
5. Assign one designer as the icon-system owner to catch edge cases the written rules miss.

## gotchas
- Sanity check before shipping a new icon: drop it into the interface next to existing icons and see if it visually matches.
- Most icons lacking a source file is what makes an inconsistent set hard to fix quickly — keep source files from day one.
