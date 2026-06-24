# Skill: wire-claude

**Goal:** Install native Claude Code project config from kit templates so Claude
auto-discovers memory instructions and skills. Called from bootstrap when Claude
Code is selected as an agent target.

**Reads:** `.agent/install/claude/` (templates)
**Writes:** `CLAUDE.md` (project root), `.claude/skills/`

## Procedure

1. **Verify source.** Confirm `.agent/install/claude/CLAUDE.md` and
   `.agent/install/claude/skills/` exist. If missing, stop and report.

2. **Copy memory file.** Copy `.agent/install/claude/CLAUDE.md` to the project
   root as `CLAUDE.md`.

3. **Copy skills.** Copy `.agent/install/claude/skills/` into `.claude/skills/`
   recursively, preserving directory structure (`<name>/SKILL.md`).

4. **Idempotency.**
   - First run: create all files.
   - Re-run (bootstrap refresh): overwrite only kit-managed files — i.e. files
     that exist in `.agent/install/claude/` with the same relative path. Do not
     delete or modify user-added skills under `.claude/`.
   - If the user explicitly asks to skip existing files, skip instead of overwrite.

5. **Report.** List every file created or updated (`CLAUDE.md` and under
   `.claude/skills/`).

## Notes

- Templates are the source of truth; edit `.agent/install/claude/`, not root
  `CLAUDE.md` or `.claude/`, unless intentionally diverging.
- After wiring, Claude Code discovers skills from `.claude/skills/` on next session.
- Stack skills installed via `match-stack` land separately (`.claude/skills/` via
  `npx skills add -a claude-code`).
