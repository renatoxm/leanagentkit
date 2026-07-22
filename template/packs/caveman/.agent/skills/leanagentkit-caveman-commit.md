---
name: leanagentkit-caveman-commit
description: Terse Conventional Commit messages. Why over what.
version: 1.0.0
invocation: conditional
metadata:
  tags: [TokenEfficiency, Optional, Git]
  source: JuliusBrussee/caveman (MIT) — adapted for Lean Agent Kit
  upstream: https://github.com/JuliusBrussee/caveman
---

# Skill: leanagentkit-caveman-commit

**Goal:** Write commit messages terse and exact. Conventional Commits format. Why over what.
Output the message only — does not run `git commit` or stage files.

**Defer to:** `leanagentkit-git-workflow` for commit principles and atomicity;
`leanagentkit-git-lifecycle` for when branch/commit/PR offers fire during the spec workflow.

## When to Use

- User asks for a commit message, "write a commit", or "generate commit"
- `.leanagentkit/caveman.yml` has `enabled: true` and `terse_commits: true`
- After `leanagentkit-check` passes and changes are ready to commit

**Off:** "stop caveman-commit" or "normal mode".

## Prerequisites

For **AGENTS.md §7 routing:**

- `.leanagentkit/caveman.yml` exists with `enabled: true` and `terse_commits: true`
- Read `AGENTS.md` §3–§4 for project commit conventions (types, scope, length)

**Explicit invoke always works** — if the user asks for a commit message, follow
this skill even when the config is off or missing.

## Procedure

1. Inspect the staged or proposed diff through the host agent's tools.
2. Draft a Conventional Commit message following the rules below.
3. Output as a fenced code block ready to paste — do not run `git commit`.

### Subject line

- `<type>(<scope>): <imperative summary>` — `<scope>` optional
- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`
- Imperative mood: "add", "fix", "remove" — not "added", "adds", "adding"
- Prefer short subjects; hard cap from `AGENTS.md` §4 **Commits:** (usually ≤ 100
  when `@commitlint/config-conventional` via husky) — never exceed that limit
- No trailing period
- Match project convention from `AGENTS.md` §3–§4

### Body (only if needed)

- Skip when subject is self-explanatory
- Add body for: non-obvious *why*, breaking changes, migration notes, linked issues
- Wrap body/footer at the same limit as `AGENTS.md` §4 (usually ≤ 100 with
  commitlint conventional); bullets `-` not `*`
- Reference issues at end: `Closes #42`, `Refs #17`

### Never include

- "This commit does X", "I", "we", "now", "currently"
- AI attribution unless `AGENTS.md` requires it (then use trailer format)
- Emoji unless project convention requires
- Restating the filename when scope already names it

### Auto-Clarity

Always include body for: breaking changes, security fixes, data migrations, reverts.
Never compress these into subject-only.

## Pitfalls

- This skill formats the message only — lifecycle timing and PR offers belong to
  `leanagentkit-git-lifecycle`.
- When git lifecycle is active, offer the message; let the user confirm before committing.

## Verification

Message is valid Conventional Commits, subject/body within `AGENTS.md` §4 length
limits (≤ 100 with commitlint conventional), body present only when needed.

## Attribution

Adapted from [Caveman](https://github.com/JuliusBrussee/caveman) (MIT) by Julius Brussee.
