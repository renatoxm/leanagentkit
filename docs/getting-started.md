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

**Preserved** (user-owned): `AGENTS.md`, `docs/CODEBASE_MAP.md`, `docs/memory/*`, `.agent/stacks/registry.md` (your custom rows), and `docs/adr/0001-*`.

After upgrading, re-run the wire-agent skill if you use Cursor or Claude Code:

> Read `.agent/skills/leanagentkit-wire-agent.md` and follow it.

## The daily loop

```
leanagentkit-start-session → (grill → new-spec for new work) → work → check → end-session
```

1. **`leanagentkit-start-session`** — primes from `ACTIVE_CONTEXT.md` + `CODEBASE_MAP.md` (cheap, no repo scan).
2. **`leanagentkit-grill` → `leanagentkit-new-spec`** — for new work, interrogates you into a clear plan and freezes a spec before coding.
3. **Work together** — you build the feature.
4. **`leanagentkit-check`** — validates against `AGENTS.md` conventions and stack rules.
5. **`leanagentkit-end-session`** — so the next session starts warm.

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
