---
source: https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md
fetched: 2026-09-13
published: 2025-08-29
status: fresh
---
"Frequent intentional compaction" is a workflow for getting coding agents to work well in large, established (brownfield) codebases rather than just greenfield toys: design the whole development process around context management, keeping context-window utilization in the 40-60% range, and put high-leverage human review at exactly the right points. Reach for it on real production codebases — the author used it to ship a bug fix and later 35k LOC of features (cancellation + WASM support) to a 300k-LOC Rust codebase they'd never touched before.

## how
Split the work into three (ish) phases — sometimes research is skipped and you go straight to planning, sometimes there are several compacted research passes before implementation:

**Research.** Understand the codebase, the files relevant to the issue, how information flows, and the likely causes of the problem. Output is a research doc. Review point: read it before moving on — in the worked example, the first research pass wrongly concluded a bug was invalid; it was thrown out and rerun with more steering rather than trusted.

**Plan.** Outline the exact steps to take, which files need to change and how, and be precise about the testing/verification steps in each phase. Output is an implementation-plan file. Review point: compare a plan built from research against one built without it — both "would have worked" in the example, but the research-backed plan fixed the issue in the right place with testing that matched the codebase's conventions; the plan gets a human review because a bad line of plan can produce hundreds of bad lines of code (a bad line of research can produce thousands).

**Implement.** Step through the plan phase by phase; for complex work, compact the current status back into the plan file after each phase is verified. This is the only phase that needs a git worktree — everything else happens on the main branch.

The underlying reason to obsess over this: an agent turn is a stateless function call, so the context window is the only lever on output quality. Optimize it for correctness, completeness, and size (in that order of what hurts most to get wrong: incorrect information, then missing information, then noise).

Subagents are a complementary compaction tool, not a role-play device: use a fresh context window to search/summarize so the parent agent's window doesn't fill with `Glob`/`Grep`/`Read` calls, and have the subagent return output shaped like a compacted research doc.

## gotchas
- This is not magic — it demands real engagement (reading the research, staying deeply engaged during implementation) or it fails; there's no single prompt that replaces that.
- It doesn't generalize to every problem: a 7-hour attempt to remove Hadoop dependencies from parquet-java failed because the research didn't go deep enough through the dependency tree, and neither participant was a domain expert in that codebase.
- Even with the workflow, one team spent two weeks stuck on a race condition involving MCP sHTTP keepalives in Go before moving on.
