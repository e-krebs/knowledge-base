# Knowledge base MCP server

A local, read-only MCP server over the vault. You register it once. Claude Code then starts it as a child process (`bun mcp/stdio.ts`) when a session opens, in any project. You never call it yourself: when you ask Claude "what do I have on popovers?", Claude calls `search_kb`, then `get_item` on a hit.

## Install

```
claude mcp add knowledge-base -- bun /Users/emmanuel.krebs/Projects/knowledge-base/mcp/stdio.ts
```

The server reads the vault at startup. After you add links, restart the session or run `/mcp` to reconnect, so the new links are picked up.

## Tools

| Tool | Inputs | What it does |
| --- | --- | --- |
| `search_kb` | `query`, optional `topic`, `status` (`fresh`, `stale`, `emerging`), `form` (`note`, `gist`, `bare`), `sort` (`relevance`, `fetched`), `limit` (1-25, default 10) | Keyword search over titles, tags, gists and note bodies. AND first, OR fallback. |
| `get_item` | `ref`: an id, a full URL or an exact title | One item in full: metadata, gotchas and, for a note, the body. Several matches return a list of ids. |
| `list_topics` | none | The topic tree with the item count under each path. |
| `list_links` | `topic`, optional `limit` (1-50, default 50) | Items under one topic, in vault file order. |
| `list_by_freshness` | optional `bucket` (`stale`, `emerging`, `old-fetched`, `unchecked`), `limit` (1-50, default 50) | Items by freshness, stale first, oldest-checked first within a bucket. |
| `find_related` | `id`, optional `limit` (1-10, default 5) | Items on the same subject, matched on the item's title and its two rarest tags. |

All six tools are read-only.

## Data shape

A search hit is one line: `id · title · url · status · fetched · gist`. An item with no status shows `unchecked`, and one with no date shows `-`.

`get_item` returns a metadata block, then `---`, then the body. The metadata holds `id`, `title`, `url`, `kind`, `form`, `topic`, `tags`, `headers`, `status`, `fetched`, `published`, `file` (with `:line`), and `note` or `gist` when present. A note's `## gotchas` section is kept whole and shown separately, because a stale or emerging note names its successor there. The body is capped at 20000 characters; the other tools cap their text at 8000 and say `narrow the query` when they cut.

Fields:

- `kind`: `note` (an extracted note with a body, status and dates) or `link`.
- `form`: `note`, `gist` (a link with a summary) or `bare` (a link with only a title). It is derived from the line shape in the vault.
- `topic`: the placement path, the folder plus file name, such as `programming/css/general`. `topic` filters match by prefix, so `programming/css` covers everything below it.
- `status`: `fresh`, `stale` or `emerging`, stored in the note's frontmatter. A bare link has no status, so it falls in the `unchecked` bucket and has no body.
- `fetched` and `published`: ISO dates from the note frontmatter.

Freshness buckets:

- `stale`: the source changed.
- `emerging`: notes whose source emerged, to review.
- `old-fetched`: status `fresh`, last checked more than 180 days ago.
- `unchecked`: a link with no status.

## Usage log and report

Every tool call appends one JSON line to `~/.local/state/knowledge-base-mcp/usage.jsonl`. Set `KB_MCP_LOG=/some/path.jsonl` to write elsewhere, or `KB_MCP_LOG=off` to disable it.

Each event holds `ts`, `serverSession`, `clientSession` (optional), `clientCwd`, `client` (name and version), `tool`, `args`, `resultCount`, `topIds`, `truncated`, `ms` and `isError`.

Caveat: `clientSession` is never set. The stdio entry point does not receive a session id from Claude Code, so the field is absent. Join events on `clientCwd` and `ts` instead.

The report summarises the log: calls per tool and per day, clients, top queries, zero-result queries (recall gaps), most fetched refs, slowest calls and errors.

```
bun mcp/usage/report.ts --since 7d
```

`--since` takes whole days only, such as `7d`. Without it the report covers the whole log. For a raw look at one tool:

```
jq -c 'select(.tool == "search_kb") | {ts, query: .args.query, resultCount}' ~/.local/state/knowledge-base-mcp/usage.jsonl
```

## Later

Hosted access over HTTP, so claude.ai and other clients can reach the same server, is planned and not built. The plan is a build-time snapshot of the vault served from Cloudflare Workers, with deploy and CI, then authentication. Nothing in this directory deploys anything yet.
