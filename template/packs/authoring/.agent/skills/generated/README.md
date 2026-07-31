# Generated Skills

> Part of the **authoring** pack (`--enable-pack authoring`).

Project-specific artifact generators and distilled workflows authored by
`leanagentkit-skill-artifact-template` or `leanagentkit-distill-skill`. Each
is self-contained: it + its recipe in `.agent/recipes/` (when present) is enough
to run the procedure without reading the whole codebase.

Invoke: **"Read `.agent/skills/generated/leanagentkit-<name>.md` and follow it."**

| Generator                                                                                               | Artifact | Recipe | Tags | Related | Status | Last used | Authored |
| ------------------------------------------------------------------------------------------------------- | -------- | ------ | ---- | ------- | ------ | --------- | -------- |
| _(none yet — run `leanagentkit-skill-artifact-template` or `leanagentkit-distill-skill` to author one)_ |          |        |      |         |        |           |          |

**Status values:** `active` (default) · `pinned` (curator must not touch) · `archived` (moved to `archived/`)

**Archive convention:** never delete — move to `.agent/skills/generated/archived/` and set
`status: archived` in frontmatter. Re-run `leanagentkit-wire-agent` to drop wrappers.

`_GENERATOR_TEMPLATE.md` is the blueprint cloned for each new generator — don't run it directly.
Authoring standards: `.agent/skills/references/skill-authoring-standards.md`.
