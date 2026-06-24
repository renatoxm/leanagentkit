# Skill: end-session

**Goal:** Persist what changed so the next session resumes without re-deriving state.

## Procedure

1. **`docs/memory/ACTIVE_CONTEXT.md`** — overwrite:
   - Current focus, Files in play, Decisions made this session, Open questions,
     and a concrete **Resume from here** note. Update the timestamp.
2. **`docs/memory/PROGRESS.md`** — prepend a dated entry: Done / Left / Notes.
   Never edit past entries.
3. **`docs/CODEBASE_MAP.md`** — if you added, moved, or removed a module, update
   the relevant line(s) and the date.
4. **`docs/adr/`** — if an architectural decision was made, add a new ADR
   (use `seed-adrs` style / `_TEMPLATE.md`).
5. **`docs/memory/SCRATCH.md`** — clear it; promote anything still relevant into
   the files above.
6. If a spec was completed, set its `Status: done`.

## Quality bar

- "Resume from here" is specific enough that a fresh agent could continue with
  no other context.
