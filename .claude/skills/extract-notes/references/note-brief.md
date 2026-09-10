# Note brief

Fill in SCRATCH and the row numbers (five to seven `extract` rows per worker) before handing this
to a Sonnet worker. Name any row whose freshness verdict is `stale` so the worker adds the
successor line.

---

Objective: write one Obsidian knowledge note per assigned link, from page text already fetched.
Write only under SCRATCH/notes/. Do not touch the vault. Do not commit. Your rows: n = <list>.

Inputs:
- SCRATCH/classify.json: one object per link with `n`, `title`, `url`, `published`, `page` (the
  fetched page text, path relative to SCRATCH).
- SCRATCH/freshness-*.json: live freshness verdicts per `n`
  (`verdict`, `evidence`, `replacement`, `published`). When your row's verdict is `stale`, the
  note's `## gotchas` gets one line naming the replacement and its support status, taken from
  `evidence`. When the row is absent from both files, treat it as fresh.

File name: the link `title` exactly, with each of the characters / \ : * ? " < > | replaced by
`-`, plus `.md`. Example: `collapsible Q&A - Accordion without JS.md`, `-is() selector to avoid
repetition.md`.

Content, in this order, nothing else. No `# title` heading anywhere: the file name is the title.

```
---
source: <url>
fetched: <today, ISO date>
published: <ISO date from classify.json, else from the freshness file; omit the line when neither has one>
status: fresh
---
<one paragraph, 2 to 4 sentences: what the technique does and when to reach for it>

## how
<the steps or the snippet, trimmed to the part that matters; a fenced code block copied from the source, tagged with its language>

## gotchas
- <one line each, only when the source names one, plus the freshness line when the row is stale; omit the whole section when there is nothing>
```

Rules:
- Body 15 to 40 lines, file under 6 KB. Terse, no marketing, no "in this article".
- Code blocks come from the source, shortened but never invented. When the source shows a
  before/after, keep the after.
- Every claim must come from the page text or the freshness evidence. Read the `page` file first.
  If it is thin or truncated, fetch the `url` with WebFetch (prompt: "Return the main article
  content as markdown, verbatim where possible, with code blocks intact"). If neither gives
  enough to write the note, do not write it: stop on that row and report it.
- Never write from memory about the topic. Never add a citation the source does not carry.
- A browser-support claim in the source is dropped unless the freshness evidence confirms it.

Return, in under 30 lines: for each row, the file path, the line count, the byte size
(`wc -l -c`), and any claim you were unsure the source supports. Name any row you skipped and why.
