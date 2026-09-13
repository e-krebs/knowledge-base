---
source: https://charpeni.com/blog/minimizing-risk-properly-and-safely-resolving-cves-in-your-dependencies
fetched: 2026-09-13
published: 2024-10-04
status: fresh
---
A structured 5-step process for patching a CVE in a dependency (direct or transitive) while keeping changes minimal, written around Yarn Berry but applicable to npm/pnpm too. Reach for it instead of reflexively deleting the lockfile or reaching for `resolutions` first.

## how
1. Identify the CVE and the affected version range via `yarn audit`/`npm audit` or a security alert.
2. Check how many instances of the vulnerable package are installed: `yarn info <dependency-name> --all --recursive`.
3. Check why it's there — direct vs. transitive: `yarn why <dependency-name> --recursive`.
4. Pick a fix, in order of preference:
   - Update the direct dependency: `yarn up <dependency-name>` (add `--recursive` for a transitive one still within its parent's semver range).
   - If the range can't reach the patched version, update the parent that pulls it in: `yarn up <parent-package>`.
   - Last resort — pin via `resolutions` scoped to a specific requested range, not a bare package name, so it doesn't leak into packages that don't need it:
```json
{
  "resolutions": {
    "lodash@~4.16.1": "~4.17.21"
  }
}
```
5. Confirm the fix by re-running `yarn info <dependency-name> --all --recursive` and checking the resolved versions are no longer vulnerable.

## gotchas
- `resolutions` overrides the resolver permanently; entries accumulate and can silently hold back later legitimate upgrades. Scope them to a specific requested range, not the whole package name.
- Don't delete and regenerate the lockfile to "fix" a CVE — it can shift unrelated dependency versions and produce hard-to-reproduce bugs.
- `~x.y.z` and `^x.y.z` ranges behave differently, and `^0.x.y` (a 0.x version) is narrower than `^1.x.y`.
