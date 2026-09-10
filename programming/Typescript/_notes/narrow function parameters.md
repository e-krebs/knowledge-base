---
source: https://www.learningtypescript.com/articles/narrowing-function-parameters-with-rests-and-tuples
fetched: 2026-09-10
published: 2023-10-31
status: fresh
---
When a function takes a discriminant (`fruit: "apple" | "banana"`) and a second parameter whose type depends on it, a plain union signature won't catch a mismatched call, and overloads or generics fix the call site but still force an `as` cast inside the implementation. Reach for rest + tuple destructuring when the implementation itself should narrow the dependent parameter with no casts.

## how
Collect the parameters into a tuple union via a rest parameter, so TypeScript narrows both tuple elements together:
```typescript
type FruitAndInfo = ["apple", AppleInfo] | ["banana", BananaInfo];

function logFruitTuple(...[fruit, info]: FruitAndInfo) {
  switch (fruit) {
    case "apple":
      console.log(`My apple's color is ${info.color}.`); // no cast needed
      break;
    case "banana":
      console.log(`My banana's curvature is ${info.curvature}.`);
      break;
  }
}

logFruitTuple("apple", { color: "green" }); // Ok
logFruitTuple("banana", { color: "green" }); // Error
```
Name the tuple slots for editor hints:
```typescript
type FruitAndInfo =
  | [fruit: "apple", info: AppleInfo]
  | [fruit: "banana", info: BananaInfo];
```
A same-shape alternative with more conventional syntax gets the same narrowing via a single discriminated-union object parameter:
```typescript
function logFruit({ fruit, info }: { fruit: "apple"; info: AppleInfo } | { fruit: "banana"; info: BananaInfo }) {
  // fruit/info narrow together here too
}
```

## gotchas
- The rest-tuple syntax is powerful but unfamiliar-looking; the source's own advice is to weigh it against readability, quoting "debugging is twice as hard as writing the code in the first place."
