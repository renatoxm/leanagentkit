---
name: leanagentkit-bootstrap
description: One-shot interactive Lean Agent Kit setup — map codebase, conventions, wire agents, offer packs. Run this first.
---

# Skill: leanagentkit-bootstrap

**Goal:** Interactive setup for the **lean core**. Maps the codebase, fills
conventions, wires agents, and offers optional **packs** (do not install packs
unless the user chooses them).

**Run this first.**

## Principle: lean by default

Only create what the project needs. Core is enough for map + session memory +
convention check. Packs are opt-in.

## Step 0 — Questionnaire

Ask as a short interactive set (host UI when available):

1. **Map detail** — Minimal · Standard (recommended) · Deep
2. **Agent targets** — Cursor · Claude Code · Copilot · ChatGPT · Aider · Cline · Other
3. **Optional packs** (multi-select; default none) — briefly explain each:
   - `spec` — features via grill → spec → implement
   - `stacks` — detect stack + scaffold recipes
   - `practice` — review/debug/tdd/security guardrails
   - `architecture` — needs `spec` — CA/DDD slices
   - `backlog` — needs `spec` — Backlog.md board
   - `git-lifecycle` — needs `spec` — branch/commit/PR offers
   - `trevor` — reminders/checklists concierge
   - `caveman` — terse commits/reviews
   - `authoring` — distill/create project skills
   - `imaginary` — resize/crop/convert via h2non/imaginary Docker

If the user picks packs that need `spec`, include `spec` automatically and say so.

**Greenfield:** If the repo is empty or kit-only (no app), and `stacks` will be
installed, offer to run `leanagentkit-scaffold` after packs are enabled. If
`stacks` is not selected, skip scaffolding.

Record choices in a temporary note (or SCRATCH if spec pack will exist); clear at end.

## Step 1 — Enable chosen packs

If any packs were selected:

```bash
npx create-lean-agent-kit@latest . --enable-pack <comma-separated>
```

Confirm `.agent/.leanagentkit-version` → `installedPacks`.

If none selected, continue with core only.

## Step 2 — Map the codebase

Run `leanagentkit-map-codebase` at the chosen detail level → `docs/CODEBASE_MAP.md`.

## Step 3 — Fill conventions

Run `leanagentkit-init-conventions` → `AGENTS.md` sections 1–5.

If `stacks` pack is installed, run `leanagentkit-match-stack` (detect, confirm,
optional external skill install) and note results in `AGENTS.md` §7.

## Step 4 — Wire agent pointers

For each tool selected in Step 0:

- **Cursor and/or Claude Code** → run `leanagentkit-wire-agent` (wrappers for
  core + installed pack skills only).
- Copilot → `.github/copilot-instructions.md`: "Follow AGENTS.md."
- Aider → `CONVENTIONS.md`: "Follow AGENTS.md."
- ChatGPT/Other → note in project README how to paste AGENTS.md.

## Step 5 — Pack-specific follow-ups (only if installed)

- **spec** — offer `leanagentkit-seed-adrs` if the codebase encodes decisions.
- **trevor / caveman / git-lifecycle / architecture / imaginary** — offer to copy
  the matching `.leanagentkit/*.yml.example` → `*.yml`.
- **backlog** — offer install guide only if user wants a board (do not assume).
- **imaginary** — offer docker run / compose from the skill reference; do not
  start the container unless asked.
- **authoring** — mention distill/curate; do not author generators unless asked.

## Step 6 — Document in LEAN_AGENT_KIT.md

Ensure `LEAN_AGENT_KIT.md` lists installed packs (from stamp). Keep the core pitch;
do not claim uninstalled packs are present.

## Step 7 — Summarize

Print: map detail, agents wired, `installedPacks`, workflow sizes (trivial /
normal / substantial), and:

```
leanagentkit-start-session → work → leanagentkit-check → leanagentkit-end-session
```

## Step 8 — Stamp dates

Set today on `AGENTS.md` and `docs/CODEBASE_MAP.md` placeholders.

## Re-running

Safe to re-run. Never clobber human ADRs or PROGRESS history. Prefer
`leanagentkit-enable-pack` for adding packs later.
