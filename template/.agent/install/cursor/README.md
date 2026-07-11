# Cursor install templates

These files are **not** active Cursor config. They are canonical templates copied
into `.cursor/` when bootstrap selects Cursor as an agent target.

**Activation:** run `.agent/skills/leanagentkit-wire-agent.md` with target `cursor`
(called from bootstrap Step 4).

| Source | Destination |
|--------|-------------|
| `rules/memory.mdc` | `.cursor/rules/memory.mdc` |
| `hooks.json` | `.cursor/hooks.json` *(opt-in during wire-agent)* |
| _(generated)_ | `.cursor/skills/<name>/SKILL.md` |

Skill wrappers are **generated** from `.agent/skills/leanagentkit-*.md` frontmatter —
not shipped here. Edit skill frontmatter in `.agent/skills/`, then re-run
`leanagentkit-wire-agent` to refresh wrappers.

## Cursor session hooks (optional)

`hooks.json` installs **prompt hooks** that nudge the agent toward
`leanagentkit-start-session` at session start and `leanagentkit-end-session` at
session end. Hooks are Cursor-only and opt-in — `wire-agent` asks before copying
or merging. LAK-marked entries contain the phrase `Lean Agent Kit session` so
re-runs can update kit hooks without removing user hooks.
