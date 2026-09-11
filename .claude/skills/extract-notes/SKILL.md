---
name: extract-notes
description: >-
  Extract knowledge notes from one vault link file: classify, live freshness check, notes and
  gists, reorganisation, commit. Use when asked to extract, convert or run the process on a
  vault file. Not for adding links, dead links or the indexer.
---

# extract-notes

Entry: `/extract-notes <vault file>`, for example `/extract-notes programming/React/general.md`.

A link line carries a title and nothing else, so search finds titles. This skill turns each
link whose core fits a short page into a note next to it, gives every other link a one-line
gist, regroups the file, and leaves the index richer without changing the pile extension. The
judge runs the steps and keeps every decision that needs taste; Sonnet workers do the fetching,
writing and checking through the briefs in [references/](references/).

## Layout

- SCRATCH: `<scratchpad>/<file slug>/`, holding `classify.json`, `classify.md`, `pages/`,
  `freshness-*.json`, `notes/`, `gists.json`, `review.md`, `reorg.md`, `layout.json`,
  `verify-*.md`.
- A note: a markdown file in the `_notes/` subfolder of the link file's folder, frontmatter
  `source`, `fetched`, `published?`, `status`, no `# title` (the file name is the title), a gist
  paragraph, `## how`, `## gotchas` only when there is one. The `_notes` segment is filing, not
  a tag. Schema and rules in [references/note-brief.md](references/note-brief.md).
- A note line in the link file: `📝 [[file name|title]]`, alias only when the sanitised file
  name differs from the title. The note carries the source, the line never repeats it.
- A link line: `[title](url) — gist`, gist under 15 words, no em dash inside.
- The indexer ([scripts/list.ts](../../../scripts/list.ts)) resolves a wikilink to the note in
  `_notes/`, then the same folder, then anywhere, and enriches the record with `content`,
  `note`, `status`, `type`, one record per URL.

## Steps

1. Baseline, judge: `bun .claude/skills/extract-notes/scripts/dump.ts <SCRATCH>/before.json`.
   Read the file and note its headings. Done when the count is known.
2. Classify, one Sonnet worker, background: hand it
   [references/classify-brief.md](references/classify-brief.md) with the file and SCRATCH
   filled in. Tell it to run in the foreground and never to fan out to sub-agents: a worker
   that spawns workers stops before its files exist. Done when `classify.json` holds every
   link.
3. Verbatim text, judge: `bun .claude/skills/extract-notes/scripts/fulltext.ts <SCRATCH>/classify.json <SCRATCH>`
   writes `pages/NN-full.md` for every non-link row from the raw HTML (Wayback when the site
   blocks), because a WebFetch page is a summary and note writers must work from page text. A
   row that comes back under 2 KB is read in the browser instead (chrome-devtools MCP, an
   `evaluate_script` dump of `h1,h2,h3,p,pre,li` from the largest content block). Then point
   each row's `page` at its full dump. Done when every extract row has a dump over 2 KB or a
   browser read.
   Unreadable rows, judge: a tweet's text comes from
   `https://publish.x.com/oembed?omit_script=true&url=<url>`; its code usually sits in an
   image, so open the tweet in the browser (chrome-devtools MCP), read the `pbs.twimg.com`
   image `src`, open it with `?format=png&name=large`, screenshot, transcribe. Bluesky the same
   through `cdn.bsky.app/img/feed_fullsize`. A JavaScript-only article gets a browser dump of
   its `h1,h2,h3,p,pre,li`. Codepen demos stay links. Save each as `pages/NN-*.md`, flip the
   row, and write those notes yourself with the transcription named in `## gotchas`. Done when
   no row reads `unreadable` without a decision.
4. Freshness, Sonnet workers with WebSearch, 12 to 14 rows each, background: hand
   [references/freshness-brief.md](references/freshness-brief.md) for every `extract` and
   `link + gist` row. The classifier's own freshness column is a guess and once missed
   TypeScript 7 shipping; only this pass counts. Plain `link` rows (tools, libraries, docs,
   galleries) go to one more Sonnet worker that visits each page in the browser (chrome-devtools
   MCP) and reads the maintenance signals, per the brief's second section. Done when every row
   has a verdict with a cited URL.
5. Gate 1, judge: `bun .claude/skills/extract-notes/scripts/review.ts <SCRATCH> "<file>"`,
   append a `## judge notes` table for the rows you handle differently, then hand Emmanuel the
   clickable `[review.md](/absolute/path)` link in a plain message that ends on the 🙋 baton:
   the question tool renders no links and hides the text before it, and a table pasted into the
   chat is refused. Take flips from his reply as `12 → link`, `20 → note`, `17 → remove`. His standing flips: a long article with a simple
   core becomes a note; a `superseded` row is removed or becomes a link whose gist names the
   successor, never a stale note; a `stale` row keeps its note with the successor and its
   support status in `## gotchas` and `status: stale`. Done when he answers.
6. Notes and gists, Sonnet workers, background: batches of 5 to 7 `extract` rows each on
   [references/note-brief.md](references/note-brief.md); one worker on
   [references/gist-brief.md](references/gist-brief.md) for every non-extract row. Workers
   write to `<SCRATCH>/notes/` and `gists.json`, never to the vault. Done when every row has
   its file or gist.
7. Verify, Sonnet workers, background: [references/verify-brief.md](references/verify-brief.md)
   over the notes, ten to fifteen per worker. Reopen every CHECK yourself: a claim the source
   does not carry goes, a claim backed by an image you transcribed stays, a body under 15 lines
   is fine when the trick is that small. Done when no CHECK is open.
8. Gate 2, judge: write `reorg.md` as before/after, cross-file moves with target file and
   heading (check the target's headings first), removals, and the tag effect (every heading is a
   tag), with a within-file-only and a flatter alternative at the end. Hand the link the same
   way as Gate 1 and read his choice from the reply. Done when he answers.
9. Apply, judge: write `layout.json` (see
   [scripts/layout-css-example.json](scripts/layout-css-example.json)), dry-run
   `bun .claude/skills/extract-notes/scripts/apply.ts <SCRATCH> <layout.json>`, then `--write`.
   Then `dump.ts <SCRATCH>/after.json <SCRATCH>/before.json` and `wikilinks.ts` on every edited
   file. Lost URLs must be the removed rows, the citations of a converted prose file, and the
   tracking parameters a note's `source` dropped; nothing else. Done when the diff reads that
   way and no wikilink is unresolved.
10. Gate 3, judge: commit `YYYY-MM-DD notes: <topic>` with the note count, gist count, moves and
    removals in the body, staging every folder `apply.ts` wrote to, the cross-file `folder`s
    included (a moved note is easy to leave untracked). Ask: push now, or review in Obsidian first. Push only on his word,
    then watch both workflows to green. Done when `origin/main` holds the commit and the
    algolia-index log prints the record count from `after.json`.

## Rules the briefs enforce

- Every sentence and code line in a note comes from the page text, a transcribed image, or the
  freshness evidence; never from memory. A browser-support claim from the source is dropped
  unless the freshness evidence confirms it.
- A worker that cannot read a source stops and reports; the judge decides.
- File name: the title with `/ \ : * ? " < > |` replaced by `-`.
- `status` is `fresh` or `stale`; `superseded` never reaches a note.
- A pre-existing prose file in the folder joins the pass: frontmatter added, body trimmed to the
  schema, a `📝 [[name]]` line placed by the layout.

## Gotchas

- `.claude/` is a dot folder, so Bun's Glob in `mdFiles()` and Obsidian both ignore it; the
  skill's own markdown never reaches the index.
- Multi-line `git commit -m` trips the commit-subject hook here; write the message to a file and
  use `-F`.
- Substack pages fetch as paraphrase; workers must re-fetch the URL for verbatim code.
- The Algolia settings (searchable `text, tags, url, content`; retrieve
  `url, text, tags, type, note, status`; highlight `text, tags`) were set once in the
  dashboard on 2026-09-10 and survive `replaceAllObjects`; a new record field needs them
  revisited.
