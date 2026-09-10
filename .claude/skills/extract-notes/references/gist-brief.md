# Gist brief

Fill in SCRATCH and the row numbers (every row that is not `extract` and not removed) before
handing this to one Sonnet worker.

---

Objective: write a one-line gist for these links, from page text already fetched. Write only
`SCRATCH/gists.json`. Do not touch the vault. Do not commit.

Inputs: `SCRATCH/classify.json` holds one object per link with `n`, `title`, `url`, `page`
(fetched text relative to SCRATCH, null when unreadable). Your rows: n = <list>. Read
`SCRATCH/freshness-*.json` too: a row with verdict `stale` or `superseded` gets a gist that
names the replacement and its support status, taken from `evidence`.

Rules for a gist:
- One line, 6 to 15 words, lowercase start, no final period, no em dash inside (the vault uses
  ` — ` as the delimiter before the gist).
- Says what the reader gets that the title does not: for a library, what it does and its one
  distinguishing trait; for an article or survey, the author's takeaway; for a tool, what it
  shows; for a demo, the technique or library behind it. Never repeat the title's words when the
  title already says it.
- From the page text only. For a codepen with no page, try
  `https://codepen.io/api/oembed?format=json&url=<url>` for title and author, and fall back to
  `codepen demo by <author from the url>`. For a repository with a thin page, WebFetch the
  README. When nothing readable exists, set `gist` to null and say why in `note`.

Output: an array of `{ n, title, gist, note }`, `note` null or a short reason the gist is weak.
Return the `NN — gist` lines in the final message, plus every row with a null gist.
