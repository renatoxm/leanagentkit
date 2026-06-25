---
name: leanagentkit-check
description: Guardrail check — validate changed files against AGENTS.md, stack playbooks, and active spec criteria.
---

# Skill: leanagentkit-check

**Goal:** Verify that changed work aligns with project conventions, stack playbooks,
and the active feature spec. Reports violations with citations — does not auto-fix.

## When to run

- After meaningful code changes, before `leanagentkit-end-session`
- On request: "check my changes against conventions"

## Procedure

1. **Identify scope**
   - If the user names files, use those.
   - Else use `git diff --name-only` (staged + unstaged) or files listed in
     `ACTIVE_CONTEXT` under "Files in play".

2. **Load guardrails** (read only what applies)
   - `AGENTS.md` §4 Conventions and §5 Never do
   - For each changed file's technology area, the matching `.agent/stacks/<name>.md`
     playbook (from `AGENTS.md` §7 Stack skills)
   - If `ACTIVE_CONTEXT` links a spec, read its Acceptance criteria

3. **Check each changed file**
   For each file, evaluate against applicable rules:
   - Naming, layering, import boundaries from `AGENTS.md` §4
   - Forbidden patterns from §5
   - Stack-specific conventions from playbooks
   - If a spec is active: does the change move toward acceptance criteria?

4. **Report** (structured, not verbose)

   ```text
   ## leanagentkit-check

   **Scope:** <files checked>
   **Active spec:** <name or none>

   ### Pass
   - <file>: <what aligns>

   ### Violations
   - <file>: <rule violated> — cite AGENTS.md §X or playbook heading

   ### Warnings
   - <spec criterion not yet addressed>

   ### Verdict
   PASS | FAIL (<N> violations)
   ```

5. **On FAIL**
   - List concrete fixes; recommend resolving before ending the session.
   - Do not invent rules not present in `AGENTS.md`, playbooks, or the spec.

## Quality bar

- Every violation cites a specific source (`AGENTS.md` section, playbook heading,
  spec criterion).
- If no rule covers something questionable, note "no rule found" — don't fabricate
  violations.
- Keep the report scannable; no walls of text.
