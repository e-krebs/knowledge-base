---
source: https://sergiodxa.com/tutorials/simplify-component-imports-with-typescript-namespaces
fetched: 2026-09-11
status: stale
---
A TypeScript `namespace` lets a component and its prop types share one export, so importing the component also brings in `Component.Props` (and any other nested types) without a separate named import for the props type or a rename to avoid clashing with another component's `Props`.

## how
```ts
export namespace Button {
  export type Variant = "solid" | "ghost" | "outline";
  export type Size = "xs" | "sm" | "md" | "lg" | "xl";
  export type Props = {
    variant: Variant;
    size: Size;
  }
}

export function Button(props: Button.Props) { /* ... */ }
```
```ts
import { Button } from "./button";

export namespace BetterButton {
  export type Props = Button.Props & { /* ... */ };
}

export function BetterButton(props: BetterButton.Props) { /* ... */ }
```
Importing just `Button` gives you both the component and `Button.Props`, `Button.Variant`, `Button.Size`.

## gotchas
- superseded as a default: `@typescript-eslint`'s `no-namespace` rule (part of its recommended config) discourages namespaces in ESM codebases; teams now reach for the dot-notation compound-export pattern (attaching `Props` via a const object) for the same single-import ergonomics without tripping that rule
