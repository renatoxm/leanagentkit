# Learnings

> Append-only inbox of avoidable mistakes. Skim **Open** at task start (recent
> entries). Promote stable rules into `AGENTS.md` §4/§5; then move under
> **Promoted**. Do not put secrets, tokens, or PII here.
>
> Cap **Open** at ~20 bullets. Merge duplicates by bumping `Seen:` instead of
> adding a new bullet.

## Capture rules

Append (or bump `Seen:`) when **all** of 1–3 are true:

1. Something **failed or had to be redone** (hook, lint, test, review, user correction).
2. You can state a concrete **Avoid** in one line.
3. It is **likely to recur** (tooling rule, project convention, repeated preference).

**If the same Avoid is already in `AGENTS.md` §4/§5** and the agent still violated
it: still append or bump LEARNINGS (salience). On promote (`Seen:` ≥ 3), offer to
**strengthen** the AGENTS.md wording (e.g. punchier §5 Never do) — user confirm
required — then move the bullet to **Promoted**.

**Promote (new rule):** when `Seen:` ≥ 3 and not yet in AGENTS.md, offer to add a
one-liner to §4 or §5 — **only after user confirms**. Then move to **Promoted**.

## Schema (every Open bullet)

```markdown
- **YYYY-MM-DD · <category>** — <what failed>.
  **Avoid:** <one-line future rule>.
  **Evidence:** <hook/config/path>.
  **Seen:** <N>.
  **Status:** open
```

## Open

<!-- Sample — delete or replace after the first real learning:
- **YYYY-MM-DD · commits** — commitlint rejected subject >100 chars.
  **Avoid:** subject ≤100; body lines ≤100; prefer short why, not essay.
  **Evidence:** husky commit-msg / `@commitlint/config-conventional`.
  **Seen:** 1.
  **Status:** open
-->

_(No open learnings yet. Append using the schema above.)_

## Promoted

<!-- Move bullets here after promotion into AGENTS.md. Note the § that received them. -->
