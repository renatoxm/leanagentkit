# Getting Started

Lean Agent Kit is a lightweight, tool-agnostic memory and stack-skill system that drops into **any existing project** and turns chaotic AI sessions into a disciplined, repeatable workflow.

## Install

```bash
# into the current directory
npm create lean-agent-kit

# into a new/named folder
npm create lean-agent-kit my-app

# equivalently
npx create-lean-agent-kit .
```

## Bootstrap

Open your AI agent in the project and say:

> Read `.agent/skills/leanagentkit-bootstrap.md` and follow it.

That runs the interactive setup: choose memory tiers, map the codebase, detect your stack, and wire up matching framework skills.

**Flags:** `--force` overwrite existing kit files · `--upgrade` refresh kit files safely · `--help`.

## Upgrade an installed kit

```bash
npm create lean-agent-kit . --upgrade
```

**Refreshed** (kit-owned): `.agent/skills/`, `.agent/stacks/*` playbooks, `.agent/install/` templates, `LEAN_AGENT_KIT_GUIDE.md`, and other template files.

**Preserved** (user-owned): `AGENTS.md`, `docs/CODEBASE_MAP.md`, `docs/memory/*`, `.agent/stacks/registry.md` (your custom rows), `.agent/skills/generated/README.md`, and `docs/adr/0001-*`.

After upgrading, re-run the wire-agent skill if you use Cursor or Claude Code:

> Read `.agent/skills/leanagentkit-wire-agent.md` and follow it.

## The daily loop

```
leanagentkit-start-session → (grill → new-spec → implement-spec for new work) → check → end-session
```

1. **`leanagentkit-start-session`** — primes from `ACTIVE_CONTEXT.md` + `CODEBASE_MAP.md` (cheap, no repo scan).
2. **`leanagentkit-grill` → `leanagentkit-new-spec` → `leanagentkit-implement-spec`** — for new work, align on a plan, freeze a spec, then implement it spec-driven (`leanagentkit-tdd` keeps it test-first).
3. **`leanagentkit-check`** — validates against `AGENTS.md` conventions and stack rules.
4. **`leanagentkit-end-session`** — so the next session starts warm.

When feasibility is unknown ("is this even possible?"), reach for **`leanagentkit-spike`** first — throwaway experiments under `spikes/` that return a VALIDATED / PARTIAL / INVALIDATED verdict before you commit to a real build.

## Learning loop

Generated skills in `.agent/skills/generated/` compound over time:

- **`leanagentkit-distill-skill`** — freeze a repeated session workflow into a reusable skill.
- **`leanagentkit-curate-skills`** — review stale generators; archive, never delete.

See the [Full Guide](/guide#the-learning-loop--distill-curate-improve) for details.

## When the context window fills

Starting a **new chat** when context is almost full is correct — the kit is designed for multi-session work.

- **Mid-task, still continuing** → `leanagentkit-handoff` (writes `docs/memory/HANDOFF.md`) → new chat → `leanagentkit-start-session` → read `HANDOFF.md` and continue.
- **Natural pause** (chunk done, end of day) → `leanagentkit-check` → `leanagentkit-end-session` → new chat later → `leanagentkit-start-session`.

Do not use `end-session` alone when you're resetting only because context is full — it updates durable bookmarks but can miss in-flight conversational state. See [Resetting when the context window fills](/guide#resetting-when-the-context-window-fills) in the full guide.

## What it scaffolds

```
AGENTS.md                 # canonical rulebook + memory protocol
.agent/skills/            # kit skills (source of truth)
.agent/stacks/registry.md # tech → external skill mapping
docs/CODEBASE_MAP.md      # navigation index
docs/memory/              # ACTIVE_CONTEXT, PROGRESS, SCRATCH
docs/specs/  docs/adr/    # feature specs, architecture decisions
```

## Next steps

- Read the [Full Guide](/guide) for the end-to-end playbook.
- Browse [Built-in stack support](/stacks) for detected technologies and external skills.
- See the [GitHub repository](https://github.com/renatoxm/leanagentkit) for the latest releases and changelog.
