---
name: leanagentkit-end-session
description: End a coding session — persist active context, progress, and map updates.
---

# Skill: leanagentkit-end-session

**Goal:** Persist what changed so the next session resumes without re-deriving state.

## Procedure

1. **Run guardrail check** (if code changed this session): `leanagentkit-check` on
   changed files. Address violations or note acknowledged exceptions.
   - **Git lifecycle (optional).** If git lifecycle integration is active (see
     `leanagentkit-git-lifecycle` detection contract), the working tree is dirty,
     and `offer_commit_at_end_session: true`, offer a save-point commit per that
     skill. Never commit without user confirmation.
2. **`docs/memory/ACTIVE_CONTEXT.md`** — overwrite:
   - Current focus, Files in play, Decisions made this session, Open questions,
     and a concrete **Resume from here** note. Update the timestamp.
3. **`docs/memory/PROGRESS.md`** — prepend a dated entry: Done / Left / Notes.
   Never edit past entries.
4. **`docs/CODEBASE_MAP.md`** — if you added, moved, or removed a module, update
   the relevant line(s) and the date.
5. **`docs/adr/`** — if an architectural decision was made, add a new ADR
   (use `leanagentkit-seed-adrs` style / `_TEMPLATE.md`).
6. **`docs/memory/SCRATCH.md`** — clear it; promote anything still relevant into
   the files above.
7. If a spec was completed, set its `Status: done`.
8. **Backlog.md (optional).** If Backlog integration is active and the completed
   spec has a `Backlog:` id:
   - **Only when** the spec is `Status: done`, move the card to Done:
     ```bash
     backlog task edit <task-id> -s "Done" --append-final-summary "<brief note>" --plain
     ```
   - If the spec is **not** done, sync progress only — never auto-complete:
     ```bash
     backlog task edit <task-id> --append-notes "<from Resume from here>" --plain
     ```
   Ending a session alone does **not** complete a card. If Backlog is not active,
   skip silently.
9. **Learning-loop nudges** (mention to the user when applicable):
   - Repeated the same workflow 2+ times this session → suggest
     `leanagentkit-distill-skill` to freeze it.
   - Generated skills registry has grown or nothing was curated recently → suggest
     `leanagentkit-curate-skills`.

10. **Trevor reminder capture (optional).** If `.leanagentkit/trevor.yml` exists
    with `enabled: true` and `end_session_capture: true`:
    - Ask once: `[🤖 Trevor] Anything I should remind you about next session?`
    - **Yes** → append new `R-NNN` to `docs/memory/REMINDERS.md` with
      `status: pending`, `created: today`, `show_after: tomorrow` (or user's
      date), and the user's note.
    - **No** → skip. One question only — do not turn end-session into a
      questionnaire. If config missing or disabled, skip silently.

## Quality bar

- "Resume from here" is specific enough that a fresh agent could continue with
  no other context.

## When context fills mid-task

If the user is ending the session **only because the context window is full**
and the same task continues in a new chat, run **`leanagentkit-handoff` first**
(or tell the user to). `end-session` alone updates durable bookmarks but may
miss in-flight conversational state. You may run both skills when useful.
