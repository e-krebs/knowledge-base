---
source: https://shrutibalasa.substack.com/p/mastering-color-shades-in-css-with-variables
fetched: 2026-09-10
published: 2023-03-29
status: stale
---
Storing a color's hue, saturation and lightness as separate CSS custom properties lets you derive lighter or darker shades by overriding just `--lightness`, instead of hardcoding a full palette of hex values. Reach for it when a component, such as a button, needs consistent shade variants without maintaining several separate color declarations.

## how
```css
:root {
  --hue: 190;
  --saturation: 90%;
  --lightness: 40%;
}

.button {
  background-color: hsl(var(--hue), var(--saturation), var(--lightness));
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.button.lighter {
  --lightness: 65%;
}

.button.darker {
  --lightness: 32%;
}
```
Overriding `--lightness` alone on a modifier class produces a shade variant while hue and saturation stay constant.

## gotchas
- Superseded by relative color syntax (`hsl(from var(--base) h s calc(l - 10%))`), which derives shades from one base color natively; it is not yet Baseline widely available (projected 2027-03-16), so this manual custom-property approach is still the safe default today.
