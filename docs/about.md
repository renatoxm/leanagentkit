# About Lean Agent Kit

<div class="page-hero">
<div class="page-hero-text">

**Your coding agent should not have to relearn your project every session**

AI coding agents can write code quickly, but they often begin with the same
disadvantage: they do not know your codebase, your conventions, what you are
working on, or what the last session discovered.

</div>
<div class="page-hero-image">
<img src="/assets/images/TrevorBooks.png" alt="Trevor — Lean Agent Kit concierge" />
</div>
</div>

That cold start costs time and context. The agent searches through familiar
files again, misses decisions that live only in chat history, and can repeat
mistakes your team has already solved.

**Lean Agent Kit gives your AI coding agents a small, persistent project
memory.** It installs a set of plain Markdown files that help an agent understand
where things are, how your project works, what matters now, and what it should
remember next time.

## What changes after you install it?

Instead of asking an agent to rediscover the repository on every task, you give
it a dependable starting point:

- a codebase map for fast navigation
- project commands, conventions, constraints, and never-dos
- active context that carries current work into the next session
- a learning loop that turns discoveries and mistakes into durable guidance
- optional skills and packs for more structured workflows

The result is less repeated exploration, faster handoffs, more consistent
decisions, and an agent that becomes better aligned with your project over time.

## Why teams use Lean Agent Kit

### Get productive faster

New sessions start with a map and a resume note. The agent can focus on the task
instead of spending its context window reconstructing the project.

### Keep agents aligned with your codebase

Put the facts that matter — architecture, commands, coding conventions, and
project-specific constraints — in files the agent checks while it works.

### Preserve knowledge between sessions and tools

Important context no longer has to remain trapped in one conversation. Because
the memory is Markdown stored in your repository, it can travel with the code
and be read by different coding agents.

### Improve from real work

Useful discoveries and avoidable failures go into a learning inbox. Proven
lessons can become permanent project guidance, reducing the chance that the same
mistake happens again.

### Stay lean

The default install is intentionally small. You do not need a large agent
framework or dozens of skills to get useful memory. Start with the core, then
enable packs only when they solve a problem you actually have.

## How it works

Lean Agent Kit scaffolds a few focused files into your project:

- `AGENTS.md` records project facts, commands, conventions, and boundaries.
- `docs/CODEBASE_MAP.md` gives the agent a reliable navigation index.
- `docs/memory/ACTIVE_CONTEXT.md` records the current focus and the next step.
- `docs/memory/LEARNINGS.md` captures lessons worth carrying forward.
- `.agent/skills/` contains small workflows for maintaining and using that
  memory.

The approach is **map-first, not map-only**. The map helps the agent begin in the
right place; narrow search is still expected when the map is incomplete or the
task requires deeper investigation.

For larger workflows, optional [packs](/packs) add capabilities such as
spec-driven development, stack-aware setup, engineering guardrails, backlog
integration, and Git lifecycle support.

## Built for the tools you already use

Lean Agent Kit is tool-agnostic. Its core is readable files rather than a hosted
service or proprietary database, so it works with **Cursor, Claude Code, Copilot,
ChatGPT, Aider, Cline, and other coding agents that can read project files**.

There is no account to create, no service to keep running, and no required
subscription.

## Free and open source forever

Lean Agent Kit is free to use and open source under the
[MIT License](https://github.com/renatoxm/leanagentkit/blob/main/LICENSE). You
can use it for personal or commercial projects, inspect every part of it,
modify it for your team, and share your changes.

The project is designed to keep your knowledge in your repository and under
your control. No vendor lock-in. No paid tier required to unlock the core idea.

## Who is it for?

Lean Agent Kit is useful for:

- solo developers who want continuity between coding sessions
- teams that need AI agents to follow shared conventions
- maintainers working across large or unfamiliar repositories
- developers who switch between AI coding tools
- anyone who wants durable agent context without adopting a heavy framework

It will not replace your coding agent, editor, search tools, or engineering
judgment. It gives those tools a better project memory to work from.

## Try it in your project

Install the core in your repository:

```bash
npx create-lean-agent-kit@latest .
```

Then follow the prompt printed by the installer. The bootstrap workflow maps
your codebase and helps fill in project-specific conventions.

[Get started](/getting-started) or
[view the source on GitHub](https://github.com/renatoxm/leanagentkit).
