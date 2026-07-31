---
name: leanagentkit-caveman-review
description: One-line PR review comments. Location, problem, fix.
version: 1.0.0
invocation: conditional
metadata:
  tags: [TokenEfficiency, Optional, Review]
  source: JuliusBrussee/caveman (MIT) — adapted for Lean Agent Kit
  upstream: https://github.com/JuliusBrussee/caveman
---

# Skill: leanagentkit-caveman-review

**Goal:** Write paste-ready one-line PR review comments. Location, problem, fix.
No throat-clearing.

**Not for:** full multi-axis review — use `leanagentkit-review` with
`.agent/skills/frame/findings-report.md`. Convention-only checks → `leanagentkit-check`.

## When to Use

- User wants terse inline PR comments to paste into a review thread
- `.leanagentkit/caveman.yml` has `enabled: true` and `terse_reviews: true`
- Quick diff feedback where brevity matters more than a findings report

**Off:** "stop caveman-review" or "normal mode".

## Prerequisites

For **AGENTS.md §7 routing:**

- `.leanagentkit/caveman.yml` exists with `enabled: true` and `terse_reviews: true`

**Explicit invoke always works** — if the user asks for terse PR comments, follow
this skill even when the config is off or missing.

## Procedure

1. Read the diff or changed files through the host agent's tools.
2. Emit one line per finding in the format below.
3. Output comments ready to paste — do not write fixes, approve, or run linters.

### Format

`L<line>: <problem>. <fix>.` — or `<file>:L<line>: ...` for multi-file diffs.

**Severity prefix (optional, when mixed):**

- `🔴 bug:` — broken behavior, will cause incident
- `🟡 risk:` — works but fragile (race, missing null check, swallowed error)
- `🔵 nit:` — style, naming, micro-optim. Author can ignore
- `❓ q:` — genuine question, not a suggestion

### Drop

- "I noticed that...", "It seems like...", "You might want to consider..."
- "Great work!", "Looks good overall but..." — once at top if needed, not per comment
- Restating what the line does
- Hedging — if unsure use `q:`

### Keep

- Exact line numbers and symbol names in backticks
- Concrete fix, not "consider refactoring this"
- The _why_ when the fix is not obvious from the problem

### Auto-Clarity

Drop terse mode for: CVE-class security findings, architectural disagreements needing
rationale, or onboarding contexts where the author needs the "why". Write a normal
paragraph, then resume terse for the rest.

For a structured pre-merge report across five axes → `leanagentkit-review`.

## Pitfalls

- One-liners are not a substitute for `leanagentkit-review` before merge on substantial changes.
- Security and architecture issues may need full prose — see Auto-Clarity above.

## Verification

Each comment has location, problem, and concrete fix in one line.

## Attribution

Adapted from [Caveman](https://github.com/JuliusBrussee/caveman) (MIT) by Julius Brussee.
