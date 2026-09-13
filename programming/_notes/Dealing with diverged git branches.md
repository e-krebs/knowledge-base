---
source: https://jvns.ca/blog/2024/02/01/dealing-with-diverged-git-branches/
fetched: 2026-09-13
published: 2024-02-01
status: fresh
---
Diverged branches happen when local `main` and remote `main` each have commits the other doesn't — git refuses to auto-reconcile and gives a generic-looking error. Reach for this when `git push` rejects with "non-fast-forward" or `git pull` demands you "specify how to reconcile divergent branches", to recognize the situation and pick the right fix for it.

## how
Recognize divergence three ways:
- `git fetch` then `git status`: `Your branch and 'origin/main' have diverged, and have 1 and 2 different commits each, respectively.`
- `git push` fails: `! [rejected] main -> main (non-fast-forward)` — this can also just mean your branch is behind, not necessarily diverged.
- `git pull` fails outright: `fatal: Need to specify how to reconcile divergent branches.` (unless `pull.rebase`/`pull.ff` is already configured, in which case it merges, rebases, or errors with `fatal: Not possible to fast-forward, aborting.` automatically).

Three fixes, depending on which side you want to keep:

1. Keep both sets of changes — rebase local onto remote:
```
git pull --rebase
```
(There's also `git pull --no-rebase`, which merges instead and opens an editor to confirm the merge commit.)

2. Remote changes are useless, overwrite them with local:
```
git push --force
```
Safer alternative that fails if someone else pushed since your last fetch: `git push --force-with-lease` (add `--force-if-includes` for a stronger reflog-based check).

3. Local changes are useless, overwrite them with remote:
```
git checkout main
git checkout -b new-branch      # 1. save local work on a new branch first
git checkout main               # 2. back on the branch you messed up
git fetch                       # 3. make sure origin/main is current
git status                      # 4. confirm no uncommitted work to lose
git reset --hard origin/main    # 5. force local main to match remote
```
Alternatives to `reset --hard` for step 5, from another branch: `git branch -f main origin/main` or `git fetch origin main:main --force`.

## gotchas
- `git push --force-with-lease` isn't foolproof: continuous background fetching (e.g. VS Code's autofetch) can defeat its lease check.
- `git reset --hard` permanently discards uncommitted work — always run `git status` first.
