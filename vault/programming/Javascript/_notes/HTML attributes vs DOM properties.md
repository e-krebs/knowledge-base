---
source: https://jakearchibald.com/2024/attributes-vs-properties/
fetched: 2026-09-11
published: 2024-04-24
status: fresh
---
Attributes and properties are fundamentally different things: the same name can hold different values on each. Reach for this when debugging why a framework's templating syntax doesn't behave as expected, or when writing vanilla DOM code that needs to know which one actually drives an element's behaviour.

## how

### HTML serialisation
Attributes exist in HTML and the DOM; properties are DOM-only. Only attribute changes show up in `outerHTML` or devtools' elements panel.

```js
const div = document.createElement('div');
div.setAttribute('foo', 'bar');
div.hello = 'world';
console.log(div.outerHTML); // '<div foo="bar"></div>'
```

### Value types
Attribute values are always strings; properties can be any type.

```js
div.setAttribute('foo', { foo: 'bar' });
console.log(typeof div.getAttribute('foo')); // 'string'
div.hello = { foo: 'bar' };
console.log(typeof div.hello); // 'object'
```

### Case sensitivity
Attribute names are case-insensitive; property names are case-sensitive. Attribute *values* stay case-sensitive.

### Reflection
Some properties "reflect" an attribute of the same purpose: setting/reading the property updates/reads the attribute (e.g. `div.id`). This only happens for spec-defined pairs — an arbitrary attribute like `foo` has no reflecting `.foo` property.

### Naming differences
A reflecting property sometimes has a different name than the attribute it reflects: `el.crossOrigin` reflects `crossorigin`, `el.ariaLabel` reflects `aria-label`, `el.className` reflects `class`, `el.htmlFor` reflects `for` (the last two dodge old JS reserved words).

### Validation, type coercion, and defaults
Properties apply validation and defaults that attributes skip.

```js
input.type = 'foo';
console.log(input.getAttribute('type')); // 'foo'
console.log(input.type); // 'text' (invalid value coerced back to default)
```

Boolean-reflecting properties (`details.open`) coerce any truthy value to `true`/`false` on write, and read the attribute's mere presence.

### `value` on input fields
`value` the property does **not** reflect `value` the attribute — `defaultValue` does. Before the property is ever set, `value` defers to `defaultValue`; once set (by JS or user input), it switches to an internal, independent value until the form resets.

### How frameworks handle the difference
Preact and Vue prefer setting the property when `propName in element`, falling back to an attribute. React does the reverse — attribute by default, property only for a fixed allow-list — which is why custom elements' property-only APIs don't work in plain React. Lit keeps both, using a `.prop` prefix to force a property set.

## gotchas
- `value`/`defaultValue` is the sharpest trap in this whole model — treating them as reflecting pairs silently loses the "current state vs configured default" distinction.
- `<details>`/`<dialog>`'s `open` attribute is self-mutated by the browser on user interaction, breaking the "attributes are for configuration only" assumption other elements follow.
