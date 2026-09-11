---
source: https://daverupert.com/2025/01/like-this-and-like-that-and-like-this-and-uh
fetched: 2026-09-11
published: 2025-01-15
status: fresh
---
VS Code lets you override the color of one specific syntax token — like the repetitive `this` keyword in web-components-heavy code — by targeting its TextMate scope in `editor.tokenColorCustomizations`, without forking your whole color theme. Reach for it when a single recurring token is visually noisy but a full custom theme is overkill.

## how
```json
"editor.tokenColorCustomizations": {
  "textMateRules": [
    {
      "scope": "variable.language.this",
      "settings": { "foreground": "#b0b0b0" }
    }
  ]
}
```

## gotchas
- VS Code's docs for which scope name to target are described as "a bit opaque" — expect to hunt for the right scope for other tokens.
- The same `textMateRules` array can dim other noisy tokens too (e.g. comments), one rule per scope.
