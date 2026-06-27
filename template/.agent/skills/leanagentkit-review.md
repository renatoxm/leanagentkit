---
name: leanagentkit-review
description: Multi-axis code review before merge. Use when reviewing PRs, evaluating agent-generated code, or after completing a feature. Use when you need correctness, readability, architecture, security, and performance assessed together.
invocation: auto
---

# Skill: leanagentkit-review

**Goal:** Review changes across five axes before merge. Approve when the change
improves overall code health — perfect code doesn't exist.

**Output format:** Read `.agent/skills/frame/findings-report.md` when producing
the report.

## When to use

- Before merging any PR or substantial change
- After feature implementation or bug fix (review fix + regression test)
- When evaluating code from another agent or model

**Not for:** Convention-only guardrails against `AGENTS.md` — use
`leanagentkit-check` instead. Deep security or performance passes — defer to
`leanagentkit-security` and `leanagentkit-performance`.

## Five-axis review

### 1. Correctness
- Matches spec/task requirements and active acceptance criteria
- Edge cases and error paths handled
- Tests cover behavior (not just happy path)
- No race conditions, off-by-one, or state inconsistencies

### 2. Readability & simplicity
- Names clear and consistent with `AGENTS.md` §4
- Control flow straightforward; no unnecessary cleverness
- Abstractions earn their complexity (don't generalize before third use case)
- No dead code, backwards-compat shims, or bolted-on conditionals in unrelated flows
- For deeper simplification work → `leanagentkit-simplify`

### 3. Architecture
- Follows existing patterns or justifies new ones
- Clean module boundaries; dependencies flow correctly
- Refactors **reduce** concepts held by reader, not relocate complexity
- Feature logic stays in owning layer, not shared modules
- File size: ~1000 total lines is an inspection signal — decompose before adding

### 4. Security
- Quick pass here; for auth/input/external boundaries → `leanagentkit-security`
- Input validated at boundaries; no secrets in code/logs
- Auth checks where needed; parameterized queries

### 5. Performance
- Quick pass here; for profiling/budgets/CWV → `leanagentkit-performance`
- No N+1, unbounded fetches, missing pagination, obvious hot-path waste

## Process

1. **Understand context** — what, why, expected behavior change
2. **Review tests first** — they reveal intent and coverage gaps
3. **Walk implementation** — five axes per changed file
4. **Categorize findings** — use severity labels from findings-report frame
5. **Verify verification story** — what tests/build/manual checks were run

## Change sizing

```
~100 lines   → Good, reviewable in one sitting
~300 lines   → OK if single logical change
~1000 lines  → Split before review
```

Separate refactoring from feature work. Refactoring-only changes get their own
commit/PR.

## Structural remedies

When flagging structure problems, propose the move:
- Replace conditional chains with typed model or dispatcher
- Extract helper or split oversized file before adding more
- Reuse canonical helper instead of near-duplicate
- Make type boundaries explicit so branching disappears

## Dead code

After refactors, list orphaned code and ask before deleting.

## Dependency discipline

Before adding a dependency: does existing stack solve it? Size, maintenance,
vulnerabilities, license? Prefer stdlib and existing utilities.

## Red flags

- "LGTM" without evidence of review
- Tests pass but architecture/security/readability ignored
- Large PRs that can't be reviewed properly
- Refactor that relocates complexity without reducing it
- Feature logic added to shared module

## Verification

- [ ] All Critical/Required findings resolved or explicitly deferred
- [ ] Tests pass; build succeeds
- [ ] Report follows findings-report frame
- [ ] Security-sensitive changes got `leanagentkit-security` pass if needed
