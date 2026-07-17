---
name: leanagentkit-simplify
description: Simplify code for clarity without changing behavior. Use when refactoring for readability, when review flags complexity, or when code works but is harder to maintain than it should be.
invocation: auto
---

# Skill: leanagentkit-simplify

**Goal:** Reduce complexity while preserving exact behavior. Fewer lines is not
the goal — faster comprehension is.

## When to use

- After a feature works and tests pass, but implementation feels heavy
- During review when readability issues are flagged
- Deep nesting, long functions, unclear names, scattered duplication

**When NOT to use:**
- Code is already clean
- You don't understand the code yet (comprehend first)
- Performance-critical path where simpler version is measurably slower
- Throwaway code about to be rewritten

## Principles

1. **Preserve behavior exactly** — same inputs, outputs, errors, side effects
2. **Follow project conventions** — read `AGENTS.md` §4; match neighboring code
3. **Clarity over cleverness** — explicit beats compact when compact needs a pause
4. **Balance** — don't inline helpers that name concepts; don't merge unrelated logic
5. **Scope to what changed** — no drive-by refactors unless asked

## Process

### Step 1: Understand (Chesterton's Fence)
Before changing anything:
- What is this code's responsibility? Who calls it?
- Edge cases, error paths, tests defining behavior?
- Why was it written this way? (Check git blame if unclear)

### Step 2: Identify opportunities

| Signal | Remedy |
|--------|--------|
| Deep nesting (3+ levels) | Guard clauses, extract helper |
| Long functions (50+ lines) | Split by responsibility |
| Nested ternaries | if/else, switch, lookup map |
| Generic names (`data`, `temp`) | Rename to describe content |
| Duplicated logic (5+ lines) | Extract shared function |
| Dead code | Remove after confirming unused |
| Comments stating "what" | Delete; keep "why" comments |

### Step 3: Apply incrementally
One change at a time → run tests → commit or continue.
**Separate refactoring PR from feature/bugfix PR.**

Rule of 500: refactors touching >500 lines need automation (codemod), not manual edits.

### Step 4: Verify
- Simpler version genuinely easier to understand?
- Consistent with codebase patterns?
- Diff clean and reviewable?

## Red flags

- Simplification requires modifying tests (likely changed behavior)
- "Simplified" code is longer or harder to follow
- Removed error handling for cleanliness
- Batched many changes without testing between

## Verification

- [ ] All existing tests pass without modification
- [ ] Build and linter pass
- [ ] Each change is incremental and reviewable
- [ ] No error handling removed or weakened
- [ ] Follows `AGENTS.md` conventions
