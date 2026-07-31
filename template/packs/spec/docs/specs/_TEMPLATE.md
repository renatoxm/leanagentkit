# Spec: <feature name>

> Medium-term memory. One file per feature. Intent + acceptance criteria.
> Backlog: <task-id> · Status: draft | active | done | abandoned · Updated: <!-- YYYY-MM-DD -->
>
> _(Omit the `Backlog:` line until `leanagentkit-new-spec` creates a linked card
> when Backlog.md integration is active. Omit `Branch:` until
> `leanagentkit-implement-spec` creates a branch via git lifecycle integration.
> Omit `Slices:` until `leanagentkit-decompose-spec` creates a companion slices file
> when architecture integration is active. Omit `Plan:` until a portable plan or
> Cursor workspace plan is saved alongside this spec.)_
>
> _(When decomposed: `> Slices: docs/specs/NNN-<feature>-slices.md`)_
> _(When planned: `> Plan: docs/specs/NNN-<feature>-plan.md`)_

## Problem

<!-- What need / pain this addresses. -->

## Goal

<!-- The outcome in one sentence. -->

## Scope

**In:** <what this includes>
**Out:** <explicitly not doing>

## Acceptance criteria

- [ ] <observable, testable condition>
- [ ] <...>

## Decisions (locked)

<!-- Choices from grill / new-spec. Do not re-litigate during implement unless blocked. -->

- <decision and why>

## Approach

| Area / module     | Files          | Change                |
| ----------------- | -------------- | --------------------- |
| <!-- e.g. API --> | `path/to/file` | add / modify / delete |

<!-- Data flow, ADR links, notes beyond the table. -->

## Implementation order

<!-- Dependency-safe steps. Required before coding for non-trivial specs
     (3+ acceptance criteria or Approach touches 3+ modules). -->

1. <!-- first step -->
2. <!-- ... -->

## Test plan

<!-- How each AC is verified — commands, scenarios, edge cases. -->

- [ ] <!-- map to AC 1 -->
- [ ] <!-- ... -->

## Risks / open questions

- <...>

## Done when

- [ ] All acceptance criteria checked (or explicitly deferred with user approval)
- [ ] `leanagentkit-check` PASS on changed files
- [ ] Docs / ACTIVE_CONTEXT updated if focus or structure changed
