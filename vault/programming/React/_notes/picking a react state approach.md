---
source: https://x.com/housecor/status/1799435036736778364
fetched: 2026-09-11
published: 2024-06-08
status: fresh
---
With 30+ ways to hold state in React, this decision tree picks one by asking, in order, whether the state must be shareable via URL, whether it's fetched, whether more than one component needs it, and whether it's form input — narrowing to a small set of concrete techniques at each step.

## how
1. Shareable via URL? Yes → URL state. No → next.
2. Fetched? Yes, used by multiple components → remote state (Tanstack Query, SWR, RTK Query, Apollo). Yes, used by one → route state (React Router loader, Tanstack Router loader). No → next.
3. Used by multiple components? Yes → prop drill it, or reach for global state (localStorage, cookie, IndexedDB, Redux, Zustand, Recoil, Jotai, Valtio, XState). No → next.
4. Is it form input? Yes → form state (useState, useReducer, Formik, React Hook Form, Tanstack Form, XState). No → plain state (useState, useReducer, XState).

## gotchas
- this decision list is a transcription of the tweet's image, not the tweet text itself
