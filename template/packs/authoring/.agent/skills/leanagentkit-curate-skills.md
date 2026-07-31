---
name: leanagentkit-curate-skills
description: "Review generated skills; archive stale, never delete."
---

# Skill: leanagentkit-curate-skills

**Goal:** Periodically review project-generated skills in `.agent/skills/generated/`,
flag stale/duplicate/superseded generators, and propose consolidation — the manual,
file-based equivalent of Hermes's background curator.

**Run when:** "curate my skills", "clean up generated skills", periodically after
several sessions, or when finalize / `end-session` nudges you.

**Reads:** `.agent/skills/generated/*`, `.agent/skills/generated/README.md`,
`.agent/recipes/*`
**Writes:** frontmatter updates, moves to `generated/archived/`, `PROGRESS.md` entry

---

## Hard invariants (never violate)

1. **Never delete** a skill file. Archive only.
2. **Archive is recoverable** — move to `.agent/skills/generated/archived/` and set
   `status: archived` in frontmatter.
3. **`status: pinned`** bypasses all suggestions — do not propose archive or
   consolidation for pinned skills.
4. **Kit-owned skills are off-limits** — only review files under `generated/`
   (not `leanagentkit-*.md` at the top level of `.agent/skills/`).

---

## Procedure

### 1. Inventory

List every skill in `.agent/skills/generated/leanagentkit-*.md` (exclude
`_GENERATOR_TEMPLATE.md` and anything under `archived/`). For each, read frontmatter:
`name`, `description`, `status`, `related`, `metadata.tags`, `source`, and
`## Learned notes`.

Cross-reference `.agent/skills/generated/README.md` — flag registry rows with no
matching file or files with no registry row.

### 2. Assess each skill

| Signal                                                     | Suggestion                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| Not referenced in README `Last used` for 30+ days          | Mark **stale** — propose archive                             |
| Overlaps another skill's procedure (>70% similar steps)    | Mark **duplicate** — propose merge or archive the weaker one |
| Superseded by a newer generator for the same artifact type | Mark **superseded** — propose archive the old one            |
| `status: pinned`                                           | **Skip** — no action                                         |
| `status: archived`                                         | Already archived — verify file is under `archived/`          |
| Active and recently used                                   | **Keep** — no action                                         |

### 3. Present findings

Show the user a table: Skill | Status | Issue | Proposed action.
Ask for approval before making any changes. Default to conservative: when unsure, keep.

### 4. Apply approved actions

**Archive** (never delete):

1. Set `status: archived` in frontmatter.
2. Move file to `.agent/skills/generated/archived/<filename>`.
3. Update registry row Status to `archived`.
4. Remove Cursor/Claude wrappers if present (or re-run `leanagentkit-wire-agent`).

**Pin** (user request):

1. Set `status: pinned` in frontmatter.
2. Update registry row Status to `pinned`.

**Consolidate** (merge duplicates):

1. Merge the stronger procedure into one skill.
2. Archive the weaker duplicate (steps above).
3. Update `related` links on surviving skill.

### 5. Record

Prepend a dated entry to `docs/memory/PROGRESS.md`:

- Skills reviewed: N
- Archived: [names]
- Pinned: [names]
- Kept: [names]
- Notes: any consolidation done

### 6. Report

Summarize what changed and what was kept. Remind the user archived skills live in
`generated/archived/` and can be restored by moving back and setting `status: active`.

## Rules

- **Suggest, don't surprise** — always get approval before archiving.
- Update `Last used` in the registry when a skill is invoked during normal work
  (not only during curation).
- Append new gotchas to `## Learned notes` during curation if you discover them —
  do not rewrite procedures.
