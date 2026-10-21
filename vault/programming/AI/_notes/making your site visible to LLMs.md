---
source: https://evilmartians.com/chronicles/how-to-make-your-website-visible-to-llms
fetched: 2026-09-13
published: 2026-04-15
status: fresh
---
A checklist for making a site's content legible to LLMs and AI agents: ship clean Markdown at every URL, advertise it through standard web mechanisms, then measure who actually shows up. Reach for this when a human pastes your URL into an AI tool, or a coding agent fetches your docs, and you want it to see clean content instead of HTML soup — not as a guaranteed way to get crawled automatically, since no major provider has committed to that yet.

## how
Six techniques that work, ordered by impact vs. effort:
- `/llms.txt` - a curated Markdown map of your site at the root (H1, summary, linked sections)
- `.md` routes - a clean Markdown twin of every page at the same URL plus `.md`
- `<link rel="alternate" type="text/markdown">` tag + matching HTTP `Link` header - advertise the Markdown twin to DOM crawlers and headless fetchers alike
- hidden `<div aria-hidden="true">` hint naming the Markdown URL, for a human who pastes your rendered page into a chat
- `/llms-full.txt` - the entire site's text in one file, for docs sites an LLM can ingest whole
- `Accept: text/markdown` content negotiation - server returns Markdown when asked, HTML otherwise, with `Vary: Accept` and a `406` for unsupported types

Eight that don't:
- `<meta name="ai-content-url">` - no spec, no origin, no tool reads it
- `<meta name="llms">` - submitted to WHATWG as issue #11548, closed "not planned"
- `/.well-known/ai.txt` and `/ai.txt` - competing proposals, no meaningful adoption
- HTML comments (`<!-- AI-READABLE-VERSION -->`) - LLM parsers strip comments before processing
- human/AI toggle buttons - decorative once you serve `.md` routes and content negotiation; agents don't click buttons
- User-Agent sniffing to serve Markdown - this is cloaking, and Google penalizes it
- dedicated "AI info pages" - no evidence any crawler treats these differently from an ordinary well-structured page
- Schema.org/JSON-LD alone - a controlled experiment found ChatGPT, Claude, Perplexity, Gemini, and Copilot all missed product data placed only in JSON-LD

## gotchas
- step zero before any of this: audit `robots.txt` and add a `Content-Signal: search=yes, ai-input=yes, ai-train=yes` line; many default configs already block GPTBot and ClaudeBot
- server logs consistently show major crawlers don't fetch `/llms.txt` or `.md` files unprompted; today's payoff is human- or agent-initiated (someone pastes your URL into a chat, or a coding agent fetches your docs), not automatic indexing
