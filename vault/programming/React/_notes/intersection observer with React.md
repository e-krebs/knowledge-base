---
source: https://www.builder.io/blog/react-intersection-observer
fetched: 2026-09-11
published: 2024-02-01
status: fresh
---
The `react-intersection-observer` package wraps the native `IntersectionObserver` API in a React-friendly hook and component, for detecting when an element enters or leaves the viewport — useful for scroll-triggered reveal animations and for tracking which section of a page is currently in view (e.g. an active-link nav highlight). Reach for the `useInView` hook for a single tracked element, and the `InView` component when you need the same tracking repeated over a list without calling the hook N times.

## how
Reveal a nav once a section wrapper scrolls into view:

```jsx
import { useInView } from "react-intersection-observer";

const { ref, inView } = useInView({ threshold: 0.2 });

<div id="section-wrapper" ref={ref}>{/* sections */}</div>
<nav className={`... ${
  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-100%]"
}`}>{/* nav links */}</nav>
```

Track which of several sections is currently visible with the `InView` component instead of one hook per section:

```jsx
import { InView } from "react-intersection-observer";

const setInView = (inView, entry) => {
  if (inView) setVisibleSection(entry.target.getAttribute("id"));
};

<InView onChange={setInView} threshold={0.8} key={section}>
  {({ ref }) => (
    <div id={section} ref={ref}>
      {section}
    </div>
  )}
</InView>
```

Then drive styling (width, highlight color, etc.) off the `visibleSection` state.

## gotchas
- `IntersectionObserver` itself is Baseline widely available (native since Safari 12.1), and `react-intersection-observer` remains actively maintained in 2026, with no native React hook replacing this `useInView` pattern.
