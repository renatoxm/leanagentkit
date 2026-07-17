---
name: leanagentkit-check
description: Guardrail check — validate changed files against AGENTS.md, stack playbooks (if present), and active spec criteria.
---

# Skill: leanagentkit-check

**Goal:** Verify changed work aligns with project conventions and, when present,
stack playbooks and the active feature spec. Reports violations with citations —
does not auto-fix.

## When to run

- After meaningful code changes, before `leanagentkit-end-session` (normal/substantial)
- On request: "check my changes against conventions"
- Skip for trivial edits unless the user asks

## Procedure

1. **Identify scope**
   - If the user names files, use those.
   - Else `git diff --name-only` (staged + unstaged) or ACTIVE_CONTEXT "Files in play".

2. **Load guardrails** (read only what applies)
   - `AGENTS.md` §4 Conventions and §5 Never do
   - If `.agent/stacks/` exists (stacks pack) and `AGENTS.md` §7 lists playbooks,
     load matching `.agent/stacks/<name>.md` for changed files' technologies
   - If ACTIVE_CONTEXT links a spec and the file exists, read Acceptance criteria
   - If architecture pack + config active, optional boundary checks from that skill

3. **Check each changed file** against those sources only.

4. **Report** (structured, scannable):

   ```text
   ## leanagentkit-check

   **Scope:** <files>
   **Active spec:** <name or none>

   ### Pass
   - <file>: <what aligns>

   ### Violations
   - <file>: <rule> — cite AGENTS.md §X or playbook heading

   ### Warnings
   - <spec criterion not yet addressed>

   ### Verdict
   PASS | FAIL (<N> violations)
   ```

5. **On FAIL** — list concrete fixes; do not invent rules. For broader quality
   issues, suggest `leanagentkit-review` only if the **practice** pack is installed.

## Quality bar

- Every violation cites a specific source.
- If no rule covers something questionable, note "no rule found."
- Keep the report short.
