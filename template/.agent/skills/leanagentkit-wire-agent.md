---
name: leanagentkit-wire-agent
description: Wire Cursor or Claude Code — copy memory pointers and generate skill wrappers from .agent/skills/.
---

# Skill: leanagentkit-wire-agent

**Goal:** Install native agent config for Cursor and/or Claude Code. Copies memory
pointer files from kit templates and **generates** skill wrappers from
`.agent/skills/*.md` frontmatter — no pre-shipped wrapper files.

**Input:** agent target(s) from bootstrap Step 0: `cursor`, `claude`, or both.

**Reads:** `.agent/install/<target>/`, `.agent/skills/leanagentkit-*.md`
**Writes:** `.cursor/rules/`, `.cursor/skills/`, `CLAUDE.md`, `.claude/skills/`

## Procedure

### 1. For each selected target, copy static templates

**Cursor** (`cursor` selected):
- Copy `.agent/install/cursor/rules/*` → `.cursor/rules/` (create dirs as needed).
- Do **not** copy anything from `.agent/install/cursor/skills/` — wrappers are generated in step 2.

**Claude Code** (`claude` selected):
- Copy `.agent/install/claude/CLAUDE.md` → project root `CLAUDE.md`.
- Do **not** copy anything from `.agent/install/claude/skills/` — wrappers are generated in step 2.

### 2. Generate skill wrappers from `.agent/skills/`

For every file matching `.agent/skills/leanagentkit-*.md` (top-level only — not
`generated/`):

1. Read the file's YAML frontmatter (`name`, `description`, optional `invocation`).
2. Write a wrapper `SKILL.md` for each selected target:

**Cursor** → `.cursor/skills/<name>/SKILL.md`:
- Only `invocation: auto` (always-on practice guardrails) **omits**
  `disable-model-invocation`, so the agent can auto-load the skill when relevant.
- Everything else includes `disable-model-invocation: true` so the agent only
  runs it when explicitly asked. This covers orchestration skills (no
  `invocation` field) **and** `invocation: conditional` practice skills (ci-cd,
  observability), which ship dormant and are advertised in `AGENTS.md §7` only
  when `leanagentkit-match-stack` detects them.

```markdown
---
name: <name>
description: <description>
disable-model-invocation: true   ← omit this line ONLY when invocation: auto
---

Read `.agent/skills/<name>.md` and follow it.
```

**Claude Code** → `.claude/skills/<name>/SKILL.md`:
```markdown
---
name: <name>
description: <description>
---

Read `.agent/skills/<name>.md` and follow it.
```

Also generate wrappers for any authored generators in
`.agent/skills/generated/leanagentkit-create-*.md` (exclude `_GENERATOR_TEMPLATE.md`),
using the same pattern but pointing at `.agent/skills/generated/<name>.md`.

### 3. Idempotency

- Re-run (bootstrap refresh): overwrite only kit-managed files — static templates
  from `.agent/install/` and wrappers for skills listed above.
- Do not delete or modify user-added rules/skills under `.cursor/` or `.claude/`.
- If the user explicitly asks to skip existing files, skip instead of overwrite.

### 4. Report

List every file created or updated per target.

## Notes

- `.agent/skills/*.md` is the single source of truth for skill content and metadata.
- Edit skill frontmatter there; re-run this skill to refresh wrappers.
- Practice guardrails use `invocation: auto` in frontmatter — Cursor wrappers omit
  `disable-model-invocation` so agents can lazy-load them.
- Stack skills from `leanagentkit-match-stack` land separately (`.agents/skills/` or via `npx skills add`).
