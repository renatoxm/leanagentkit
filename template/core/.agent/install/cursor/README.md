# Cursor install templates

Copied/used by `leanagentkit-wire-agent`:

- `rules/memory.mdc` → `.cursor/rules/` (always-apply pointer to `AGENTS.md` §6)
- `hooks.json` → optional sessionStart/sessionEnd nudges

Skill wrappers are **generated** from `.agent/skills/leanagentkit-*.md` present
on disk (core + installed packs). Re-run wire-agent after `--enable-pack`.
