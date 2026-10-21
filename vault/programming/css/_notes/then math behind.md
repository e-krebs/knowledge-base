---
source: https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/
fetched: 2026-09-10
published: 2022-10-26
status: fresh
---
Nesting two rounded elements with the same `border-radius` leaves an awkward visual gap, because each corner behaves like a small circle and identical radii don't sit concentrically once padding separates them. The fix is computing the inner radius from the outer radius minus the padding (gap) between the two elements.

## how
The core equation:
```
outerRadius - gap = innerRadius
```
Expressed with `calc()`:
```css
--outer-radius: 1em;
--padding: 0.5em;
--inner-radius: calc(var(--outer-radius) - var(--padding));
```
- Each corner is treated like a small circle.
- The difference between the two circles' radii is exactly the gap between the outer and inner corners.
- Apply `--inner-radius` to the nested element's `border-radius`, keeping `--outer-radius` on its parent.

## gotchas
- No settled convention yet for storing this in a design system — the author currently favors computing the inner radius dynamically with `calc()` over hand-picking separate border-radius tokens per nesting level.
