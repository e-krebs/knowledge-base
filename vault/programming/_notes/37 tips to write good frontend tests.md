---
source: https://howtotestfrontend.com/resources/how-to-write-good-frontend-tests
fetched: 2026-09-13
published: 2026-01-04
status: fresh
---
A running cheat-sheet of 37 concrete do's and don'ts for keeping RTL/Vitest/Jest test suites readable, fast, and resistant to false positives. Skim it when writing or reviewing a test file to catch the usual smells.

## how
**Structure & clarity**
- Keep unrelated assertions in separate `test()` blocks, not one giant test.
- Test public-facing behavior, not internals (hooks, state management internals).
- Test your own code, not framework/library internals.
- Use nested `describe()` + clear titles so files stay navigable and `.only()`-friendly.
- Hold test files to the same quality bar as production code, with lenience: looser type assertions, some copy/paste, and comments explaining why.
- Comment on how an expected value was derived (never compute it by calling the same function under test).
- Delete tests that structurally can't fail (e.g. asserting on hardcoded, unconditional text).
- No `if`/`else` in tests — an untaken branch can hide a bug — except simple conditionals inside `it.each()`.
- Use descriptive variable names and comments to explain intent, not just what.

**Queries & interactions**
- Query priority: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByDisplayValue` > `getByAltText` > `getByTitle` > `getByTestId` (last resort).
- Don't query by classname/`.querySelector()` — use semantic queries instead.
- Don't assert on classnames (code smell) — assert visibility, enabled state, attributes, or content instead.
- Lean on `getByLabelText()`/`getByRole()` for accessibility — they only pass on properly-marked-up elements.
- Prefer `findBy*` over `waitFor()` + `getBy*` for DOM waits; keep `waitFor()` for non-DOM assertions like a spy being called.
- Use `toBeVisible()` over `toBeInTheDocument()` when visibility (not just DOM presence) matters; for CSS-based hiding, use Playwright/Cypress/Vitest Browser Mode instead.
- Prefer `userEvent` over `fireEvent` — it fires the fuller, more realistic event sequence.

**Mocking & test data**
- Avoid over-mocking; mock only API responses, errors, third-party components, unsupported web APIs, or things tested elsewhere.
- When mocking a module, use `vi.importActual()`/`jest.requireActual()` to override only specific exports, or prefer `vi.spyOn()` for TS typing and easy restore.
- Don't test Redux/Zustand internals — assert on rendered output and user-visible behavior.
- Use fixture/helper factories for mock data instead of hand-rolling objects per test.
- Build render helpers that wrap common context providers to cut boilerplate.
- Don't test your mocks — if a `mockImplementation` reimplements real logic, test that logic separately and simplify the mock.
- Always mock fetch/HTTP calls (fetch mocks or MSW); never make real network requests in tests.
- Build custom matchers via `expect.extend()` for repeated assertion patterns.
- Use unique, descriptive mock values (not `"test-id"` everywhere) so a failure's culprit is obvious.

**Reliability & maintenance**
- Fix flaky tests with near-production-bug priority — otherwise they get ignored and mask real failures.
- Test error states, validation, network failures, and auth failures, not just the happy path.
- Don't overuse snapshots — fine for short error strings, bad for huge objects/DOM; assert specific properties instead.
- Keep tests fast; use `--watch` filtered by filename during development.
- Don't use `toBeDefined()` — it passes for `null`, `''`, and `[]` too; assert the actual expected value.
- In TypeScript, use a specific cast (`as User`) instead of `as any` so typos still error.
- Avoid cross-test leakage: reset mocks in `beforeEach`/`afterEach`, and run tests in random order to catch order-dependent tests.
- Don't hardcode signed tokens (JWTs) without documenting how to regenerate them.
- Test date-handling logic across timezones, not just your own.
- Use fake timers instead of real waits for timeouts/intervals — real delays add up across a suite.
