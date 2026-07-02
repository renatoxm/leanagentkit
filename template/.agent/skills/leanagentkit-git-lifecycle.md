---
name: leanagentkit-git-lifecycle
description: Optional git lifecycle integration — branch, commit, and PR offers synced to spec workflow. Use when implementing specs or ending sessions with uncommitted work.
invocation: conditional
---

# Skill: leanagentkit-git-lifecycle

**Goal:** Wire git into the kit lifecycle as an optional **prompt layer**. The **spec**
(`docs/specs/NNN-*.md`) owns intent; the **git branch** is the execution sandbox.
Principles and naming live in `leanagentkit-git-workflow` — this skill handles
detection, user prompts, and commands at lifecycle boundaries.

**When active:** lifecycle skills (`implement-spec`, `end-session`) call into this
skill's procedures. When inactive, they are silent no-ops.

**Not for:** spec authoring (`new-spec`), alignment (`grill`), or general git
discipline without lifecycle context — use `leanagentkit-git-workflow`.

## Detection contract

Git lifecycle integration is **active** only when **both** are true:

1. `.git` exists (git repository).
2. `.leanagentkit/git-lifecycle.yml` exists (user opted in during bootstrap or
   created manually from `.leanagentkit/git-lifecycle.yml.example`).

If either check fails, skip every git-lifecycle step — do not error, do not prompt.

Read config from `.leanagentkit/git-lifecycle.yml`. If `enabled: false`, skip silently.

**PR offers** additionally require `gh` on PATH (`command -v gh`). If missing, skip
the PR step silently; branch and commit offers still work.

## Config

See `.leanagentkit/git-lifecycle.yml.example` for the schema. Key fields:

| Field | Default | Purpose |
|-------|---------|---------|
| `enabled` | `true` | Master switch |
| `branch_prefix` | `feature` | `feature`, `fix`, `chore`, or `refactor` |
| `default_base` | `main` | Base branch when auto-detect fails |
| `offer_commit_on_ac` | `false` | Offer commit after each acceptance criterion |
| `offer_commit_at_end_session` | `true` | Offer save-point commit at session end |
| `offer_pr_when_spec_done` | `true` | Offer push + PR when spec completes |

## Source of truth

| Layer | Owns | Location |
|-------|------|----------|
| Spec | Problem, goal, scope, acceptance criteria, approach | `docs/specs/NNN-*.md` |
| Git branch | Execution sandbox for implementation | recorded in spec frontmatter |

Link them on branch create:

```markdown
> Branch: feature/team-workspaces   ·   Backlog: BACK-12   ·   Status: active   ·   Updated: <!-- YYYY-MM-DD -->
```

Branch slug from spec filename: `005-team-workspaces.md` → `team-workspaces`.
Full branch name: `{branch_prefix}/{slug}`.

## Lifecycle mapping

| Kit event | Git behavior | Config gate |
|-----------|--------------|-------------|
| `new-spec` | **None** | — |
| `implement-spec` start | Offer branch creation | always when active |
| `implement-spec` AC checked | Offer commit | `offer_commit_on_ac: true` |
| `end-session` | Offer save-point commit if dirty tree | `offer_commit_at_end_session: true` |
| Spec `done` + `check` PASS | Offer push + PR | `offer_pr_when_spec_done: true` + `gh` |

## Branch offer (implement-spec start)

1. Resolve active spec path (`docs/specs/NNN-*.md`).
2. Derive slug from filename (strip `NNN-` prefix and `.md`).
3. Compute branch name: `{branch_prefix}/{slug}` from config.
4. If spec frontmatter already has `Branch:` matching the computed name, or
   `git branch --show-current` is already that branch, skip the offer.
5. Ask (interactive UI when available):
   - Recommended: "Create branch `{branch}` from `{base}`"
   - Also: "Skip", "Something else (I will type it)"
6. On confirm only:
   ```bash
   git fetch origin <base> 2>/dev/null || true
   git checkout -b <branch> [<base>]
   ```
7. Record `Branch: <branch>` in the spec frontmatter blockquote line.
   Mention the branch in `ACTIVE_CONTEXT` under Current focus.

**Base branch:** prefer `origin/HEAD` symbolic ref, else config `default_base`.

## Commit offer (AC or end-session)

Follow `leanagentkit-git-workflow` save-point pattern. **Never commit without
explicit user confirmation.**

1. Check working tree: `git status --porcelain`. If clean, skip.
2. Ask (interactive UI when available):
   - Recommended: "Commit save point" (with draft message shown)
   - Also: "Skip", "Something else (I will type it)"
3. Draft message from context:
   - After AC: `feat(<slug>): <criterion summary>`
   - End session: `feat(<slug>): <brief progress from ACTIVE_CONTEXT>`
   - Follow project commit conventions in `AGENTS.md` §3 when present.
4. On confirm only:
   - Review staged diff with user if they want.
   - Ensure no secrets in diff.
   - `git add` only files relevant to the spec / session scope.
   - `git commit -m "<message>"`

## PR offer (spec done + check PASS)

Only when spec `Status: done` and `leanagentkit-check` is PASS.

1. If `offer_pr_when_spec_done` is false or `gh` is unavailable, skip silently.
2. Ask (interactive UI when available):
   - Recommended: "Push branch and open PR"
   - Also: "Push only", "Skip", "Something else (I will type it)"
3. On push confirm:
   ```bash
   git push -u origin HEAD
   ```
4. On PR confirm:
   ```bash
   gh pr create --title "<feature name from spec>" --body "$(cat <<'EOF'
   ## Summary
   - Implements <spec goal>

   ## Spec
   <spec-path>

   ## Acceptance criteria
   - [x] <checked items from spec>

   ## Test plan
   - [ ] <verification steps from spec or check output>
   EOF
   )"
   ```
5. Return the PR URL to the user when created.

## Install and enable (agent-driven — never via `create-lean-agent-kit`)

Offer during `leanagentkit-bootstrap` Step 3c or when the user asks for git
lifecycle prompts. The scaffolder does **not** create the config.

1. Copy `.leanagentkit/git-lifecycle.yml.example` → `.leanagentkit/git-lifecycle.yml`.
2. Adjust settings if the user wants (prefix, base branch, offer toggles).
3. Re-run `leanagentkit-match-stack` (or bootstrap Step 3) so
   `leanagentkit-git-lifecycle` is advertised in `AGENTS.md §7`.

Requires a git repository (`.git`). For PR offers, install GitHub CLI:
`gh auth login`.

## Rules

- Capability-gate every step — silent no-op when integration is not active.
- Spec owns intent; branch owns the execution sandbox.
- **Never** auto-commit, auto-push, auto-create PR, or force-push.
- **Never** commit secrets — check diff before commit.
- Respect `AGENTS.md` commit conventions when drafting messages.
- Declining a prompt is always valid — continue the lifecycle skill normally.
