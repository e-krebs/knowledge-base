## language
📝 [[parallel promises]]
[Promises from the ground up](https://www.joshwcomeau.com/javascript/promises/) — replaces nested callback hell with a flat chain of .then() calls
📝 [[proxies]]
📝 [[how to compose js functions that take multiple parameters]]
📝 [[destructuring with Js generators]]
📝 [[use Maps more & Objects less]]
📝 [[data structures (Map, Set, Stack, Queue, Tree)]]
📝 [[new Set methods]]
📝 [[Object & Map groupBy]]
📝 [[async iteration with Array.fromAsync()]]
📝 [[array methods- toSorted, toReversed, toSpliced|array methods: toSorted, toReversed, toSpliced]]
📝 [[stop turning everything into arrays]]
📝 [[error chaining with Error.cause]]
[structured clone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) — deep-clones circular references and can transfer array buffers instead of copying them
[devalue: JSON.stringify on steroids](https://github.com/sveltejs/devalue) — serializes cycles, dates, maps, bigints and even pending promises safely

## browser apis
📝 [[why fetch does not reject on error response]]
📝 [[AbortController]]
[web workers - multithreading](https://www.smashingmagazine.com/2023/04/potential-web-workers-multithreading-web/) — offload cpu-intensive work to a worker thread, batch postmessage calls to cut communication overhead
[biometric auth](https://stackoverflow.blog/2022/11/16/biometric-authentication-for-web-devs/) — use the standard webauthn navigator.credentials api instead of a custom biometric flow
📝 [[HTML attributes vs DOM properties]]
📝 [[detecting Browser Zoom Changes in JavaScript]]
📝 [[compress an image before upload]]
📝 [[draw regular shapes]]
[Bringing React's ViewTransition to vanilla JS](https://plainvanillaweb.com/blog/articles/2025-06-12-view-transitions/) — queues starttransition calls into one startviewtransition to avoid overlapping route animations
📝 [[faking two-phase view transitions with the navigation api]]
[web features explorer](https://web-platform-dx.github.io/web-features-explorer/) — tracks which web platform features just reached baseline, with rss feeds

## intl
📝 [[Intl.Segmenter to split strings]]
📝 [[Unit Formatting with Intl in JavaScript]]
📝 [[Using Intl.DurationFormat for Localized Durations]]

## dates
[tempo](https://tempo.formkit.com/) — wraps native date and intl.datetimeformat instead of introducing new date primitives
[react spectrum - @internationalized/date](https://react-aria.adobe.com/internationalized/date/) — adds immutable typed dates across 13 calendar systems, inspired by the temporal proposal
[a natural language date parser in javascript](https://github.com/wanasit/chrono) — v2 adds strict and casual parsing modes plus pluggable parser/refiner customization
📝 [[pikaday- date picker|pikaday: date picker]]

## performance
📝 [[Optimizing Javascript for fun and for profit]]

## libraries
[pragmatic drag & drop](https://github.com/atlassian/pragmatic-drag-and-drop) — wraps native browser drag-and-drop into a tiny 4.7kb framework-agnostic toolkit, powers jira
[Javascript image cropper](https://fengyuanchen.github.io/cropperjs/) — extensible via plugins, with components imported on demand to trim bundle size
[wysiwyg markdown editor](https://milkdown.dev/) — plugin-driven, headless, built on prosemirror and remark with y.js real-time collaboration
[Carousel library](https://www.embla-carousel.com/) — plugin-based, ssr-safe slider engine tuned for fluid motion and precise swipe tracking
[parallax Effect for React & JavaScript](https://simpleparallax.com/) — animates plain img tags directly, no background-image hack needed, works with next/image
[SnapDOM - capture HTML to image](https://snapdom.dev/) — preserves fonts, pseudo-elements and shadow dom content, zero dependencies, plugin-based export formats
[Mediabunny - reading, writing, and converting video and audio files](https://mediabunny.dev/) — hardware-accelerated via webcodecs, tree-shakable and faster than ffmpeg.wasm in benchmarks
[overtype - WYSIWYG markdown editor that's a textarea](https://overtype.dev/) — just 91kb, one script tag, keeps native undo/redo and mobile keyboard support
[feedsmith, RSS, etc.](https://feedsmith.dev/) — parses and generates rss, atom, rdf and json feeds, tolerating malformed markup
[motion - animated videos using Canvas API](https://motioncanvas.io/) — animations coded as generator functions in a live-synced editor, no release since february 2025
[Heat Map](https://www.heatjs.com/) — calendar heatmap library with six view types and year-over-year compare
[faker: generate fake testing data](https://fakerjs.dev/) — spans 70+ locales including finance and crypto addresses, now community-maintained
[Apache ECharts - Javascript Visualization Library](https://echarts.apache.org/en/index.html) — progressively renders up to 10m data points with built-in accessibility descriptions

## reads
[build a modern JS framework](https://nolanlawson.com/2023/12/02/lets-learn-how-modern-javascript-frameworks-work-by-building-one/) — post-react frameworks converge on push-based signals and cloned-template dom rendering

## DevX
📝 [[making -this- less annoying|making *this* less annoying]]
[freerange: static @fit checks for layout code](https://github.com/chenglou/freerange) — tracks every number's possible range to catch nan and division bugs
