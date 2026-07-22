---
name: leanagentkit-git-workflow
description: Git workflow discipline for safe, reviewable changes. Use when committing, branching, resolving conflicts, or organizing parallel work streams.
invocation: auto
---

# Skill: leanagentkit-git-workflow

**Goal:** Treat commits as save points, branches as sandboxes, history as
documentation. With agents generating code fast, disciplined version control
keeps changes manageable and reversible.

**Lifecycle prompts:** when git lifecycle integration is active (see
`leanagentkit-git-lifecycle`), branch/commit/PR offers at `implement-spec` and
`end-session` follow that skill — this file holds the principles and patterns.

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
`AGENTS.md` §3–§4 (e.g. Conventional Commits + length limits if commitlint is
configured). When Caveman is enabled
(`terse_commits: true` in `.leanagentkit/caveman.yml`), defer message formatting
to `leanagentkit-caveman-commit`.

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
~1000 lines → Split (see leanagentkit-review change-sizing and Split oversized work below)
```

## Split oversized work into PRs

When a branch or working tree grows beyond reviewable size (~1000 lines or mixed
concerns), split into small PRs before review. Adapted from Cursor `split-to-prs`.

### Hard rules

- Do not create branches, commit, push, or open PRs until the user approves the split plan.
- Never discard user work. No destructive git commands (`reset --hard`, `clean -fdx`,
  branch deletion, force-push, history rewrite) without explicit approval.
- Always save a recoverable snapshot before moving work around:
  ```bash
  SHA=$(git stash create "pre-split")
  if [ -n "$SHA" ]; then
    git update-ref "refs/backup/pre-split-$(date +%s)" "$SHA"
  fi
  ```
- Stage only named files or hunks. No `git add .` / `git add -A`.

### 1. Check the state

Compare current work to the repo's default branch, including committed and
uncommitted changes. Summarize the real slices you see; use chat history and
`ACTIVE_CONTEXT` to recover intent.

Before proposing slices, find ownership signals for touched paths (`CODEOWNERS`,
nested ownership files, `tools/ownership/PRODUCTOWNERS`, or repo equivalents) and
use them for natural reviewer boundaries.

### 2. Propose the split

Usually PR titles are enough. Add a one-line scope note only when a title is unclear.
Show a Mermaid diagram when there are multiple slices.

Optimize for reviewer-aligned PRs with minimal unrelated diff: split independent
owners or concerns; keep tightly coupled changes together; when stacking is
necessary, order foundations before consumers.

Default to independent PRs off the default branch. Stack PRs only when the
dependency is real.

Ask for approval before starting.

### 3. Execute the split

For each approved slice:

1. Create a branch from the right base.
2. Stage and commit only the planned files or hunks.
3. Push and open a PR (`gh pr create` when `gh` is available).

### 4. Report back

Keep it short: PR titles and URLs, plus anything left on the starting branch or
working tree. Do not delete the backup ref unless the user asks.

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

### Parallel slices (architecture decomposition)

When implementing parallel slices from `docs/specs/NNN-*-slices.md`:

```bash
# From repo root; spec slug = kebab-case feature name from parent spec filename
git worktree add ../<repo>-<spec-slug>-<slice-id> feature/<spec-slug>-<slice-id>
# Example: ../myapp-team-workspaces-S3 feature/team-workspaces-S3
```

- One worktree per parallel slice; branch naming: `feature/<spec-slug>-<slice-id>`
- Work only files listed in that slice's **FilesInPlay** column
- Remove worktree after integration slice merges: `git worktree remove ../<path>`
- Never force-push shared branches; integration agent merges via normal PR/merge flow

### Merge slices (integration phase)

After parallel slice branches complete (Phase C in `leanagentkit-implement-spec`):

1. Create or checkout the integration branch from base:
   `git checkout -b feature/<spec-slug> [<base>]`
2. Merge each slice branch in DependsOn order (foundation slices first if they
   lived on separate branches, then adapters):
   ```bash
   git merge --no-ff feature/<spec-slug>-S3 -m "feat(<slug>): integrate slice S3"
   ```
3. Resolve conflicts in the integration slice — prefer the contract-defined interfaces.
4. Run tests and `leanagentkit-check` before checking off parent spec ACs.
5. Remove worktrees when merges are complete:
   `git worktree remove ../<repo>-<spec-slug>-<slice-id>`
6. Push integration branch and open one PR (via `leanagentkit-git-lifecycle` when active).

Use `--no-ff` merges to preserve slice history. Rebase only when the user explicitly
requests a linear history.

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
