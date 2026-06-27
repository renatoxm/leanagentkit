---
name: leanagentkit-docs
description: Project documentation discipline. Use when writing inline comments, API docs, changelogs, or README sections. Use when onboarding context is missing. For architecture decisions, use leanagentkit-seed-adrs instead.
invocation: auto
---

# Skill: leanagentkit-docs

**Goal:** Document decisions and intent, not restate code. Code shows *what*;
docs explain *why* and *what alternatives were rejected*.

## When to use

- Adding or changing public APIs or module boundaries
- Shipping user-facing behavior changes (changelog)
- Onboarding gaps — same explanation repeated
- Inline gotchas that agents/humans keep hitting

**When NOT to use:**
- Obvious code that restates itself
- Throwaway prototypes
- **Architecture decisions (ADRs)** — use `leanagentkit-seed-adrs` and
  `docs/adr/_TEMPLATE.md`; store ADRs in `docs/adr/`, not elsewhere

## Architecture decisions (defer to kit)

Significant decisions belong in ADRs:
- Framework/library/infrastructure choices
- Auth strategy, data model, API style
- Anything expensive to reverse

**Procedure:** Run `leanagentkit-seed-adrs` or write manually using
`docs/adr/_TEMPLATE.md`. One decision per file. Never delete old ADRs — supersede
with a new numbered ADR.

## Inline comments

Comment *why*, not *what*:

```
BAD:  // increment counter
GOOD: // Sliding-window rate limit — reset at boundary, not fixed schedule,
      // to prevent burst attacks at window edges
```

**Don't:** comment self-explanatory code, leave TODOs for work you can do now,
leave commented-out code (git has history).

## API documentation

- Public functions: document params, returns, throws, with examples where helpful
- REST APIs: consistent error shape; OpenAPI/Swagger when project uses it
- Types ARE documentation — define contracts before implementation

## README essentials

Every project README should cover:
1. One-paragraph description
2. Quick start (install, env setup, dev command)
3. Commands table (from `AGENTS.md` §3)
4. Architecture overview with link to ADRs
5. Contributing / PR process (if applicable)

## Changelog (shipped features)

```markdown
## [version] - YYYY-MM-DD
### Added / Fixed / Changed
- Description (#issue if applicable)
```

## Documentation for agents

- `AGENTS.md` — canonical conventions (keep current)
- `docs/specs/` — feature specs (medium memory tier)
- `docs/adr/` — decision rationale (prevents re-deciding)
- Inline gotchas — prevent known traps

## Red flags

- Public APIs with no types or docs
- README missing run instructions
- Commented-out code instead of deletion
- Stale TODO comments
- Architectural choices with no ADR when `docs/adr/` exists

## Verification

- [ ] README covers quick start and commands
- [ ] Public APIs documented (types or OpenAPI)
- [ ] Gotchas documented inline where they matter
- [ ] No commented-out code
- [ ] Significant decisions have ADRs in `docs/adr/`
