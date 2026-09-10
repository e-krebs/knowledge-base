---
source: https://shrutibalasa.substack.com/p/floating-label-for-input-in-css-22-10-19
fetched: 2026-09-10
published: 2022-10-19
status: fresh
---
A floating label is a `label` element positioned absolutely on top of its `input`, not an input placeholder, and it slides upward when the input is focused. Reach for it when you want a placeholder-like label that stays visible as real text once the field has a value, with no JavaScript.

## how
Wrap the input and its label in a container `div`, then move the label on focus via the sibling combinator:

```css
input:focus + label {
  transform: translateY(-value);
  transition: transform duration ease;
}
```

Add `pointer-events: none` on the label so clicks pass through to the input beneath it. To keep the label elevated once the input holds a value (or after browser autofill), also match:

```css
input:valid + label,
input:-webkit-autofill + label {
  transform: translateY(-value);
}
```

## gotchas
- Without the `:valid`/`:-webkit-autofill` rule, the label overlaps the entered text once the input loses focus with a value in it — this also happens with browser autofill.
- `:valid` only works with a `required` attribute (or another constraint) on the input, or every empty input is valid too.
