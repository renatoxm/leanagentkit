# Skill: wire-cursor

**Goal:** Install native Cursor project config from kit templates so Cursor
auto-discovers rules and skills. Called from bootstrap when Cursor is selected
as an agent target.

**Reads:** `.agent/install/cursor/` (templates)
**Writes:** `.cursor/rules/`, `.cursor/skills/`

## Procedure

1. **Verify source.** Confirm `.agent/install/cursor/rules/` and
   `.agent/install/cursor/skills/` exist. If missing, stop and report.

2. **Copy rules.** Copy every file from `.agent/install/cursor/rules/` into
   `.cursor/rules/` (create directories as needed). Preserve filenames.

3. **Copy skills.** Copy `.agent/install/cursor/skills/` into `.cursor/skills/`
   recursively, preserving directory structure (`<name>/SKILL.md`).

4. **Idempotency.**
   - First run: create all files.
   - Re-run (bootstrap refresh): overwrite only kit-managed files — i.e. files
     that exist in `.agent/install/cursor/` with the same relative path. Do not
     delete or modify user-added rules or skills under `.cursor/`.
   - If the user explicitly asks to skip existing files, skip instead of overwrite.

5. **Report.** List every file created or updated under `.cursor/rules/` and
   `.cursor/skills/`.

## Notes

- Templates are the source of truth; edit `.agent/install/cursor/`, not `.cursor/`,
  unless intentionally diverging.
- After wiring, Cursor discovers skills from `.cursor/skills/` on next session.
- Stack skills installed via `match-stack` land separately (`.agents/skills/` or
  `.cursor/skills/` via `npx skills add -a cursor --copy`).
