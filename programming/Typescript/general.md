## Types
📝 [[narrow function parameters]]
📝 [[types are sets]]
📝 [[Method Shorthand Syntax Considered Harmful]]
[oRPC - Typesafe APIs Made Simple](https://orpc.dev/blog/v1-announcement) — v1 release claims faster typechecking and smaller bundles than tRPC

## typesafe string literal/router
📝 [[Extract parameter types from string literal types with TypeScript]]
[typesafe router (react)](https://speakerdeck.com/zoontek/advanced-typescript-how-we-made-our-router-typesafe) — conference talk deriving route param types via template literals and infer

## enum
[use cases and alternatives](https://2ality.com/2025/01/typescript-enum-patterns.html) — concludes unions and object literals beat enums in nearly every scenario
📝 [[5.8 --erasableSyntaxOnly to disable enums]]

## validation libraries
[standard schema](https://standardschema.dev/) — shared validation interface so tools work across zod valibot and others
[Amplify Zod](https://github.com/alii/azs) — attaches custom methods directly onto zod-parsed objects for oop-style access
[validate data (zod alternative)](https://valibot.dev/) — modular tree-shakable validator with per-function imports
[data validation server-side](https://vinejs.dev/docs/introduction) — node-only form validator claiming five to ten times zod's speed
[ts-to-zod](https://github.com/fabien0102/ts-to-zod) — generates zod schemas from ts types, honoring jsdoc validation tags
[write you own Zod](https://zackoverflow.dev/writing/write-your-own-zod/) — walks through building a tiny zod clone to demystify how it works
📝 [[reducing zod's memory footprint]]

## Tips
📝 [[Omit on Union]]
📝 [[number range]]
📝 [[Wrangling tuple types]]
📝 [[typescript tips everyone should know]]
[fp-filters - A curated collection of 130+ common-use filter functions](https://github.com/Oaxoa/fp-filters) — tree-shakable one-liners with zero deps and built-in negated aliases

## tooling
📝 [[intro to TSConfig for js developers]]
📝 [[Live types in a TypeScript monorepo]]
[AST viewer](https://ts-ast-viewer.com/) — paste typescript source and click through the parsed syntax tree live
[markcheck – test Markdown code blocks](https://github.com/rauschma/markcheck) — runs the code blocks of a markdown file, directives hidden in html comments

## CLI
📝 [[Building a CLI from scratch with TypeScript and oclif]]
[ink: React for interactive command-line apps](https://github.com/vadimdemedes/ink) — powers claude code and other real cli tools via flexbox layout
[ANSI color library for terminals, CI and Chromium-based browser consoles](https://github.com/webdiscus/ansis) — a much smaller drop-in chalk replacement with faster chained styles

## libraries
[path to regex](https://github.com/pillarjs/path-to-regexp) — also compiles params back into a path string, not just matching
[replaces spread: default composer](https://aralroca.com/blog/default-composer) — recurses into nested fields that spread and object.assign skip entirely
[default-composer GitHub](https://github.com/aralroca/default-composer) — lets you customize which values count as defaultable and array merging
[Effect: helps to handle synchronous & asynchronous programs/tasks](https://effect.website/) — tracks errors and dependencies right in the type signature itself
[object hashing, serialization and comparison utils](https://github.com/unjs/ohash) — sha-256 hashing plus a nested diff between two objects' contents
[Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) — 7kb zero-dependency database toolkit targeting serverless postgres mysql and sqlite

## runtimes
[Andromeda](https://tryandromeda.dev/) — rust-built js runtime with gpu-accelerated canvas and a built-in http server
