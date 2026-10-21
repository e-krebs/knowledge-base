---
source: https://addyo.substack.com/p/the-prompt-engineering-playbook-for
fetched: 2026-09-13
published: 2025-05-27
status: stale
---
A cheat sheet for prompting AI coding assistants (debugging, refactoring, feature implementation) so they act like a reliable pair programmer instead of guessing. Reach for the seven foundational principles when a prompt is producing vague or off-target code, and for the anti-pattern table when diagnosing why a specific prompt failed.

## how
Seven foundational principles for code prompts:

1. **Provide rich context** — language, framework, libraries, the exact error message, and what the code should do. Assume the AI knows nothing about your project beyond what you paste in.
2. **Be specific about the goal** — "why isn't my code working?" yields guesses; "it should do X but does Y given input Z, where's the bug?" yields a diagnosis.
3. **Break down complex tasks** — build a feature in stages (skeleton, then state, then API integration) instead of one giant prompt.
4. **Include input/output examples** — a concrete "given X, expect Y" case (few-shot) removes ambiguity.
5. **Leverage roles/personas** — "act as a senior React developer reviewing this" primes a more structured, expert-toned answer.
6. **Iterate and refine** — treat the first answer as a draft; correct it in the same conversation ("use an iterative approach instead of recursion").
7. **Maintain code clarity and consistency** — clean names and consistent style in your own code give the AI stronger cues than the prompt text alone.

Anti-patterns and fixes:

| Anti-pattern | Fix |
|---|---|
| Vague prompt ("it doesn't work, fix it") | Add error message, expected vs. actual behavior, code |
| Overloaded prompt (many asks at once) | Split into one task per prompt |
| Missing the question (dumping code, no ask) | State the ask explicitly: "find the bug", "explain this" |
| Vague success criteria ("make it faster/cleaner") | Quantify: "linear time instead of quadratic", name the metric |
| Ignoring the AI's clarifying question | Answer it or add the missing detail, don't just repeat the prompt |
| Inconsistent style within one prompt | Keep one voice/format; fence code, delineate examples clearly |
| Vague references ("the above code") | Re-quote or name the function; don't rely on long-range recall |

## gotchas
- Since publication the field has shifted from manual prompt-stuffing toward context engineering and agentic tools that auto-gather codebase context (freshness-a.json); replacement: context engineering / agentic auto-context assistants (e.g. Claude Code, Cursor/Copilot agent mode) — not yet a single standard.
- The worked Next.js example targets Next.js 14, now two majors behind current stable Next.js 16.
