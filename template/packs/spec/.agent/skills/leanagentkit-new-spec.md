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
   existing three-digit prefix on **parent spec** files matching
   `^\d{3}-(?!.*-(?:slices|plan)\.md$).*\.md$` (ignore `_TEMPLATE.md`,
   `_SLICES_TEMPLATE.md`, companion `NNN-*-slices.md`, and `NNN-*-plan.md`
   files). Increment by 1; if none exist, start at `001`. Example: if the latest
   parent spec is `004-my-spec-name.md`, the next file is `005-my-new-spec-name.md`.
3. Read `docs/CODEBASE_MAP.md` to find which existing modules the feature touches.
4. Fill the template:
   - Problem, Goal, Scope (explicit in/out)
   - **testable** Acceptance criteria
   - **Decisions (locked)** — grill/trade-off choices that must not be re-opened
     during implement
   - **Approach** — file-level table (`Area / module` · `Files` · `Change`:
     add / modify / delete) plus data flow / ADR notes; name real paths from the map
   - **Implementation order** — dependency-safe steps (fill for non-trivial specs;
     may be a short stub for trivial ones)
   - **Test plan** — how each AC is verified (commands, scenarios)
   - **Done when** — check PASS and bookkeeping gates
   - Risks / open questions
5. Set `Status: draft` and today's date.
6. Set `docs/memory/ACTIVE_CONTEXT.md` → Current focus to this feature and link
   the spec (use the full numbered filename).

7. **Backlog.md (optional).** If Backlog integration is active (see
   `leanagentkit-backlog` detection contract), create a linked card:
   ```bash
   backlog task create "<feature name>" \
     -d "<one-line goal>" \
     --ac "<each acceptance criterion>" \
     -s "To Do" \
     --ref "docs/specs/NNN-<feature>.md" \
     --plain
   ```
   Record the returned task id in the spec frontmatter (`> Backlog: <task-id>`).
   Mirror ACs once at creation; the spec remains the source of truth. If Backlog
   is not active, skip silently.

## Quality bar

- Acceptance criteria are observable and checkable, not vague.
- The Approach table references actual files from the codebase map.
- Non-trivial specs (3+ ACs or 3+ modules) include Decisions, Implementation
  order, and Test plan — not only Goal/Scope.

## Handoff

Do not start coding in this skill unless the user explicitly asks.

A spec is **non-trivial** when it has 3+ acceptance criteria or Approach touches
3+ modules.

When the spec is written:

1. **Summarize** in 1–2 lines which modules the spec touches (from Approach).
2. **Ask** (interactive UI when available — e.g. Cursor `AskQuestion`; see
   `AGENTS.md` §6 — Asking the user). Fall back to inline text when unsupported.

   **Both paths** — when architecture integration is active (see
   `leanagentkit-architecture` detection contract), `offer_decompose_after_spec:
true` in `.leanagentkit/architecture.yml`, and the spec is non-trivial:

   - Recommended: "Plan implementation, then build"
   - Also: "Decompose into parallel-safe slices" (e.g. API vs web)
   - Also: "Implement end-to-end on one branch"
   - Also: "Not yet — stop after spec"

   **Substantial, no decompose offer** — architecture inactive,
   `offer_decompose_after_spec: false`, or architecture active but the gate above
   does not apply, **and** the spec is non-trivial:

   - Recommended: "Plan implementation, then build"
   - Also: "Implement end-to-end"
   - Also: "Not yet — stop after spec"

   **Trivial** — 1–2 ACs and Approach touches fewer than 3 modules:

   - Recommended: "Implement end-to-end"
   - Also: "Not yet — stop after spec"

3. **On choice** — if the user chose Decompose, Plan, or Implement and the host is
   in a read-only mode (e.g. Cursor Ask mode), ask to switch to Agent mode before
   chaining (Shift+Tab or the mode picker). Do not invoke write skills until the
   host allows edits. Persist `ACTIVE_CONTEXT` before any mode switch.

4. **Chain** — continue in this session without re-asking **this** decompose /
   plan / implement choice (downstream skill prompts still apply):
   - Decompose → read `.agent/skills/leanagentkit-decompose-spec.md` and follow it.
   - Plan implementation, then build → read
     `.agent/skills/leanagentkit-implement-spec.md` and follow it. That skill
     **routes to Cursor Plan + Build** when Cursor Plan mode is available; otherwise
     it **bypasses** to portable LAK implement (non-Cursor / no Plan / user declined).
   - Implement → read `.agent/skills/leanagentkit-implement-spec.md` and follow it
     (portable implement in this chat; skip Plan handoff unless the user asks).
   - Not yet → stop; do not invoke another skill.

Choosing Decompose, Plan, or Implement counts as explicit consent to leave spec
authoring.
