---
source: https://eslint.org/blog/2025/01/differences-between-eslint-and-typescript/
fetched: 2026-09-13
published: 2025-01-28
status: fresh
---

ESLint is a linter and TypeScript is a type checker: they perform similar but different static analysis. TypeScript ensures values are used only in ways allowed by their type, reporting known errors with no room for subjective preference; ESLint catches likely defects and enforces best practices via individually configurable rules. As the article puts it, "TypeScript enforces what you can do, whereas ESLint enforces what you should do."

## how
For a TypeScript project, enable in the ESLint config the `js.configs.recommended` config plus `tseslint.configs.recommended` from typescript-eslint (which disables core ESLint rules unhelpful with TypeScript but keeps the useful ones), and turn on `strict` mode in `tsconfig.json` to catch as many type-safety issues as possible.

A lint rule like `no-fallthrough` catches a defect that's type-safe and so invisible to TypeScript, a missing `break` in a `switch`:

```ts
function logFruit(value: "apple" | "banana" | "cherry") {
    switch (value) {
        case "banana":
            console.log("🍌");
        // eslint(no-fallthrough):
        // Expected a 'break' statement before 'case'.
        case "cherry":
            console.log("🍒");
            break;
    }
}
```

For unused locals and parameters, disable TypeScript's `noUnusedLocals` and `noUnusedParameters` compiler options and rely on `no-unused-vars` (`@typescript-eslint/no-unused-vars` in TS code) instead: the compiler options are hardcoded to ignore names starting with `_` and can't be tuned, while the lint rule is configurable, e.g.:

```ts
/* eslint @typescript-eslint/no-unused-vars: ["error", { "args": "all", "argsIgnorePattern": "" }] */
registerCallback((_, message) => console.log(message));
//                ~
// eslint(@typescript-eslint/no-unused-vars):
// '_' is declared but never used.
```

Type-aware ("type checked") ESLint rules opt into type information across files, which plain per-file linting can't use — e.g. `@typescript-eslint/no-for-in-array` flags a `for...in` over an array (type-safe, so TypeScript won't flag it) even when the array comes from another file. This costs roughly type-checking speed.

Granular extensibility is ESLint's edge: a rule can be turned off per line, per file, or project-wide, and plugins (e.g. `eslint-plugin-jsx-a11y`) add new rules. TypeScript's compiler options are project-wide only, with no per-file variation.

## gotchas
- ESLint and TypeScript overlap on some defects that straddle "best practice" and "type safety" — the article calls that overlap fine, not a conflict.
- TypeScript 7.0 (July 2026, Go-based compiler) shipped without a stable programmatic API, so typescript-eslint typed linting does not run on it yet: the fix waits for TypeScript 7.1, pin TypeScript 6.x for ESLint meanwhile.
