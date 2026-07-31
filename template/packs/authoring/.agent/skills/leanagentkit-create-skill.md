---
name: leanagentkit-create-skill
description: "Create or refactor project skills to LAK standards."
metadata:
  tags: [SkillAuthoring, Meta]
  source: mattpocock/skills/writing-great-skills (MIT)
  upstream: https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills
---

# Skill: leanagentkit-create-skill

**Goal:** Author or refactor project-specific skills so the agent follows the same
_process_ every run — **predictability**, not identical output. Applies LAK
format rules plus craft levers from `skill-craft-glossary.md`.

**Does not:** distill session workflows (use `leanagentkit-distill-skill`), infer
artifact generators from code examples (use `leanagentkit-skill-artifact-template`),
or archive stale skills (use `leanagentkit-curate-skills`). Does not modify
kit-owned `leanagentkit-*.md` in user projects.

## When to Use

- "Create a skill for …"
- "Refactor this skill" / "this skill is too long" / "skill keeps skipping steps"
- "Improve skill predictability" / "remove duplication from the skill"
- Craft pass after `leanagentkit-distill-skill` or `leanagentkit-skill-artifact-template`
  produced a draft

## Prerequisites

Read before writing or editing:

1. `.agent/skills/references/skill-authoring-standards.md` — frontmatter, WHAT+WHEN
   descriptions (≤200 soft / ≤1024 hard), section order, output paths
2. `.agent/skills/references/skill-craft-glossary.md` — predictability, hierarchy,
   failure modes, LAK overrides

## How to Run

> Read `.agent/skills/leanagentkit-create-skill.md` and follow it.

For refactor: name the target file (usually under `.agent/skills/generated/`).

For a **craft pass** from another meta-skill: say _craft pass only_ and name the
draft file — skip Orient delegation and steps 5–6 (Register & wire, Report); the
caller registers and reports.

## Quick Reference

| Request                      | Path                                                                       |
| ---------------------------- | -------------------------------------------------------------------------- |
| Session → skill              | `leanagentkit-distill-skill` → craft pass here (craft pass only)           |
| Example → generator          | `leanagentkit-skill-artifact-template` → craft pass here (craft pass only) |
| Requirements → new skill     | This skill — create branch (full flow)                                     |
| Fix existing generated skill | This skill — refactor branch (full flow)                                   |
| Stale / duplicate registry   | `leanagentkit-curate-skills`                                               |

## Procedure

### 1. Orient

**Craft pass only** — when invoked from `leanagentkit-distill-skill` step 5b or
`leanagentkit-skill-artifact-template` step 6b, or when the prompt says _craft pass_:

- Skip delegation to distill or artifact-template.
- Go directly to **step 4 (Refactor branch)** on the named draft file.
- Stop after step 4 — do **not** run steps 5–6; the caller handles register and report.

**User entry** — otherwise determine which path applies (see Quick Reference):

- Session workflow or artifact from example → run that skill first; do **not** continue
  in this skill until the caller invokes a craft pass.
- Greenfield skill from requirements → **step 3 (Create branch)**.
- Refactor an existing generated skill → **step 4 (Refactor branch)**, then steps 5–6.

Confirm the **write target**:

- **User projects:** `.agent/skills/generated/leanagentkit-<name>.md` (+ optional
  recipe; registry and wrappers only when running the full flow)
- **Never modify** kit-owned `.agent/skills/leanagentkit-*.md` except when
  developing Lean Agent Kit itself in this repo

### 2. Scope guardrails (never violate)

1. **Never delete** a skill — archive via `leanagentkit-curate-skills`.
2. **`description` ≤1024 characters** (soft target ≤200) — WHAT + WHEN, count before saving generated skills.
3. **Never invent** flags, paths, or APIs not seen in source material.
4. **Router/index-only skills forbidden** — every skill must be runnable on its own.
5. Register new skills in `.agent/skills/generated/README.md` — **full flow only**
   (not during craft pass only).

### 3. Create branch

1. **Gather** — purpose, trigger phrases, prerequisites, exact commands/paths from
   evidence (repo, session, or user spec). Show a summary; confirm with the user
   before writing.
2. **Name** — lowercase-hyphenated, ≤64 chars, capability not implementation.
3. **Draft** — write `.agent/skills/generated/leanagentkit-<name>.md` with
   agentskills.io frontmatter (`version: 0.1.0`, `related`, `metadata.tags`,
   `source`, `status: active`) and body sections per authoring standards.
4. **Craft pass** — apply glossary levers:
   - Steps end on checkable **completion criteria**
   - Push long reference to a sibling file with a sharp **context pointer**
   - **Co-locate** related rules under one heading
   - **Collapse duplication**; delete **no-ops**
   - Prefer **leading words** over restated triads
5. Continue to step 5 (Register & wire).

If the workflow needs parameterization, also write
`.agent/recipes/<name>.recipe.md` from `.agent/recipes/_TEMPLATE.recipe.md`.

### 4. Refactor branch

1. **Read** the target skill and its disclosed references.
2. **Diagnose** using failure modes from the glossary (premature completion,
   duplication, sediment, sprawl, no-op). List findings for the user.
3. **Fix in order:**
   - Sharpen **completion criteria** (cheap, local)
   - Delete **no-ops** sentence by sentence
   - **Collapse duplication** to single source of truth
   - **Progressive disclosure** — move reference to a sibling `.md` with a pointer
   - **Split** only when granularity earns it (by invocation or by sequence)
4. Re-check against authoring standards (frontmatter, WHAT+WHEN description, section
   order). Preserve `## Learned notes` — append only, do not rewrite history.
5. **Full flow only:** continue to step 5 if registry or wrappers need updates,
   then step 6. **Craft pass only:** stop here — return control to the caller.

### 5. Register & wire

Full flow only — skip during craft pass only.

Append or update a row in `.agent/skills/generated/README.md` (Tags, Related,
Status, Last used). If `.cursor/skills/` or `.claude/skills/` exist, offer
`leanagentkit-wire-agent` (do not hand-write individual wrapper files).

### 6. Report

Full flow only — skip during craft pass only.

Tell the user: skill name, file path, invocation string, what changed and why
(for refactor: which failure modes were addressed).

## Pitfalls

- **Craft pass only** must not register, wire wrappers, or re-delegate to distill
  or artifact-template — the caller owns those steps.
- **Description policy** beats craft vocabulary in frontmatter — state WHAT + WHEN with
  trigger terms; soft target ≤200 chars for generated skills.
- Cursor-style rich descriptions (up to 1024) are for discovery; keep generated skills
  concise unless triggers truly need more.
- Do not rewrite `## Learned notes` history during refactor — append new gotchas only.
- Weak leading words (_be thorough_) are no-ops — use stronger pretrained words
  (_relentless_) or delete.
- Splitting too early spends context or cognitive load — split only when invocation
  or sequence cut is clearly worth it.

## Verification

Before finishing, confirm:

- [ ] `description` WHAT+WHEN, ≤1024 chars (generated skills; soft target ≤200)
- [ ] Frontmatter complete per authoring standards
- [ ] Section order matches standards; `## Learned notes` present for generated skills
- [ ] Each procedure step has a checkable completion criterion
- [ ] No duplication, no-ops pruned, reference disclosed where sprawl existed
- [ ] Registry row present for new skills (**full flow only**)
- [ ] No kit-owned `leanagentkit-*.md` modified in user projects
- [ ] Craft pass only did not register or wire wrappers

## Attribution

Adapted from [Matt Pocock's `writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills)
(MIT). Craft vocabulary and failure-mode diagnosis from upstream; LAK format rules
and output paths are Lean Agent Kit constraints.
