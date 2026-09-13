---
source: https://zed.dev/blog/why-llms-cant-build-software
fetched: 2026-09-13
published: 2025-08-14
status: fresh
---
Zed's mental model for what separates effective software engineers: they loop between a model of the requirements and a model of what the code actually does, diffing the two to decide whether to fix the code or the requirements. LLMs can execute every individual step - write code, run tests, add logging - but can't hold both mental models at once, so they guess whether to fix code or tests and often delete everything and restart instead of converging. Use this loop as a check on how much autonomy to hand an agent: expect a one-shot on simple, well-specified work, and plan for tight human iteration on anything non-trivial.

## how
The software engineering loop:
- Build a mental model of the requirements.
- Write code that (hopefully) satisfies it.
- Build a mental model of what the code actually does.
- Identify the differences, and update the code or the requirements.

Effective engineers test as they go, checking in with the mental model to decide whether to fix the code or the tests, rather than deleting everything and starting over when frustrated.

## gotchas
- Context omission: models are bad at finding what's missing from the context.
- Recency bias: they overweight whatever is most recent in the context window.
- Hallucination: they commonly invent details that shouldn't be there.
- Not a fundamental limit: work is underway on giving models a form of memory, so this may improve as that work matures.
