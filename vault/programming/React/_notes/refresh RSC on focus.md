---
source: https://buildui.com/recipes/refresh-react-server-component-on-focus
fetched: 2026-09-13
status: fresh
---
A `RefreshOnFocus` client component calls `useRouter().refresh()` whenever the browser window regains focus, forcing a Next.js Server Component to re-fetch and re-render with fresh data. Drop it anywhere inside a server component's tree when a page should catch up automatically after the user tabs back in, without wiring up polling or a manual refresh button.

## how
```tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RefreshOnFocus() {
  const { refresh } = useRouter();
  useEffect(() => {
    const onFocus = () => { refresh(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);
  return null;
}
```

Usage inside a server component:
```tsx
import { RefreshOnFocus } from "./refresh-on-focus";

export default function Home() {
  let date = new Date();
  return (
    <div>
      <p>This component was rendered at {date.toString()}</p>
      <RefreshOnFocus />
    </div>
  );
}
```

## gotchas
- A page under `"use cache"` (Next.js cache components) also needs `revalidateTag` or `updateTag`, `router.refresh()` alone does not bust that cache.
