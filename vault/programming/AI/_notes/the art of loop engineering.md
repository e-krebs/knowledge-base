---
source: https://www.langchain.com/blog/the-art-of-loop-engineering
fetched: 2026-09-13
published: 2026-06-16
status: fresh
---
A reliable agent needs more than a good model: it needs a harness built from four stacked loops, each one automating a different part of the work. Reach for this framework when deciding what to build next around an agent that already works in the small but isn't yet trustworthy, connected, or self-improving in production.

## how
1. **Agent loop** - the model calls tools repeatedly until the task is done; `create_agent` with any model and tools.
2. **Verification loop** - a grader (deterministic or LLM-as-judge) checks the output against a rubric and sends it back with feedback on failure; `RubricMiddleware` or an `after_agent` hook. Costs latency and cash per run, worth it when quality matters more than speed.
3. **Event driven loop** - an event (new doc, cron, webhook) triggers the agent as an always-running component instead of something invoked manually; LangSmith Deployment triggers or Fleet channels.
4. **Hill climbing loop** - an analysis agent reviews traces from production runs and rewrites the harness (prompts, tools, graders); can also feed RL fine-tuning of the model itself. The return arrow reaches inside and updates the agent loop directly, so each outer cycle makes the inner loops more effective.

| Loop | What it does | Impact | LangChain primitive |
|---|---|---|---|
| 1. Agent loop | Model calls tools repeatedly until a task is complete | Automate work | `create_agent`, any LangChain-supported model |
| 2. Verification loop | Agent runs, output is scored against a rubric, retried with feedback if it fails | Ensure work quality and correctness | `RubricMiddleware` |
| 3. Event driven loop | Events trigger agent runs that update a real system | Automated work at scale | LangSmith Deployment (cron/webhooks) or Fleet channels |
| 4. Hill climbing loop | Traces from production runs feed an analysis agent that improves the harness config | Harness improvements | LangSmith Engine |

## gotchas
- for sensitive actions (financial transactions, DB operations), put a human in the loop at every level: before tool calls, as the verification grader, before returning output, or reviewing harness changes before deployment
