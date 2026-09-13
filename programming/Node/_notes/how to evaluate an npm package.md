---
source: https://blog.gaborkoos.com/posts/2026-05-29-How-to-Evaluate-an-npm-Package-2026-Edition/
fetched: 2026-09-13
published: 2026-05-29
status: fresh
---
A repeatable, 5-10 minute process for deciding whether to add an npm package: whether you actually need it, whether it's maintained, whether what's published matches the source, whether CI is real, and how the author handles vulnerabilities. Reach for it before adding any new dependency, especially one likely to spread across many services.

## how
- 0. Need it? Removal test: how hard to replace if it disappeared tomorrow. Check dependency footprint and where it'll be used (isolated tool vs. everywhere).
- 1. Maintained? Check the oldest open GitHub issues for acknowledgment, the last human (non-bot/CI) commit, maintainer concentration ("bus factor"), release cadence on the npm Versions tab, changelog quality, and migration guides for breaking changes.
- 2. Trustworthy publish? Look for the green "Provenance" badge on `npmjs.com/package/<name>` (ties the tarball to a commit + workflow run); run `npm audit signatures`. In `.github/workflows/`, check for `npm publish --provenance`, `id-token: write`, and the absence of `NPM_TOKEN`. Check install scripts:
```
npm pack --dry-run 2>/dev/null | grep -E "preinstall|postinstall|install"
```
Check that GitHub Actions are SHA-pinned, not `@v4`/`@main`.
- 3. Real CI? Confirm workflows trigger on `pull_request`, not just push to main, and that a recently merged PR actually waited on CI. Look for enforced coverage thresholds in `vitest.config.js`/`jest.config.js`.
- 4. Code quality visible? Check lint config exists and is non-trivial; check the `exports` field (named `import`/`require`/`types` conditions vs. just `main`); check for a `prepublishOnly` build+test script; for TypeScript, check `strict: true` and scan for excessive `any`/`@ts-ignore`.
- 5. Incident response? Look for `SECURITY.md` or `/security/policy`; check GitHub Security Advisories for past disclosures and how they were handled; check osv.dev/Snyk for known CVEs, prioritizing by reachability; consider Socket.dev for behavioral analysis, Socket Firewall for install-time enforcement in high-assurance environments.

If short on time, the three checks that matter most: do you need it, does it have provenance, does it have unexplained install scripts.

| Security-critical | Where | Green | Red |
|---|---|---|---|
| Provenance | npm version page | Present, matches repo | Missing, or mismatched source |
| Trusted publishing | `.github/workflows/publish.yml` + npm settings | OIDC + `--provenance`, no `NPM_TOKEN`, 2FA required | `NPM_TOKEN` secret, manual publish |
| Install scripts | `package.json` scripts | None, or clear native-addon reason | Unexplained `preinstall`/`postinstall` |
| Pinned CI actions | `.github/workflows/*.yml` | SHA-pinned | `@v3`, `@latest`, `@main` |

| Operational maturity | Where | Green | Red |
|---|---|---|---|
| Active maintenance | Commits + issues | Commits in last 3 months, issues acknowledged | Last commit 2+ years ago |
| Dependency footprint | npm page + lockfile | Few deps for scope | Large transitive tree for a trivial utility |
| Maintainer concentration | Commits/releases/PRs | Distributed | One maintainer handles everything |
| Coverage enforced | vitest/jest config | Thresholds ≥80% | No thresholds, static badge |
| Security policy | `SECURITY.md` / Security tab | Clear process + contact | Missing, or generic template |

## gotchas
- AI coding assistants hallucinate package names ("slopsquatting"); verify an LLM-suggested package actually exists with real history before installing it.
- A green CI badge can be decorative — confirm it actually gates merges rather than just recording what already happened.
- Risk isn't binary: weigh a package's blast radius against the checklist rather than treating any single check as pass/fail.
