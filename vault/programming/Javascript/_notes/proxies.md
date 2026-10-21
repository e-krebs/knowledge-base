---
source: https://blog.openreplay.com/an-introduction-to-javascript-proxies/
fetched: 2026-09-11
published: 2023-05-30
status: fresh
---
A `Proxy` sits between an object and the code that uses it, letting you intercept operations like get/set/delete through handler "trap" functions instead of touching the object directly. Reach for it for metaprogramming — validation, logging, or two-way data binding — anywhere you'd otherwise need the consuming code to cooperate with invariants the object can't enforce on its own.

## how
Wrap a `target` object and a `handler` (whose trap functions receive the same arguments as the matching `Reflect` method, so `Reflect` gives you the default behavior for free):

```js
const handler = {
  set(target, property, value) {
    if (!Reflect.has(target, property) || typeof Reflect.get(target, property) !== 'number') {
      throw new ReferenceError(`Invalid property ${property}`);
    }
    if (typeof value !== 'number' || isNaN(value)) {
      throw new TypeError(`Invalid value ${value}`);
    }
    return Reflect.set(...arguments);
  },
  deleteProperty(target, property) {
    throw new ReferenceError(`Cannot delete ${property}`);
  },
  get(target, property) {
    if (!Reflect.has(target, property)) {
      throw new ReferenceError(`Invalid property ${property}`);
    }
    return Reflect.get(...arguments);
  }
};

const proxy = new Proxy(target, handler);
```

Beyond `get`/`set`, traps also exist for `construct`, `defineProperty`, `deleteProperty`, `apply`, `has`, `ownKeys`, `isExtensible`, `preventExtensions`, `getOwnPropertyDescriptor`, `getPrototypeOf`, and `setPrototypeOf` — each mirroring the object operation it intercepts.

## gotchas
- There is no way to polyfill or transpile Proxy down to ES5, so it's a hard blocker for Internet Explorer 11 support.
- For simple type validation, consider TypeScript instead — a Proxy's runtime checks are for cases TypeScript can't cover.
