# Freshness brief

Fill in SCRATCH, the row numbers, the output letter (a, b, c…) and the topic (TypeScript,
CSS, React…) before handing this to a Sonnet worker with WebSearch. Twelve to fourteen rows per
worker.

---

Objective: check, with live web searches, whether these techniques are still current today.
Read-only; write only `SCRATCH/freshness-<letter>.json`.

Inputs: `SCRATCH/classify.json` holds one object per link with `n`, `title`, `url`, `fresh`
(a first guess, unverified), `page` (the fetched text, relative to SCRATCH). Your rows:
n = <list>. A social post whose page holds only the post text is judged on the technique the
text names. A survey article gets, in `evidence`, one clause per feature it lists with that
feature's current status, semicolon separated, and `stale` when any status changed since the
article.

For each row: read the page, then run one to three WebSearch queries to establish (a) whether
the technique still works and is still the recommended way, (b) whether a native feature, a
newer API, a compiler flag or a shipped spec now does the same job with less effort (name it,
with its support status: MDN Baseline or caniuse for the web, the current stable version for a
language or library), (c) the publication date when classify.json has none. Prefer official
sources: MDN, web.dev, caniuse, the CSS WG drafts, release notes, the library's releases page,
the article itself.

Verdict per row:
- `fresh`: still the current way, nothing replaced it.
- `superseded`: a named replacement exists and is Baseline widely available or the library's
  documented default; say what and since when.
- `stale`: still valid, but a replacement is arriving (name it, not yet Baseline), or the page's
  support claims are outdated, or the version it targets is two or more majors behind.

Output: an array of `{ n, title, verdict, evidence, evidence_url, published, replacement }`,
`evidence` one sentence (survey rows excepted), `evidence_url` the page relied on, `published`
an ISO date or null, `replacement` the newer feature or null. Return the `n — title — verdict —
evidence` lines in the final message, under 30 lines. Do not guess: when a search settles
nothing, say `fresh` with evidence "no newer mechanism found in <what you searched>".
