---
source: https://www.totaltypescript.com/strongly-type-useref-with-elementref
fetched: 2026-09-11
status: stale
---
`ElementRef` infers the DOM element type a ref should hold, from a JSX tag name or from a `forwardRef` component, instead of you spelling out the element type by hand. Reach for it when you're unsure which underlying DOM node a custom component forwards its ref to.

## how
```typescript
// verbose
const audioRef = useRef<HTMLAudioElement>(null);

// with ElementRef
import { useRef, ElementRef } from "react";
const audioRef = useRef<ElementRef<"audio">>(null);
```

With a `forwardRef` custom component, extract the forwarded element's type automatically instead of guessing:

```typescript
import { OtherComponent } from "./other-component";
import { useRef, ElementRef } from "react";

type OtherComponentRef = ElementRef<typeof OtherComponent>;

const Component = () => {
  const ref = useRef<OtherComponentRef>(null);
  return <OtherComponent ref={ref}>Hello</OtherComponent>;
};
```

## gotchas
- Superseded: React 19 (stable Dec 2024) deprecated `ElementRef` in favor of `React.ComponentRef<T>`, which shadcn/ui, Radix, and React Native have since migrated to — this trick as written applies to React 18 and below.
