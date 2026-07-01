---
name: leanagentkit-end-session
description: End a coding session — persist active context, progress, and map updates.
---

# Skill: leanagentkit-end-session

**Goal:** Persist what changed so the next session resumes without re-deriving state.

## Procedure

1. **Run guardrail check** (if code changed this session): `leanagentkit-check` on
   changed files. Address violations or note acknowledged exceptions.
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

## Quality bar

- "Resume from here" is specific enough that a fresh agent could continue with
  no other context.

## When context fills mid-task

If the user is ending the session **only because the context window is full**
and the same task continues in a new chat, run **`leanagentkit-handoff` first**
(or tell the user to). `end-session` alone updates durable bookmarks but may
miss in-flight conversational state. You may run both skills when useful.
