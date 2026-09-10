# Classifier brief

Fill in FILE (vault-relative path of the link file) and SCRATCH (absolute scratch directory)
before handing this to a Sonnet worker. Tell the worker to run every step itself, in the
foreground, and never to delegate to sub-agents.

---

Objective: classify every `[title](url)` link in `<repo>/FILE` as `extract`, `link` or
`link + gist`, and save the fetched page text for later note writing. Count the links yourself
with `grep -oE '\]\(https?://[^)]*\)' | wc -l` and proceed with whatever the count is. Read-only
against the repo: write only under SCRATCH. Do not edit the vault. Do not commit.

Rule for the verdict:
- `extract`: a technique, a pattern, a gotcha, a compact explanation or a cheat sheet whose
  actionable core fits in 15 to 40 lines of markdown.
- `link`: a tool or library homepage, a repository, a video, a slide deck, a spec or reference
  manual, a playground or generator, a gallery or demo collection, a news or opinion piece, a
  release or progress post, and anything paywalled or bot-blocked with no archive text.
- `link + gist`: a long article with a one-line takeaway worth keeping next to the link, or
  anything you are unsure about.

Freshness, a first guess only: `fresh`, `superseded by <X>` (name the native feature, shipped
spec or newer API), or `unknown`. Published date: the ISO date when the page states one, else
empty.

Procedure per link, in file order, numbered 01..NN:
1. Fetch with WebFetch, prompt: "Return the main article content as markdown, verbatim where
   possible, with code blocks intact. Omit navigation, comments, ads and footers. Also state
   the publication date if the page shows one." Save to `SCRATCH/pages/NN-<kebab-slug>.md` with
   a first line `source: <url>`.
2. If WebFetch fails or returns a bot challenge, a login wall or under 200 characters, fall
   back to the Wayback CDX API with curl:
   `curl -s "https://web.archive.org/cdx/search/cdx?output=json&filter=statuscode:200&fl=timestamp,original&limit=-1&url=<encoded url>"`,
   take the last row, fetch `https://web.archive.org/web/<timestamp>/<original>` with the same
   prompt, and note `via wayback` in the reason. If that fails too, mark the verdict `link`
   with reason `unreadable` and `page: null`.
3. Estimate the source size: small (under 800 words), medium (800 to 2500) or large.

Output, when every link is done:
- `SCRATCH/classify.md`: one markdown table, columns `#`, `heading` (innermost heading with its
  parent when nested, e.g. `tips > nested rounded corners`), `title`, `verdict`, `fresh`,
  `published`, `size`, `reason` (one short clause). Under it a `## counts` block: extract /
  link / link + gist, wayback fallbacks, unreadables.
- `SCRATCH/classify.json`: an array of `{ n, heading, title, url, verdict, fresh, published,
  size, reason, page }`, `page` the saved file path relative to SCRATCH, or null.

Return in the final message: the counts, the rows you were unsure about (number and one
clause), and every URL that failed both fetches. Under 40 lines; the files carry the detail.
