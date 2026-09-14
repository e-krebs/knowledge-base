---
name: add-links
description: >-
  Add new links to the vault from pasted URLs or a raindrop CSV export: dedupe, classify and
  place each one, write notes and gists, commit a dated update. Use when asked to add, import or
  file new links. Not for reworking an existing file (extract-notes), dead links or the indexer.
---

# add-links

Entry: `/add-links <input>...`, each input a raindrop `.csv` export or a text file of URLs, one
per line, `[title](url)` allowed. Pasted URLs go into `<SCRATCH>/pasted.md` first.

Intake repeats the decisions of [extract-notes](../extract-notes/SKILL.md) for links the vault
does not hold yet, plus one: where each link goes. The steps below reuse that skill's briefs and
scripts by path and add only the intake parser, the placement column and the writer. Read its
Layout section once: a note, a note line and a link line keep the same shape here.

## Layout

- SCRATCH: `<scratchpad>/add-<YYYY-MM-DD>/`, holding `intake.json`, `targets.md`,
  `classify.json`, `pages/`, `freshness-*.json`, `notes/`, `gists.json`, `review.md`.
- `classify.json` rows carry `file` and `heading` on top of the extract-notes columns. A
  heading is copied verbatim with its hashes, `""` is the untitled block, and `new: ## name` is
  a proposal that must be settled at Gate 1 (the writer refuses it).

## Steps

1. Intake, judge: `bun .claude/skills/extract-notes/scripts/dump.ts <SCRATCH>/before.json`, then
   `bun .claude/skills/add-links/scripts/intake.ts <SCRATCH> <input>...`. It drops every URL
   the vault already holds (same page through `urlShape`) and prints where each one sits, and
   it writes `targets.md`, the list of link files with their headings. Done when `intake.json`
   holds the new rows and the counts are in hand.
2. Classify and place, one Sonnet worker, background: hand it
   [references/place-brief.md](references/place-brief.md) with SCRATCH filled in, foreground,
   no sub-agents. Done when `classify.json` holds every row with a `file` and a `heading`.
3. Verbatim text and freshness, judge and workers: extract-notes steps 3 and 4 as written
   there, same scripts and briefs, over this SCRATCH. Done when every row has a dump or a
   browser read, and a freshness verdict.
4. Gate 1, judge: `bun .claude/skills/extract-notes/scripts/review.ts <SCRATCH> intake`
   groups the rows by target file and heading. Append a `## judge notes` table for every `new:`
   proposal with your recommendation, then hand the `[review.md](/absolute/path)` link the
   extract-notes way, ending on the 🙋 baton. Flips: `12 → link`, `12 → note`, `12 → note, long`,
   `12 → remove` (sets `verdict: remove`), `12 → programming/css/general.md ## layout` (sets
   `file` and `heading`), and `accept 7` for a `new:` proposal, which strips the `new: ` prefix.
   Done when he answers and no `new:` prefix remains.
5. Notes, gists and verify, Sonnet workers: extract-notes steps 6 and 7. Write `gists.json` as
   `[]` when no row needs a gist. Done when every kept row has its file or gist and no CHECK is
   open.
6. Apply, judge: `bun .claude/skills/add-links/scripts/add.ts <SCRATCH>` prints the plan per
   file, new headings and new files marked; then `--write`. Notes land in the `_notes/` folder
   next to their link file, never over an existing note. Then
   `bun .claude/skills/extract-notes/scripts/dump.ts <SCRATCH>/after.json <SCRATCH>/before.json`
   and `bun .claude/skills/extract-notes/scripts/wikilinks.ts <written files>`. Done when
   `urlsAdded` is exactly the kept rows, `urlsLost` is empty and no wikilink is unresolved.
7. Commit, judge: `YYYY-MM-DD update: <n> links`, the body listing links and notes per file,
   staged from the files add.ts wrote plus their `_notes/` folders, written to a file and passed
   with `-F`. Push only on his word, then watch both workflows to green. Done when `origin/main`
   holds the commit and the algolia-index log prints the count from `after.json`.

## Gotchas

- `n` stays a plain number in every JSON file; a zero-padded string breaks every script.
- A file that grows past taste after an import gets its own `/extract-notes` pass later; this
  skill never reorders an existing file.
- A raindrop export has one header row and quoted fields with commas and newlines inside;
  intake.ts parses that, a hand-made CSV must keep the `url` column name.
- Multi-line `git commit -m` trips the commit-subject hook here; write the message to a file and
  use `-F`.
