---
name: leanagentkit-deprecation
description: Manage deprecation and migration safely. Use when removing old systems or APIs, consolidating duplicate implementations, or deciding whether to maintain legacy code.
invocation: auto
---

# Skill: leanagentkit-deprecation

**Goal:** Remove code that no longer earns its keep. Migration moves users
safely from old to new — deprecation without a replacement is abandonment.

## When to use

- Replacing old system, API, or library
- Sunsetting unused features
- Consolidating duplicate implementations
- Zombie code with no owner but active consumers
- Planning lifecycle of new systems (design for removal from day one)

## Core principles

- **Code is a liability** — maintenance cost: tests, docs, security, cognitive load
- **Hyrum's Law** — every observable behavior becomes depended on; migration is active, not announcement-only
- **Plan removal at design time** — clean interfaces and minimal surface area ease later deprecation

## Deprecation decision

Before deprecating, answer:
1. Does this still provide unique value? If yes, maintain.
2. How many consumers? Quantify migration scope.
3. Does a replacement exist? Build replacement first.
4. Migration cost per consumer?
5. Ongoing cost of NOT deprecating?

## Advisory vs compulsory

| Type | When | Mechanism |
|------|------|-----------|
| Advisory | Old system stable, migration optional | Warnings, docs, nudges |
| Compulsory | Security risk, blocks progress, unsustainable cost | Hard deadline + migration tooling |

Default to advisory. Compulsory requires tooling, docs, and support.

## Migration process

1. **Build replacement** — covers critical use cases; proven in production
2. **Announce** — status, replacement, reason, migration guide with concrete steps
3. **Migrate incrementally** — one consumer at a time; verify behavior matches
4. **Remove old system** — only after zero active usage (metrics/logs/deps confirm)

**Churn rule:** If you own the deprecated infrastructure, migrate your users or
provide backward-compatible updates — don't announce and walk away.

## Patterns

- **Strangler:** Run old + new in parallel; shift traffic incrementally; remove at 0%
- **Adapter:** Old interface delegates to new implementation during transition
- **Feature flags:** Switch consumers one at a time; remove flag + dead code after full rollout

## Zombie code

Signs: no commits in 6+ months, no owner, failing tests ignored, known CVEs unfixed.
Response: assign owner and maintain, OR deprecate with concrete migration plan.

## Red flags

- Deprecation without replacement
- Announcement without migration guide or tooling
- Advisory deprecation stalled for years with no progress
- New features added to deprecated system
- Removal without verifying zero consumers

## Verification

- [ ] Replacement production-proven
- [ ] Migration guide with concrete steps
- [ ] All consumers migrated (verified by metrics/logs)
- [ ] Old code, tests, docs, config fully removed
- [ ] No references to deprecated system remain
