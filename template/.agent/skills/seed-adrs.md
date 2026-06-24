# Skill: seed-adrs

**Goal:** Reverse-engineer the architectural decisions already embedded in the
codebase into ADR files, so the rationale isn't lost.

**Output files:** `docs/adr/NNNN-*.md` (using `docs/adr/_TEMPLATE.md`)

## Procedure

1. Find existing ADRs to get the next number; never reuse a number.
2. Scan for decisions worth recording (be selective — only consequential ones):
   - framework / runtime / database choice,
   - auth strategy, state management, API style (REST/GraphQL/RPC),
   - monorepo vs multi-repo, build tooling, deployment target,
   - any unusual pattern that a newcomer would question.
3. For each, gather evidence from manifests/config/code. Write the **Context**
   from what the code constrains, the **Decision** from what was actually chosen,
   and **Consequences** from observable trade-offs.
4. Set `Status: accepted` and `Date: <today>`. In **Alternatives considered**,
   list plausible options and why the current choice likely won (mark inference
   as inference).
5. One decision per file. Keep them short.

## Quality bar

- Only record decisions you can support with evidence in the repo.
- If rationale is genuinely unknown, say so rather than fabricating motivation.
