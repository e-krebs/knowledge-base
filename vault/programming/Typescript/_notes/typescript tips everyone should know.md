---
source: https://github.com/AllThingsSmitty/typescript-tips-everyone-should-know
fetched: 2026-09-10
status: fresh
---
A curated collection of practical TypeScript patterns that improve safety, readability, maintainability, and developer experience. Most of these are small individually, but together they change how TypeScript code feels day to day.

## how
### 1. Prefer `unknown` over `any`
`unknown` forces you to prove what a value is before using it; `any` skips the type system entirely, allowing unsafe operations to spread through your code.
```ts
function parse(data: unknown) { if (typeof data === "string") return data.toUpperCase(); }
```
### 2. Let type inference do the work
The best TypeScript code often relies on inference instead of repeating information the compiler already knows. Over-annotation widens types, hurts inference, and creates maintenance overhead.
```ts
const name = "Ada";
```
### 3. Prefer `satisfies` over `as`
`satisfies` checks that a value matches a type while preserving its inferred type. Reserve `as` for cases where you're expressing information the compiler genuinely can't infer.
```ts
const routes = { home: "/", about: "/about" } satisfies Record<string, string>;
```
### 4. Derive types from values
This creates a single source of truth: if the runtime values change, the type updates automatically, eliminating duplication and preventing the two from drifting apart.
```ts
const roles = ["admin", "user", "guest"] as const;
type Role = (typeof roles)[number];
```
### 5. Make invalid states impossible to represent
Discriminated unions scale much better than loose optional property blobs because invalid states simply can't be represented.
```ts
type State = { status: "loading" } | { status: "success"; data: User } | { status: "error"; error: Error };
```
### 6. Use exhaustive checks with `never`
Once states are modeled as a discriminated union, exhaustiveness checking ensures every case is handled; add a new state and the compiler points out every place that needs updating.
```ts
switch (state.status) {
  case "loading": return "Loading...";
  case "success": return state.data;
  case "error": throw state.error;
  default: { const exhaustive: never = state; return exhaustive; }
}
```
### 7. Use `as const` for constants
A small addition that meaningfully improves inference for configuration objects and constants — without it `mode` becomes `string`; with it, `'dark'`.
```ts
const theme = { mode: "dark" } as const;
```
### 8. Use type predicates
Type predicates let a runtime check teach the compiler something, which is especially useful around APIs and external input boundaries.
```ts
function isUser(value: unknown): value is User { return typeof value === "object" && value !== null && "id" in value; }
```
### 9. Build new types from existing types
Think in transformations instead of duplication; learn `Pick`, `Omit`, `Partial`, `Required`, and indexed access types.
```ts
type UserPreview = Pick<User, "id" | "name">;
```
### 10. Validate external data at runtime
TypeScript does not validate API responses — every API response, form submission, environment variable, JSON file, and user input is an untrusted boundary.
```ts
const UserSchema = z.object({ id: z.string(), name: z.string() });
```
### 11. Avoid `enum` in most cases
In most application code, literal unions are easier to refactor, serialize, and work with than enums.
```ts
const roles = ["admin", "user"] as const;
```
### 12. Prefer inferable generics
Great TypeScript APIs rarely require manual generic arguments — design them so the type infers from what callers pass in. If callers are constantly writing `<SomeType>`, that's usually a sign the API could do more of the work.
```ts
getData("/api/user", userSchema);
```
### 13. Enable strict compiler options
`strict` is the baseline; the other two options aren't covered by it and catch a real class of bugs that strict alone misses.
```json
{ "strict": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true }
```
### 14. Learn template literal types
Underused, and worth learning — excellent for routes, event names, CSS utilities, design systems, and query keys.
```ts
type Route = `/api/${string}`;
```
### 15. Type safety != runtime safety
This compiles but may still fail at runtime: TypeScript improves correctness, but it isn't a runtime safety net.
```ts
const user = (await response.json()) as User;
```

## gotchas
- Enums still have valid use cases — they're just often unnecessary.
- Reserve `as` for cases where you're expressing information the compiler genuinely can't infer.
- TypeScript does not validate external data, does not guarantee good architecture, and does not eliminate runtime bugs.
