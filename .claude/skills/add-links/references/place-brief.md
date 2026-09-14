# Placement brief

Fill in SCRATCH (absolute scratch directory) before handing this to one Sonnet worker. Tell the
worker to run every step itself, in the foreground, and never to delegate to sub-agents.

---

Objective: classify and place every new link listed in `SCRATCH/intake.json`. Read-only against
the repo: write only under SCRATCH. Do not edit the vault. Do not commit.

Inputs:
- `SCRATCH/intake.json`: one object per link with `n` (keep it, a plain number), `url`, `title`
  (may be empty), and for a raindrop export `folder`, `tags`, `excerpt`, `created`.
- `SCRATCH/targets.md`: every link file of the vault with its headings, verbatim.
- `<repo>/.claude/skills/extract-notes/references/classify-brief.md`: read it first. Its verdict
  rule (`extract`, `link`, `link + gist`), its freshness guess, its fetch procedure with the
  Wayback fallback and its size estimate apply unchanged to every row here. Where it says "in
  file order, numbered 01..NN", take the rows of intake.json in order and keep their `n`.

Placement per row, after the fetch:
- `file`: the link file the page belongs with, picked from targets.md by topic. A note file
  under `_notes/` is never a target.
- `heading`: one of that file's headings copied verbatim with its hashes (`## layout`), or `""`
  for the file's untitled block, or `new: ## <name>` when no heading fits and the file has
  headings. Propose `new: <path>.md` as `file` only when no file fits at all.
- `place_reason`: one short clause. A raindrop `folder` or `tags` value breaks a tie between two
  fits and never overrides the page's topic.
- An empty `title` becomes the page's own title, trimmed to the article name (no site suffix).

Output, when every row is done:
- `SCRATCH/classify.md`: one table, columns `#`, `file`, `heading`, `title`, `verdict`, `fresh`,
  `published`, `size`, `reason`, then a `## counts` block: extract / link / link + gist, new
  headings proposed, new files proposed, wayback fallbacks, unreadables.
- `SCRATCH/classify.json`: an array of `{ n, file, heading, place_reason, title, url, verdict,
  fresh, published, size, reason, page }`, `page` the saved file path relative to SCRATCH, or
  null.

Return in the final message: the counts, every `new:` proposal with its reason, the rows you were
unsure about (number and one clause), and every URL that failed both fetches. Under 40 lines.
