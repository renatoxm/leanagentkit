---
name: leanagentkit-docs
description: Project documentation discipline. Use when writing inline comments, API docs, changelogs, or README sections. Use when onboarding context is missing. For architecture decisions, use leanagentkit-seed-adrs instead.
invocation: auto
---

# Skill: leanagentkit-docs

**Goal:** Document decisions and intent, not restate code. Code shows _what_;
docs explain _why_ and _what alternatives were rejected_.

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

Comment _why_, not _what_:

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

## Authoring project skills

When writing or updating a **generated** skill (`.agent/skills/generated/`) or
distilling a workflow into one, read
`.agent/skills/references/skill-authoring-standards.md` first. Follow agentskills.io
frontmatter, keep `description` <=60 chars, and append discovered gotchas under
`## Learned notes` (generated skills only — kit-owned skills are overwritten on upgrade).

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
