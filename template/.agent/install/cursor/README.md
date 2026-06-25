# Cursor install templates

These files are **not** active Cursor config. They are canonical templates copied
into `.cursor/` when bootstrap selects Cursor as an agent target.

**Activation:** run `.agent/skills/leanagentkit-wire-agent.md` with target `cursor`
(called from bootstrap Step 4).

| Source | Destination |
|--------|---------------|
| `rules/memory.mdc` | `.cursor/rules/memory.mdc` |
| _(generated)_ | `.cursor/skills/<name>/SKILL.md` |

Skill wrappers are **generated** from `.agent/skills/leanagentkit-*.md` frontmatter —
not shipped here. Edit skill frontmatter in `.agent/skills/`, then re-run
`leanagentkit-wire-agent` to refresh wrappers.
