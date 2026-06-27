---
name: leanagentkit-ci-cd
description: CI/CD pipeline quality gates. Use when setting up or modifying build pipelines, automating quality checks, or debugging CI failures.
invocation: conditional
---

# Skill: leanagentkit-ci-cd

**Goal:** Automate quality gates so no change reaches production without passing
tests, lint, typecheck, and build. CI catches what humans and agents miss — consistently.

**Enable when:** project has CI config (see `.agent/practice-skills/registry.md`).

## When to use

- Setting up or modifying CI pipeline
- Adding automated checks
- Configuring deployment pipelines
- Debugging CI failures

For systematic test failure triage → `leanagentkit-debug`.

## Principles

- **Shift left** — catch problems early; lint before tests, tests before staging
- **Faster is safer** — smaller batches, more frequent releases reduce risk
- **No gate skipped** — fix failures, don't disable rules or skip tests

## Quality gate pipeline

```
PR opened
  → Lint
  → Type check
  → Unit tests
  → Build
  → Integration tests (if applicable)
  → Security audit (dependency)
  → Bundle/size checks (if configured)
  → Ready for review
```

Adapt steps to project's stack and `AGENTS.md` §3 commands.

## CI failure feedback loop

When CI fails:
1. Copy specific error output (not entire log)
2. Fix locally; verify with same commands CI runs
3. Push; confirm CI green

Map failure type:
- Lint → run project lint fix command
- Type error → fix at cited location
- Test failure → `leanagentkit-debug`
- Build error → check config and dependencies

## Deployment strategies

- **Preview deployments** — every PR gets testable environment when feasible
- **Feature flags** — decouple deploy from release; set cleanup date when creating flags
- **Staged rollouts** — staging verify before production
- **Rollback plan** — every deployment reversible

## Environment & secrets

```
.env.example  → committed (placeholders)
.env          → NOT committed
CI secrets    → platform secrets manager, never in code
```

CI should not use production secrets. Separate test credentials.

## Automation beyond CI

- Dependabot/Renovate for dependency updates
- Branch protection: required reviews + required status checks
- Build cop role: someone owns keeping CI green

## CI optimization (when pipeline > 10 min)

1. Cache dependencies
2. Parallel jobs (lint, typecheck, test, build separate)
3. Path filters (skip e2e for docs-only PRs)
4. Shard test suites
5. Optimize slow tests (move non-critical to scheduled run)

## Red flags

- No CI pipeline
- CI failures ignored or silenced
- Tests disabled to make pipeline pass
- Production deploys without staging verification
- No rollback mechanism
- Secrets in CI config files

## Verification

- [ ] Quality gates match project needs (lint, types, tests, build, audit)
- [ ] Pipeline runs on every PR and main push
- [ ] Failures block merge (branch protection)
- [ ] Secrets in secrets manager, not code
- [ ] Rollback mechanism exists
- [ ] Pipeline completes in reasonable time (< 10 min target for test suite)
