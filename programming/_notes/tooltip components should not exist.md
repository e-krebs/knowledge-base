---
source: https://tkdodo.eu/blog/tooltip-components-should-not-exist
fetched: 2026-09-13
published: 2025-11-17
status: stale
---
A design system's low-level `<Tooltip>` component gets misused almost by definition — wrapped around non-interactive elements that never receive focus, or slapped onto arbitrary text — so the fix is to stop exposing `<Tooltip>` itself and instead expose higher-level pattern components that bake in correct keyboard/focus handling. Reach for this when a design system is deciding what its public tooltip API should look like.

## how
The failure mode: Material UI's basic tooltip example works when wrapping an interactive `<IconButton>`, but the same API silently breaks accessibility when wrapped around a non-interactive element like an icon or badge — it still shows on hover, never on focus, because the wrapped element can't receive focus:

```jsx
<Tooltip title="Home">
  <IconHome />
</Tooltip>

<Tooltip title="Unread Mails">
  <Badge badgeContent={4} color="primary">
    <IconMail color="action" />
  </Badge>
</Tooltip>
```

React Aria's approach is better: it won't show the tooltip at all for non-interactive elements (easier for mouse-first developers to notice), fixed by wrapping the custom trigger with its `<Focusable>` component.

Instead of a public `<Tooltip>`, provide only higher-level pattern components that enforce consistent, accessible tooltip usage:

- Interactive components like `<Button>` or `<Link>` get an optional `title` prop.
- `<IconButton>` gets a **required** `title` prop — this both explains the icon and labels the button for accessibility.
- An `<InfoIcon>` component renders an info/question-mark icon plus a tooltip, and is internally guaranteed to be focusable.
- An `<InfoText>` component gives more context to text, visually distinct (e.g. dashed underline) and keyboard-interactive by construction.

## gotchas
- a native declarative path is arriving: the Interest Invoker (`interestfor` attribute) combined with the Popover API lets hover/focus/long-press trigger accessible tooltips without a component at all — shipped in Chrome 142 (Oct 2025), but not yet in Firefox or Safari.
