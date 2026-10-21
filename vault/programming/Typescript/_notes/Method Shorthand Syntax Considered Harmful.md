---
source: https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
fetched: 2026-09-10
status: fresh
---
TypeScript offers two syntaxes for annotating functions on object types — method shorthand (`foo(): void`) and object property (`foo: () => void`). The method shorthand is bivariant, so it lets an implementation's parameter be narrower than the interface declares, a mismatch the property syntax rejects. Reach for the property syntax whenever an interface method could be implemented with an unusually narrow parameter type.

## how
Property syntax is safe; method shorthand is bivariant and unsafe:
```typescript
interface Dog {
  barkAt: (dog: Dog) => void; // property syntax: safe
}
```
```typescript
interface Dog {
  barkAt(dog: Dog): void; // method shorthand: bivariant, unsafe
}
```
Enforce the property style with `@typescript-eslint/method-signature-style`:
```json
{
  "rules": {
    "@typescript-eslint/method-signature-style": ["error", "property"]
  }
}
```
Arrow-function vs. function-declaration style is unrelated to which annotation syntax is used.

## gotchas
- Method shorthand accepts a narrower callback parameter and still type-checks, but crashes at runtime: implementing `barkAt(smallDog: SmallDog)` and calling it through a plain `Dog` reference blows up when the body calls `smallDog.whimper()`.
- Bivariance is intentional in TypeScript but, per the source, rarely serves a practical purpose.
