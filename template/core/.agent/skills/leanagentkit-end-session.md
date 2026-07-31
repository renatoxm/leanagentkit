---
name: leanagentkit-end-session
description: Optional finalize checklist — persist context, PROGRESS, and pack hooks when the user stops.
---

# Skill: leanagentkit-end-session

**Goal:** Finalize when the user stops so the next session resumes without
re-deriving state. This is the **finalize** checklist in `AGENTS.md` §6.

**Required** when the `spec` pack is installed (PROGRESS/SCRATCH) or
`installedPacks` includes `backlog`, `git-lifecycle`, or `trevor` — ambient
ACTIVE_CONTEXT refresh alone does **not** run pack hooks or PROGRESS updates.

**Optional** on core-only installs if ambient touches already left ACTIVE_CONTEXT
accurate.

For **trivial** work, skip unless focus shifted.

## Procedure

1. **Guardrail check** (if code changed): run `leanagentkit-check` on changed files.
   Address violations or note acknowledged exceptions. If check (or a hook) exposed
   an avoidable failure that was fixed, append or bump `docs/memory/LEARNINGS.md`.
2. **`docs/memory/ACTIVE_CONTEXT.md`** — overwrite if stale: Current focus, Files in
   play, Decisions this session, Open questions, concrete **Resume from here**,
   timestamp. Skip rewrite if ambient touches already left it accurate.
3. **`docs/CODEBASE_MAP.md`** — update only if modules were added/moved/removed.
4. **Spec pack only** (files exist):
   - Prepend a dated entry to `PROGRESS.md` (never edit past entries).
   - Clear `SCRATCH.md`; promote anything still relevant.
   - If a spec was completed **and** user confirms **and** check passed (or exceptions
     acknowledged), set spec `Status: done`; else leave status and note remaining work
     in ACTIVE_CONTEXT.
5. **ADR** — if an architectural decision was made and `docs/adr/` exists, add an ADR.
6. **Pack hooks** (only if pack installed — see stamp / skill files):
   - **git-lifecycle** — if dirty tree and config offers commit at finalize, offer
     save-point commit (never without confirmation).
   - **backlog** — sync card status/notes per `leanagentkit-backlog` (never auto-Done
     unless spec is done).
   - **authoring** — if a workflow repeated 2+ times, mention `leanagentkit-distill-skill`
     once; do not nag.
   - **trevor** — if `end_session_capture: true`, ask once about reminders; otherwise skip.

## Quality bar

- "Resume from here" is specific enough that a fresh agent could continue with no
  other context.

## When context fills mid-task

If ending only because the window is full and the task continues, run
`leanagentkit-handoff` first (or tell the user to). You may run both skills.
