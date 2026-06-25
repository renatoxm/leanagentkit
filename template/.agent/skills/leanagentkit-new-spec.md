---
name: leanagentkit-new-spec
description: Create a feature spec in docs/specs/ for a new or in-progress feature.
---

# Skill: leanagentkit-new-spec

**Goal:** Create a feature spec before coding, Spec-Kit style, grounded in the
current codebase.

**Output file:** `docs/specs/<kebab-feature-name>.md` (from `docs/specs/_TEMPLATE.md`)

## Procedure

1. Confirm the feature name and one-line goal with the user if not given.
2. Read `docs/CODEBASE_MAP.md` to find which existing modules the feature touches.
3. Fill the template: Problem, Goal, Scope (explicit in/out), **testable**
   Acceptance criteria, Approach (name the real files/modules it will touch and
   the data flow), Risks.
4. Set `Status: draft` and today's date.
5. Set `docs/memory/ACTIVE_CONTEXT.md` → Current focus to this feature and link
   the spec.

## Quality bar

- Acceptance criteria are observable and checkable, not vague.
- The Approach references actual files from the codebase map.
