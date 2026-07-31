---
name: leanagentkit-check
description: Guardrail check — validate changed files against AGENTS.md, LEARNINGS, stack playbooks (if present), and active spec criteria.
---

# Skill: leanagentkit-check

**Goal:** Verify changed work aligns with project conventions and, when present,
Open learnings, stack playbooks, and the active feature spec. Reports violations
with citations — does not auto-fix. Primary habit skill for ambient memory.

## When to run

- After meaningful code changes, before finalize / optional `end-session`
  (normal/substantial)
- On request: "check my changes against conventions"
- Skip for trivial edits unless the user asks

## Procedure

1. **Identify scope**
   - If the user names files, use those.
   - Else `git diff --name-only` (staged + unstaged) or ACTIVE_CONTEXT "Files in play".

2. **Load guardrails** (read only what applies)
   - `AGENTS.md` §4 Conventions and §5 Never do
   - Open entries in `docs/memory/LEARNINGS.md` relevant to the scope or action
     (e.g. `commits` before a commit; stack/category matching changed files)
   - If `.agent/stacks/` exists (stacks pack) and `AGENTS.md` §7 lists playbooks,
     load matching `.agent/stacks/<name>.md` for changed files' technologies
   - If ACTIVE_CONTEXT links a spec and the file exists, read Acceptance criteria
   - If architecture pack + config active, optional boundary checks from that skill

3. **Check each changed file** against those sources only. If the user is about to
   commit and commitlint / a `commits` learning / §4 Commits rule exists, remind
   subject ≤100 and body lines ≤100 (or the project's configured limits).

4. **Report** (structured, scannable):

   ```text
   ## leanagentkit-check

   **Scope:** <files>
   **Active spec:** <name or none>

   ### Pass
   - <file>: <what aligns>

   ### Violations
   - <file>: <rule> — cite AGENTS.md §X, LEARNINGS, or playbook heading

   ### Warnings
   - <spec criterion not yet addressed>

   ### Verdict
   PASS | FAIL (<N> violations)
   ```

5. **On FAIL** — list concrete fixes; do not invent rules. For broader quality
   issues, suggest `leanagentkit-review` only if the **practice** pack is installed.
   After an **avoidable** FAIL is fixed (or after a hook/lint failure that had to be
   redone), append or bump `docs/memory/LEARNINGS.md` per that file's capture rules
   — **including** when the rule was already in `AGENTS.md` but still violated.
   If `Seen:` ≥ 3, offer to add or strengthen `AGENTS.md` §4/§5 (user confirm required).

## Quality bar

- Every violation cites a specific source.
- If no rule covers something questionable, note "no rule found."
- Keep the report short.
