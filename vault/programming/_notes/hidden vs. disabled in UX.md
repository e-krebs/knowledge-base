---
source: https://www.smashingmagazine.com/2024/05/hidden-vs-disabled-ux/
fetched: 2026-09-13
published: 2024-05-21
status: fresh
---
When a feature or option is irrelevant or unavailable to a user, you can hide it or disable it — both confuse users if done for the wrong reason, so pick deliberately rather than by default. Reach for this when deciding whether a toolbar action, filter, or form control should disappear or just become inert.

## how
As a rule of thumb: disable if you want the user to know a feature exists but is unavailable; hide if the value shown is currently irrelevant and can't be used. Never hide buttons or key filters by default, since users expect them to persist.

Roadmap, from Sam Salomon's question "will a given user ever be able to interact with this element?":

- ✅ Yes → Disable it (disabled button or read-only state).
  - for temporary restrictions or filter incompatibility
  - when a value or status is relevant but not editable
  - when an action isn't available yet (e.g. "Export in progress…")
- 🚫 No → Hide it (remove from a toolbar, collapse in accordion).
  - due to permissions, access controls, safety, and security
  - for inaccessible features: e.g. admin buttons, overrides
  - hide such controls by default and reveal them once a condition is met

Disabling helps users learn the UI (e.g. to understand the benefits of an upgrade); explain why a feature is disabled and how to re-enable it, and let users "hide all unavailable options" rather than removing them outright.

## gotchas
- switching between showing and hiding a feature must not cause layout shifts.
- default to keeping features enabled, accessible, and legible; explain restrictions on interaction instead. Exceptions: confirmation codes and loading/processing states.
