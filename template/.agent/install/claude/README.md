# Claude install templates

These files are **not** active Claude Code config. They are canonical templates
copied into the project when bootstrap selects Claude Code as an agent target.

**Activation:** run `.agent/skills/leanagentkit-wire-agent.md` with target `claude`
(called from bootstrap Step 4).

| Source | Destination |
|--------|-------------|
| `CLAUDE.md` | `CLAUDE.md` (project root) |
| _(generated)_ | `.claude/skills/<name>/SKILL.md` |

Skill wrappers are **generated** from `.agent/skills/leanagentkit-*.md` frontmatter —
not shipped here. Edit skill frontmatter in `.agent/skills/`, then re-run
`leanagentkit-wire-agent` to refresh wrappers.
