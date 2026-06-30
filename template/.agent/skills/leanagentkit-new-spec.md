---
name: leanagentkit-new-spec
description: Create a feature spec in docs/specs/ for a new or in-progress feature.
---

# Skill: leanagentkit-new-spec

**Goal:** Create a feature spec before coding, Spec-Kit style, grounded in the
current codebase.

**Output file:** `docs/specs/NNN-<kebab-feature-name>.md` (from
`docs/specs/_TEMPLATE.md`), where `NNN` is a zero-padded three-digit prefix
(e.g. `001`, `002`, `004`).

**Align first:** for fuzzy or non-trivial features, run `leanagentkit-grill` to
reach a shared understanding before capturing it here.

## Procedure

1. Confirm the feature name and one-line goal with the user if not given.
2. **Allocate the next spec number.** List `docs/specs/` and find the highest
   existing three-digit prefix on files matching `^\d{3}-.*\.md$` (ignore
   `_TEMPLATE.md`). Increment by 1; if none exist, start at `001`. Example: if
   the latest is `004-my-spec-name.md`, the next file is
   `005-my-new-spec-name.md`.
3. Read `docs/CODEBASE_MAP.md` to find which existing modules the feature touches.
4. Fill the template: Problem, Goal, Scope (explicit in/out), **testable**
   Acceptance criteria, Approach (name the real files/modules it will touch and
   the data flow), Risks.
5. Set `Status: draft` and today's date.
6. Set `docs/memory/ACTIVE_CONTEXT.md` → Current focus to this feature and link
   the spec (use the full numbered filename).

## Quality bar

- Acceptance criteria are observable and checkable, not vague.
- The Approach references actual files from the codebase map.
