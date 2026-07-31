---
name: leanagentkit-bootstrap
description: One-shot interactive Lean Agent Kit setup — map codebase, conventions, wire agents; offer packs only if none installed yet. Run this first.
---

# Skill: leanagentkit-bootstrap

**Goal:** Interactive setup for the **lean core**. Maps the codebase, fills
conventions, wires agents, and offers optional **packs** only when none are
already installed (do not install packs unless the user chooses them).

**Run this first.**

## Principle: lean by default

Only create what the project needs. Core is enough for map + ambient session memory +
LEARNINGS self-improvement + convention check. Packs are opt-in.

## Step 0 — Questionnaire

**Packs already installed?** Read `.agent/.leanagentkit-version` →
`installedPacks` first. If the list is non-empty (typical after
`create-lean-agent-kit` with packs selected), **do not** ask about optional
packs — note the active packs briefly and skip Step 1. To add more later, use
`leanagentkit-enable-pack`.

Ask as a short interactive set (host UI when available):

1. **Map detail** — Minimal · Standard (recommended) · Deep
2. **Agent targets** — Cursor · Claude Code · Copilot · ChatGPT · Aider · Cline · Other
3. **Optional packs** — **only if** `installedPacks` is empty or missing
   (core-only install). Multi-select; default none — briefly explain each:
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

**Greenfield:** If the repo is empty or kit-only (no app), and `stacks` is
already installed or will be, offer to run `leanagentkit-scaffold` after packs
are ready. If `stacks` is not selected and not already installed, skip
scaffolding.

Record choices in a temporary note (or SCRATCH if spec pack will exist); clear at end.

## Step 1 — Enable chosen packs

Skip if packs were already installed (Step 0 check) or none were selected in
Step 0.

If any packs were selected in Step 0:

```bash
npx create-lean-agent-kit@latest . --enable-pack <comma-separated>
```

Confirm `.agent/.leanagentkit-version` → `installedPacks`.

If none selected and none were already installed, continue with core only.

## Step 2 — Map the codebase

Run `leanagentkit-map-codebase` at the chosen detail level → `docs/CODEBASE_MAP.md`.

## Step 3 — Fill conventions

Run `leanagentkit-init-conventions` → `AGENTS.md` sections 1–5.

**If `AGENTS.md` already exists** (and is not a blank kit stub): that skill
**warns the user**, backs up to `.leanagentkit-backup/<timestamp>/AGENTS.md`,
then **merges** — keeps compatible project rules; drops only instructions that
conflict with the LAK memory protocol or make agent guidance ambiguous. Do not
skip the backup/warn path or rewrite from a blank template.

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
normal / substantial), ambient memory + LEARNINGS, and:

```
work (ambient touches) → leanagentkit-check → finalize
  (end-session required when spec/backlog/git-lifecycle/trevor installed)
```

`leanagentkit-start-session` remains optional for pack preamble hooks; §6 ambient
reads are enough for core priming.

## Step 8 — Stamp dates

Set today on `AGENTS.md` and `docs/CODEBASE_MAP.md` placeholders.

## Re-running

Safe to re-run. Never clobber human ADRs or PROGRESS history. Never erase a
non-stub `AGENTS.md` without backup + merge (see `leanagentkit-init-conventions`).
Prefer `leanagentkit-enable-pack` for adding packs later.
