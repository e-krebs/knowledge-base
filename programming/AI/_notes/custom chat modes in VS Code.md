---
source: https://code.visualstudio.com/docs/agent-customization/custom-agents
fetched: 2026-09-13
published: 2026-09-09
status: fresh
---
Custom agents let VS Code's chat adopt a persona — security reviewer, planner, solution architect — with its own tools, model, and instructions, defined in a `.agent.md` Markdown file. Reach for one instead of manually re-picking tools and instructions every time you switch task, and chain personas with handoffs (e.g. planning agent hands off to an implementation agent with the plan pre-filled as the prompt).

## how
**File & locations.** A custom agent is a `.agent.md` Markdown file: optional YAML frontmatter header, then a Markdown body of instructions. Workspace scope lives in `.github/agents/` (or, Claude format, `.claude/agents/`); user-profile scope (reused across workspaces) lives in `~/.copilot/agents/` or `~/.claude/agents/`.

Frontmatter fields: `description`, `name`, `argument-hint`, `tools` (built-in, tool sets, MCP, or `<server>/*`), `agents` (which agents this one can call as subagents — `*` for all, `[]` for none), `model` (a name or a prioritized array to try in order), `user-invocable`, `disable-model-invocation`, `target` (`vscode` or `github-copilot`), `mcp-servers`, and `handoffs` (each with `label`, `agent`, `prompt`, `send`, `model`). A tool the current context doesn't have is silently ignored.

**Create one.** In the Chat view, click the gear icon (Configure Chat) to open the Agent Customizations editor, go to the Agents tab, and pick New Agent (Workspace) or New Agent (User) from the dropdown — or run "Chat: New Custom Agent" from the Command Palette, or type `/agents` in the chat input. Fill in the frontmatter, then write the persona's instructions in the body.

**Example — a Planning agent:**
```
---
description: Generate an implementation plan for new features or refactoring existing code.
name: Planner
tools: ['web/fetch', 'search/codebase', 'search/usages']
model: ['Claude Opus 4.5', 'GPT-5.2']  # Tries models in order
handoffs:
  - label: Implement Plan
    agent: agent
    prompt: Implement the plan outlined above.
    send: false
---
# Planning instructions
You are in planning mode. Your task is to generate an implementation plan for a new feature or for refactoring existing code.
Don't make any code edits, just generate a plan.

The plan consists of a Markdown document that describes the implementation plan, including the following sections:

* Overview: A brief description of the feature or refactoring task.
* Requirements: A list of requirements for the feature or refactoring task.
* Implementation Steps: A detailed list of steps to implement the feature or refactoring task.
* Testing: A list of tests that need to be implemented to verify the feature or refactoring task.
```

## gotchas
- Custom agents were previously called "custom chat modes"; existing `.chatmode.md` files still work, but should be renamed to `.agent.md` and moved to a supported location.
- For sessions run on an Agent Host, user-level agents are read from the host's own folder (e.g. `~/.copilot/agents`, `~/.claude/agents`), not from VS Code's profile user data.
