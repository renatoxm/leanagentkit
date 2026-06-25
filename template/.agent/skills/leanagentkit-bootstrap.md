---
name: leanagentkit-bootstrap
description: One-shot interactive Lean Agent Kit setup — map codebase, detect stack, wire skills. Run this first.
---

# Skill: leanagentkit-bootstrap

**Goal:** One-shot, interactive setup. Drives the whole kit: asks a few questions,
maps the codebase, detects the stack, and wires up matching external skills —
keeping the footprint minimal (no content added that the project doesn't use).

**Run this first.** It calls the other skills in order.

## Principle: lean by default
Only create/keep files the project actually needs. If a tier or stack doesn't
apply, say so and skip it — don't scaffold dead files.

## Step 0 — Interactive questionnaire (ASK, don't assume)
Ask these as a short interactive set. If the host agent supports interactive
multiple-choice prompts (e.g. Cursor, Claude), use them; otherwise ask inline and
wait. Keep to one screen. Skip any question already answered by the repo.

1. **Memory tiers** — which to enable?
   - [x] Long (map + conventions + ADRs)  ← recommended always on
   - [ ] Medium (specs + active context + progress)
   - [ ] Short (scratchpad)
   *(Default: all three. Let the user turn off medium/short for tiny projects.)*
2. **Agent targets** — which tools will use this? (multi-select)
   - Cursor · Claude Code · Copilot · ChatGPT · Aider · Cline · Other
   *(Determines which thin pointer files to generate in Step 4.)*
3. **External stack skills** — auto-install matched ones?
   - Yes, install · Just list commands, I'll run them · Skip
4. **Detail level for the codebase map**
   - Minimal (dirs + entry points) · Standard (+ key modules table) · Deep (+ integrations & cross-cutting)

Record answers into `docs/memory/SCRATCH.md` under "Bootstrap choices" so later
steps and re-runs can read them.

## Step 1 — Map the codebase
Run `leanagentkit-map-codebase` at the chosen detail level → `docs/CODEBASE_MAP.md`.

## Step 2 — Fill conventions
Run `leanagentkit-init-conventions` → `AGENTS.md` sections 1–5.

## Step 3 — Detect & match the stack
Run `leanagentkit-match-stack`. It reads `.agent/stacks/registry.md`, detects technologies,
presents matches for confirmation, installs the ones approved in Step 0, and
appends each stack's AGENTS.md snippet + applies its playbook to CODEBASE_MAP.

## Step 4 — Wire agent pointer files (only for chosen targets)
For each tool selected in Step 0, create a ONE-LINE pointer to AGENTS.md (don't
duplicate rules):
- **Cursor and/or Claude Code** → run `leanagentkit-wire-agent` with the selected
  target(s). Copies static templates (`.cursor/rules/memory.mdc`, `CLAUDE.md`) and
  **generates** skill wrappers from `.agent/skills/*.md` frontmatter. On re-run,
  refreshes only kit-managed files.
- Copilot → `.github/copilot-instructions.md`: "Follow AGENTS.md."
- Aider → `CONVENTIONS.md`: "Follow AGENTS.md."
- ChatGPT/Other → note in README how to paste AGENTS.md.
Skip files for tools not selected.

## Step 5 — Seed decisions (optional, ask)
If the codebase already encodes notable decisions, offer to run `leanagentkit-seed-adrs`.

## Step 5b — Offer artifact generators (optional, ask)
Ask whether the user wants to author any artifact generators now (page, component,
crud, endpoint…). For each chosen type, run `leanagentkit-skill-artifact-template`. These are
optional and add zero footprint until authored.

## Step 6 — Document stack skills in LEAN_AGENT_KIT.md
`LEAN_AGENT_KIT.md` is copied from the kit template at install time (`README.md` →
`LEAN_AGENT_KIT.md` via `create-lean-agent-kit`). After Step 3, replace the
placeholder under `### Stack skills (external, auto-installed)` with the skills
actually installed for this project.

1. Open `LEAN_AGENT_KIT.md` → `### Stack skills (external, auto-installed)`.
2. Replace the placeholder table (`_(none yet)_` row) with one row per stack
   **detected and approved** in Step 3. Omit declined stacks and anything skipped
   in Step 0.
3. For each row, pull from `.agent/stacks/registry.md` (**Provides**) and the
   matching `.agent/stacks/<name>.md` playbook (**Defer to the skill / MCP for**):
   - **Skill** — primary skill or MCP name (e.g. `hono`, `tailwind-4-docs`,
     `cloudflare`, `Svelte MCP`).
   - **Use when** — one line: what to defer to it for, how to invoke, and any
     REQUIRED post-install (e.g. Tailwind docs sync, `@hono/cli`).
4. **Copy-in skills** (`Type: skill`) — note they live under `.agents/skills/`
   (and may be mirrored in `.cursor/skills/` when Cursor was wired). Agents
   auto-discover them for matching tech; or say explicitly: "use the `hono`
   skill when …".
5. **MCP rows** (`Type: mcp`, e.g. Svelte) — note there is no skills folder;
   the agent must use the configured MCP server (`.cursor/mcp.json` or
   `.mcp.json`). Say "use Svelte MCP tools before answering from memory."
6. If **no** stack skills were installed, replace the table body with a single
   line: _No external stack skills installed. Re-run `leanagentkit-match-stack` after adding
   dependencies._
7. **Idempotent:** on re-run, replace the entire table under that heading — do
   not append duplicate rows.

Keep the intro paragraph above the table; only replace the table (and optional
post-install bullets immediately below it).

## Step 7 — Summarize
Print: tiers enabled, files created, stacks detected + install status (with any
REQUIRED post-install steps, e.g. Tailwind snapshot sync), `LEAN_AGENT_KIT.md`
stack-skills section updated, and the daily loop (`leanagentkit-start-session` →
`leanagentkit-check` → `leanagentkit-end-session`). Clear bootstrap notes from SCRATCH.

## Step 8 — Stamp dates
Set today's date anywhere still showing `<!-- YYYY-MM-DD -->` or unfilled placeholders:
- `AGENTS.md` header `Last updated`
- `docs/CODEBASE_MAP.md` `Last updated`
- `docs/adr/0001-record-architecture-decisions.md` `Date` (if still a placeholder)

## Re-running
Safe to re-run. Re-detect stack, refresh the map, never clobber human-written ADRs
or PROGRESS history.
