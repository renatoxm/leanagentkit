# Skill: bootstrap

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
Run `map-codebase` at the chosen detail level → `docs/CODEBASE_MAP.md`.

## Step 2 — Fill conventions
Run `init-conventions` → `AGENTS.md` sections 1–5.

## Step 3 — Detect & match the stack
Run `match-stack`. It reads `.agent/stacks/registry.md`, detects technologies,
presents matches for confirmation, installs the ones approved in Step 0, and
appends each stack's AGENTS.md snippet + applies its playbook to CODEBASE_MAP.

## Step 4 — Wire agent pointer files (only for chosen targets)
For each tool selected in Step 0, create a ONE-LINE pointer to AGENTS.md (don't
duplicate rules):
- Cursor → run `wire-cursor` (copies `.agent/install/cursor/` → `.cursor/rules/memory.mdc`
  + `.cursor/skills/*` skill wrappers). On re-run, refreshes only kit-managed files.
- Claude Code → run `wire-claude` (copies `CLAUDE.md` to root + `.claude/skills/*`
  skill wrappers). On re-run, refreshes only kit-managed files.
- Copilot → `.github/copilot-instructions.md`: "Follow AGENTS.md."
- Aider → `CONVENTIONS.md`: "Follow AGENTS.md."
- ChatGPT/Other → note in README how to paste AGENTS.md.
Skip files for tools not selected.

## Step 5 — Seed decisions (optional, ask)
If the codebase already encodes notable decisions, offer to run `seed-adrs`.

## Step 5b — Offer artifact generators (optional, ask)
Ask whether the user wants to author any artifact generators now (page, component,
crud, endpoint…). For each chosen type, run `skill-artifact-template`. These are
optional and add zero footprint until authored.

## Step 6 — Summarize
Print: tiers enabled, files created, stacks detected + install status (with any
REQUIRED post-install steps, e.g. Tailwind snapshot sync), and the daily loop
(`start-session` / `end-session`). Clear bootstrap notes from SCRATCH.

## Re-running
Safe to re-run. Re-detect stack, refresh the map, never clobber human-written ADRs
or PROGRESS history.
