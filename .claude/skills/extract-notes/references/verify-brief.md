# Verify brief

Fill in SCRATCH, the output number and the list of note files (ten to fifteen per worker) before
handing this to a Sonnet worker. Tell it to run in the foreground and never to delegate. Notes
the judge wrote from a transcribed image are listed for the judge, not for this worker.

---

Objective: verify that every claim in these knowledge notes is supported by its source. Read-only;
write only `SCRATCH/verify-<number>.md`.

`SCRATCH/classify.json` maps each `url` to its `page` (fetched text relative to SCRATCH) and
`n`. `SCRATCH/freshness-*.json` hold live-check evidence that may support a support-status
claim. Check exactly these notes under `SCRATCH/notes/`: <list>. When a page file is a thin
summary, fetch the note's `source` with WebFetch (prompt: "Return the main article content as
markdown, verbatim where possible, with code blocks intact") and check against that.

For each note: read it, read its page or the fetched article and the freshness entry for its
n, then check every sentence and every code line: stated in the source, a faithful shortening,
or backed by the freshness evidence? Grep the page for key identifiers: property names,
numbers, version names, quoted phrases, selectors. Also check the shape: frontmatter has
`source`, `fetched`, `status`; no `# ` heading line; body 15 to 45 lines (a cheat sheet or a
one-line trick may be shorter); file under 6 KB; `## gotchas` absent when empty.

Output: one line per note, `OK — <file>` or `CHECK — <file>: <the unsupported claim, quoted,
and what the source says instead>`, then a `## summary` with counts. Do not edit any note.
Return the CHECK lines and the counts in the final message, under 30 lines.
