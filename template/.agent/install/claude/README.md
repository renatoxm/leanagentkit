# Claude install templates

These files are **not** active Claude Code config. They are canonical templates
copied into the project when bootstrap selects Claude Code as an agent target.

**Activation:** run `.agent/skills/leanagentkit-wire-claude.md` (called from bootstrap Step 4).

| Source | Destination |
|--------|-------------|
| `CLAUDE.md` | `CLAUDE.md` (project root) |
| `skills/<name>/SKILL.md` | `.claude/skills/<name>/SKILL.md` |

Each skill wrapper delegates to the tool-agnostic skill in `.agent/skills/`.
Edit the source templates here to change what `leanagentkit-wire-claude` installs; do not edit
`.claude/` or root `CLAUDE.md` by hand unless you intend to diverge from the kit.
