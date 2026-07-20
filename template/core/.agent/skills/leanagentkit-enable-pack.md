---
name: leanagentkit-enable-pack
description: Install one or more Lean Agent Kit packs into an existing project (opt-in overlays).
---

# Skill: leanagentkit-enable-pack

**Goal:** Add optional packs to a core install without re-scaffolding.

## Packs

| Id | Depends on | What you get |
|----|------------|--------------|
| `spec` | — | Grill, specs, implement-spec, spikes, ADRs, PROGRESS/SCRATCH |
| `stacks` | — | Stack registry, match-stack, scaffolders |
| `practice` | — | Engineering guardrail skills |
| `architecture` | `spec` | CA/DDD decomposition, slices |
| `backlog` | `spec` | Backlog.md sync |
| `git-lifecycle` | `spec` | Branch/commit/PR offers, babysit-pr |
| `trevor` | — | Concierge, reminders, checklists |
| `caveman` | — | Terse commits/reviews (optional terse chat) |
| `authoring` | — | create/distill/curate skills, generators |
| `imaginary` | — | Resize/crop/convert images via h2non/imaginary |

## Procedure

1. Read `.agent/.leanagentkit-version` → note current `installedPacks`.
2. Ask which packs to enable (multi-select). Recommend based on need:
   - Feature work → `spec` (+ optional `stacks`)
   - Conventions enforcement beyond check → `practice`
   - Greenfield app → `stacks`
3. Resolve dependencies — CLI **auto-installs** deps (architecture / backlog /
   git-lifecycle pull in `spec`). Confirm the summary lists any auto-added packs.
4. Run from the project root:

   ```bash
   npx create-lean-agent-kit@latest . --enable-pack <id>[,<id>...]
   ```

   Pin `@latest`. Use `--force` only to overwrite differing pack files.
5. Confirm stamp `installedPacks` updated.
6. Update `AGENTS.md` §7 with a short line per new pack.
7. If Cursor/Claude: run `leanagentkit-wire-agent` so wrappers include new skills.
8. For packs with config examples (trevor, caveman, git-lifecycle, architecture,
   imaginary), offer to copy `.leanagentkit/<name>.yml.example` →
   `.leanagentkit/<name>.yml`.

## Do not

- Do not copy pack files by hand from the npm package unless the CLI is unavailable.
- Do not skip AGENTS.md §7 update after enabling packs.
