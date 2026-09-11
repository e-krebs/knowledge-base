## composition
📝 [[parents & owners]]
📝 [[UI composition]]
[recursive filetree](https://buildui.com/recipes/recursive-filetree) — ships copy-paste code plus a framer motion animated expand-collapse variant
📝 [[the nuance of React rendering behaviour as it relates to children]]
📝 [[render multiple context providers at once]]
📝 [[detect nested components]]

## state management
[signal](https://preactjs.com/blog/signal-boosting/) — explains how preact signals use doubly-linked lists for fast dependency tracking
📝 [[Zustand]]
[Introducing Zustand (State Management)](https://frontendmasters.com/blog/introducing-zustand/) — compares zustand selectors against react context to show fewer re-renders
[fluent-state](https://www.npmjs.com/package/fluent-state) — tiny proxy hook merges state, computed values and effects into one fluent api
📝 [[picking a react state approach]]
📝 [[Preserving and Resetting State in React (don't if-return)|Preserving and Resetting State in React (don't if/return)]]
📝 [[Conditional React hooks pattern]]

## data fetching
[How to fetch data in React with performance in mind](https://www.developerway.com/posts/how-to-fetch-data-in-react) — prioritizes waterfall fixes over library choice, though its suspense caveat reads dated now
[swr](https://swr.vercel.app/) — vercel's data-fetching hook that caches, revalidates in background and dedupes requests
📝 [[toggle + request & optimistic update (useMutation)]]
📝 [[Fetching data in React- the case of lost Promises|Fetching data in React: the case of lost Promises]]
📝 [[data fetching patterns in SPA]]
📝 [[useEffect +Async]]
📝 [[Composable streaming with Suspense]]

## react router
[complete guide to React router](https://fireship.dev/react-router-tutorial) — covers pre-data-router basics now superseded by react-router's loader and action data apis
📝 [[location aware sidebar with React router]]
[typesafe React router in 500 lines](https://sinja.io/blog/build-typesafe-react-router-from-scratch) — walks through hand-rolling type-level route params with hotscript and regexparam
[react router middleware](https://reactrouter.com/how-to/middleware) — explains the nested next() chain and context api for server vs client middleware
📝 [[Use Action Routes in React Router]]

## rendering & performance
📝 [[about memoization]]
📝 [[performant React apps with Context]]
📝 [[A faster React.memo]]
📝 [[beyond React.memo- Smarter Ways to Optimize Performance|beyond React.memo: Smarter Ways to Optimize Performance]]
[profiler](https://react.dev/reference/react/Profiler) — onrender callback exposes phase and actual vs baseline render duration per commit
[captureOwnerStack](https://react.dev/reference/react/captureOwnerStack) — dev-only api for building a custom error overlay with the owner stack
[you-might-not-need-an-effect](https://github.com/nickjvandyke/eslint-plugin-react-you-might-not-need-an-effect) — eslint rules catch derived state, chained updates and effects misused as handlers
[why did you render](https://github.com/welldone-software/why-did-you-render) — reports which parent and prop caused an avoidable re-render, incompatible with react compiler

## animations & transitions
📝 [[a trick to improve exit animations]]
📝 [[view transitions for images and titles]]
📝 [[temporary highlight]]
[iOS-like modal with react-aria-components & framer-motion](https://codesandbox.io/s/quirky-tharp-or0qip?file=/src/App.js) — runnable code sample pairing framer-motion animation with react-aria-components for the modal
[build.ui recipes](https://buildui.com/recipes) — index of 28+ animated ui recipes, each with copy-paste code included

## typescript
📝 [[Simplify Component Imports with TypeScript Namespaces]]
📝 [[Strongly Type useRef with ElementRef]]

## tips
📝 [[open a modal dialog with the invoker commands api]]
[Unlocking Web Workers with React: A Step-by-Step Guide](https://www.rahuljuliato.com/posts/react-workers) — builds up from a single worker to queued and cross-tab shared workers
[React.StrictMode](https://www.youtube.com/watch?v=1UOAI7pFDek) — sam selikoff explains why strict mode double-invokes your code on purpose

## tools & libraries
[react charts](https://www.react-graph-gallery.com/) — organizes d3-based chart recipes by the data-to-viz taxonomy, still actively updated
[server component for syntax highlighting](https://bright.codehike.org/) — zero-bundle-cost rsc code highlighter, unreleased since npm 1.0.0 in dec 2024
[useHooks](https://usehooks.com/) — packs 54 server-safe hooks from ui.dev across storage, dom, timing and device apis
[react google maps](https://visgl.github.io/react-google-maps/) — fully controlled reactive wrapper from the vis.gl webgl visualization suite
[plate - text editor](https://platejs.org/) — framework of composable plugins for building your own rich-text editor, ai-ready
📝 [[color picker]]
📝 [[intersection observer with React]]
[react print pdf](https://github.com/OnedocLabs/react-print-pdf) — renamed to @fileforge/react-print but unreleased since sep 2024, both equally stale
[semantic autocomplete](https://github.com/Mihaiii/semantic-autocomplete) — ranks results by on-device ml embeddings for mui autocomplete, quiet since aug 2024
[shadcn charts](https://ui.shadcn.com/charts/area) — copy-paste recharts variants across area, bar, line, pie, radar and radial types
[dotUI UI components](https://dotui.org/) — style editor that exports your own react aria plus tailwind components as code
[frimousse (emoji picker)](https://frimousse.liveblocks.io/) — unstyled composable parts with a virtualized list, installable as a shadcn component
[a collection of dependency-free React hooks](https://www.novajs.dev/) — installs via cli or vs code extension, not just copy-paste, zero deps
[react ts form (zod-based)](https://github.com/iway1/react-ts-form) — generates typesafe forms from zod via react-hook-form, unreleased since 2022
[glow on hover (with react)](https://github.com/codaworks/react-glow) — clones children into a mouse-tracked gradient mask, unreleased since jan 2024

## design systems
[France State](https://react-dsfr-components.etalab.studio/) — french state design-system components now live at the storybook root, npm sep 2026
[react-aria (styling guide)](https://react-aria.adobe.com/styling) — styles via data attributes, render props and slots, not just classnames
[react-aria-components client side routing](https://react-aria.adobe.com/frameworks) — framework setup guide, RouterProvider hands link navigation to your router
[react-aria examples](https://react-aria.adobe.com/examples/) — thin index linking to runnable component examples, no prose or code shown
[radix UI](https://www.radix-ui.com/) — wraps prebuilt themeable primitives in a single theme provider, zero config setup
[shadcdn ui](https://ui.shadcn.com/) — ships components as copy-in code you own, not an npm dependency
[components for interactive math](https://mafs.dev/) — declarative components for animated, interactive math visualizations you build with code
[neobrutalism](https://www.neobrutalism.dev/) — shadcn-based neobrutalist styling, copy-paste cli install, wai-aria compliant out of the box

## frameworks
[Preact vs. Svelte](https://blog.sentry.io/preact-or-svelte-an-embedded-widget-use-case/) — sentry engineers picked preact over smaller svelte for react-familiar maintainability
[Rari: Performance-first React framework powered by Rust](https://rari.build/) — runs rsc rendering, routing and http serving inside one embedded rust v8 runtime
