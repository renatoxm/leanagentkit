---
name: leanagentkit-babysit-pr
description: "Keep a PR merge-ready via comments, conflicts, and CI. Use after opening a PR or when the user asks to babysit or fix PR checks."
invocation: conditional
metadata:
  source: Cursor built-in babysit skill (adapted)
---

# Skill: leanagentkit-babysit-pr

**Goal:** Get a pull request to a merge-ready state — mergeable, checks green,
unresolved review comments triaged — without auto-merging or weakening CI.

**Auto-offer when:** `.git` exists, `.leanagentkit/git-lifecycle.yml` exists with
`offer_babysit_after_pr: true`, and `gh` is on PATH (e.g. after git-lifecycle
creates a PR and the user accepts babysit).

**Explicit user ask:** when the user says "babysit this PR" or similar, run this
skill whenever `gh` is available — **do not** require `offer_babysit_after_pr`.
If `gh` is missing, explain the blocker instead of a silent no-op.

**Not for:** opening the initial PR (`leanagentkit-git-lifecycle`), splitting
oversized work (`leanagentkit-git-workflow`), or general code review before a PR
exists (`leanagentkit-review`).

## When to use

- After `leanagentkit-git-lifecycle` creates a PR and the user accepts babysit
- "Babysit this PR" / "get this PR merge-ready"
- PR has failing checks, unresolved comments, or merge conflicts

## Prerequisites

- GitHub CLI: `gh auth login`
- PR exists (current branch linked to a PR, or user supplies PR URL/number)

## How to Run

> Read `.agent/skills/leanagentkit-babysit-pr.md` and follow it.

Optional: pass PR URL or number if not on the PR branch.

## Procedure

### 1. Resolve the PR

1. If the user gave a PR URL or number, use it.
2. Else on the current branch:
   ```bash
   gh pr view --json url,number,title,state,mergeable,statusCheckRollup,reviewDecision
   ```
3. If no PR exists, stop and tell the user to open one first
   (`leanagentkit-git-lifecycle` or `gh pr create`).

Record PR URL and base branch for later steps.

### 2. Merge conflicts

1. Check mergeability (`gh pr view` or `git fetch` + merge-base check).
2. If conflicts exist:
   - Merge or rebase from base per project convention (prefer what the team uses;
     ask if unclear).
   - Resolve preserving branch intent and base correctness.
   - If intents conflict, abort the merge/rebase and ask for clarification.
3. Push only after user confirms conflict resolution when non-trivial.

### 3. Review comments

1. Fetch unresolved review threads only:
   ```bash
   gh api graphql -f query='...'   # or gh pr view --comments, filtering resolved
   ```
   Prefer `gh pr view` / review APIs; read comment bodies and file locations only —
   do not dump raw JSON to the user.
2. Triage each unresolved thread:
   - Valid change request → fix in scope and reply or resolve when appropriate.
   - Automated review (Bugbot, etc.) → validate before acting; skip false positives
     with a brief explanation.
   - Unclear or out of scope → ask the user.
3. Ignore already-resolved threads.

### 4. CI

1. Read latest check status from `gh pr checks` or PR view.
2. For each failing check:
   - Fix failures **caused by this PR's changes** only.
   - **Never** change CI workflows, disable checks, or skip tests just to pass.
   - If failure seems unrelated, check whether the branch is behind base:
     ```bash
     git fetch origin
     git rev-list --left-right --count origin/<base>...HEAD
     ```
     Offer merging latest base; another PR may have fixed main.
3. Run local verification per `AGENTS.md` §3 before pushing fixes.
4. Push scoped fixes; re-check until green or a blocker is reported.

### 5. Loop until done

Repeat steps 2–4 until **all** are true:

- PR is mergeable (no conflicts)
- Required checks are green (or only allowed optional checks pending)
- Unresolved review comments are addressed or explicitly deferred with user approval

Then report merge-ready status with PR URL. **Do not auto-merge** unless the user
explicitly asks.

## Rules

- **Auto-offer path:** capability-gate on `gh` and config — silent no-op when
  unavailable.
- **Explicit user ask:** always attempt when `gh` is available; explain blockers
  when `gh` is missing.
- Never force-push to shared default branch (`main` / `master`).
- Never auto-merge without explicit user request.
- Never weaken CI to make failures pass.
- Scope fixes to this PR; unrelated failures → report, don't hack around them.
- Declining to continue is always valid.

## Verification

- [ ] PR URL identified
- [ ] Merge conflicts resolved or none
- [ ] Unresolved comments triaged
- [ ] Required CI checks green (or user acknowledged exceptions)
- [ ] User informed of merge-ready state or blocker
