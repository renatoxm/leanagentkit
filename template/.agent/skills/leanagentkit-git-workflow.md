---
name: leanagentkit-git-workflow
description: Git workflow discipline for safe, reviewable changes. Use when committing, branching, resolving conflicts, or organizing parallel work streams.
invocation: auto
---

# Skill: leanagentkit-git-workflow

**Goal:** Treat commits as save points, branches as sandboxes, history as
documentation. With agents generating code fast, disciplined version control
keeps changes manageable and reversible.

## Core principles

### Trunk-based development (recommended)
Keep main always deployable. Short-lived feature branches (1–3 days). Prefer
feature flags over long-lived branches for incomplete work.

### Commit early, commit often
```
Implement slice → Test → Verify → Commit → Next slice
```
Not: implement everything → giant commit.

### Atomic commits
Each commit does one logical thing. Follow project commit conventions in
`AGENTS.md` §3 (e.g. Conventional Commits if configured).

**Format:**
```
<type>: <short imperative description>

<optional body: why, not what>
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

### Separate concerns
Don't mix formatting with behavior. Don't mix refactor with feature.
Small cleanups (rename one variable) may ride with feature at reviewer discretion.

### Size targets
```
~100 lines  → Easy to review and revert
~300 lines  → OK for single logical change
~1000 lines → Split (see leanagentkit-review change-sizing)
```

## Branch naming

```
feature/<short-description>
fix/<short-description>
chore/<short-description>
refactor/<short-description>
```

## Save-point pattern

```
Change → Test passes? → Commit → Continue
       → Test fails?  → Revert to last commit → Investigate
```

Never lose more than one increment. `git reset --hard HEAD` is the emergency brake.

## Change summary (after modifications)

```
CHANGES MADE:
- <file>: <what changed>

INTENTIONALLY NOT TOUCHED:
- <file>: <why out of scope>

POTENTIAL CONCERNS:
- <assumption that needs confirmation>
```

## Pre-commit hygiene

1. Review staged diff
2. Ensure no secrets in diff
3. Run tests and lint/typecheck per `AGENTS.md` §3
4. Use project git hooks if configured

## Generated files

- Commit lockfiles and migration files when project expects them
- Never commit: build output, `.env`, IDE-only config (unless shared)
- Ensure `.gitignore` covers standard exclusions

## Git for debugging

```bash
git bisect start          # find regression commit
git log --oneline -20     # recent history
git blame <file>          # who changed a line
```

## Parallel work (worktrees)

For multiple agents/features in parallel:
```bash
git worktree add ../project-feature-a feature/my-feature
# each worktree = separate directory, own branch
git worktree remove ../project-feature-a  # when done
```

## Red flags

- Large uncommitted changes accumulating
- Messages like "fix", "update", "misc"
- Formatting mixed with behavior changes
- No `.gitignore` or secrets committed
- Long-lived divergent branches
- Force-push to shared branches

## Verification

- [ ] One logical change per commit
- [ ] Message explains why; follows project convention
- [ ] Tests pass before commit
- [ ] No secrets in diff
- [ ] Concerns separated (refactor vs feature)
