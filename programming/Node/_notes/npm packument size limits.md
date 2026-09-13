---
source: https://www.vlt.io/blog/packument-size-limits
fetched: 2026-09-13
published: 2026-06-23
status: fresh
---
npm caps the size of a package's "packument" (the registry document listing metadata for every published version) at 100MB uncompressed; once a package hits that limit the registry refuses new publishes. Reach for this when planning a release strategy for a package with many versions or frequent snapshot/dev-build publishes.

## how
- A packument accumulates the manifest (an annotated `package.json` plus metadata) of every version ever published; it's downloaded in full on any fresh install that isn't resolved from a lockfile.
- Drizzle ORM hit the 100MB cap in June 2026 after publishing frequent snapshot releases straight from git commits; each manifest was ~131KB (large due to many ESM exports), so it took roughly 763 releases to max out.
- Versions can't be deleted more than 72 hours after publish, so once you're near the cap the only fix is asking npm support to delete old versions on your behalf — slow, since the npm team at GitHub is small.
- Check your own packument size:
```
curl -s https://registry.npmjs.org/react | wc -c | awk '{printf "%.2f MiB\n", $1/1024/1024}'
```

## gotchas
- Don't publish every dev/snapshot build to the main registry — each one permanently grows the packument that every future install has to download. Use a separate registry for dev builds if you need them public.
- A large `package.json` (many exports) multiplies the problem — monitor packument size proactively rather than after hitting the cap.
