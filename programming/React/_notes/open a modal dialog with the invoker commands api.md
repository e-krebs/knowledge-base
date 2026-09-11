---
source: https://sergiodxa.com/tutorials/open-a-modal-dialog-in-react-with-the-invoker-commands-api
fetched: 2026-09-11
status: fresh
---
The Invoker Commands API lets a `button` trigger a built-in browser action on another element via `command`/`commandfor` HTML attributes, so a simple modal can use the native `dialog` element with no `useState`, no ref, and no manual `showModal()`/`close()` call. Reach for it for simple dialogs (contact form, settings panel, confirmation); keep a dialog library when you need app-level composition, custom animation states, or nested overlay coordination.

## how
React's types may not know `command`/`commandfor` yet, so augment `ButtonHTMLAttributes`:

```tsx
declare module "react" {
	interface ButtonHTMLAttributes<T> {
		command?: "show-modal" | "close" | "request-close" | `--${string}`;
		commandfor?: string;
	}
}
```

Match `commandfor` to the dialog's `id`; a `method="dialog"` form (or a `command="close"` button) closes it:

```tsx
function ContactDialog() {
	let id = useId();
	return (
		<>
			<button type="button" command="show-modal" commandfor={id}>
				Contact Us
			</button>
			<dialog id={id}>
				<form method="dialog">
					<button type="submit" aria-label="Close">Close</button>
				</form>
				<form method="post">{/* ... */}</form>
			</dialog>
		</>
	);
}
```

## gotchas
- The Invoker Commands API reached Baseline "newly available" in December 2025 (Safari 26.2, Chrome 135, Firefox 144); it won't be Baseline "widely available" until roughly mid-2028, so a JS fallback may still be needed for older browsers.
