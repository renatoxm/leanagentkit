# Cursor install templates

These files are **not** active Cursor config. They are canonical templates copied
into `.cursor/` when bootstrap selects Cursor as an agent target.

**Activation:** run `.agent/skills/leanagentkit-wire-cursor.md` (called from bootstrap Step 4).

| Source | Destination |
|--------|---------------|
| `rules/memory.mdc` | `.cursor/rules/memory.mdc` |
| `skills/<name>/SKILL.md` | `.cursor/skills/<name>/SKILL.md` |

Each skill wrapper delegates to the tool-agnostic skill in `.agent/skills/`.
Edit the source templates here to change what `leanagentkit-wire-cursor` installs; do not edit
`.cursor/` by hand unless you intend to diverge from the kit.
