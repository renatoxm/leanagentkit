# Practice Skills Registry

> Detection conditions for **conditional** engineering-practice skills shipped
> with the kit. Always-on guardrails live in `.agent/skills/leanagentkit-*.md`
> with `invocation: auto`. This file is read by `leanagentkit-match-stack` and
> bootstrap — not for external stack skills (see `.agent/stacks/registry.md`).

## How to read a row

- **Detect** — evidence that turns this skill "on" for the project.
- **Skill** — file in `.agent/skills/`.
- **Default** — `always` (ships for every project) or `conditional` (enable only when Detect matches).

## How conditional skills are gated

Conditional skills carry `invocation: conditional` in their frontmatter, so
`leanagentkit-wire-agent` ships them **explicit-invoke** (Cursor wrappers keep
`disable-model-invocation: true`). They therefore never auto-fire on a project
that doesn't match. When `leanagentkit-match-stack` finds a row's **Detect**
evidence, it records the skill in `AGENTS.md §7` so the agent knows to use it;
otherwise the skill stays dormant. Always-on guardrails (`invocation: auto`)
skip this gate and are auto-discoverable everywhere.

---

## Always-on guardrails

These ship with every scaffold. Agents auto-discover them via `invocation: auto`
when Cursor/Claude is wired. No detection needed.

| Skill | Use when |
|-------|----------|
| `leanagentkit-review` | Multi-axis review before merge |
| `leanagentkit-simplify` | Refactor for clarity without behavior change |
| `leanagentkit-git-workflow` | Committing, branching, parallel work |
| `leanagentkit-docs` | Comments, API docs, README, changelog |
| `leanagentkit-debug` | Tests fail, builds break, unexpected errors |
| `leanagentkit-tdd` | Adding features, fixing bugs, or changing behavior |
| `leanagentkit-security` | Auth, input, external integrations, sensitive data |
| `leanagentkit-performance` | Performance requirements or suspected regressions |
| `leanagentkit-deprecation` | Removing systems, APIs, or consolidating duplicates |
| `leanagentkit-api-design` | Designing APIs, module boundaries, public interfaces |
| `leanagentkit-frontend-design` | Distinctive UI — palette, type, layout; avoid templated defaults |

---

## CI/CD and automation

- **Detect:** `.github/workflows/*`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/`, `azure-pipelines.yml`, or CI scripts in `package.json` / Makefile
- **Skill:** `leanagentkit-ci-cd`
- **Default:** conditional
- **Enable when:** project has automated build/test/deploy pipeline config

## Observability and instrumentation

- **Detect:** server entry point (`main.ts`, `app.py`, `server.js`, `index.js` with listen/serve), `Dockerfile`, `docker-compose.yml`, deploy config (`wrangler.toml`, `fly.toml`, `Procfile`), or existing logging/metrics libs (OpenTelemetry, pino, winston, structlog)
- **Skill:** `leanagentkit-observability`
- **Default:** conditional
- **Enable when:** project runs as a deployable service (not a pure library/CLI with no runtime)

## Visual task board (Backlog.md)

- **Detect:** `backlog` on PATH (`command -v backlog`) **and** a Backlog project in the repo (`backlog/`, `.backlog/`, or `backlog.config.yml`)
- **Skill:** `leanagentkit-backlog`
- **Default:** conditional
- **Enable when:** user installed Backlog.md and ran `backlog init` in the project
- **Note:** spec (`docs/specs/`) owns content; Backlog card owns status/Kanban visualization. Do not run `backlog agents --update-instructions` — kit owns `AGENTS.md §7`.

## Git lifecycle (optional prompts)

- **Detect:** `.git` exists **and** `.leanagentkit/git-lifecycle.yml` exists (copied from `.leanagentkit/git-lifecycle.yml.example` during bootstrap Step 3c or manually)
- **Skill:** `leanagentkit-git-lifecycle`
- **Default:** conditional
- **Enable when:** user opted in during bootstrap or created the config file in the repo
- **Note:** spec owns intent; git branch is the execution sandbox. Prompt-only — never auto-commit, push, or open PR. PR offers require `gh` on PATH.

## PR babysit (optional)

- **Detect:** `.git` exists **and** `.leanagentkit/git-lifecycle.yml` exists **and** `offer_babysit_after_pr: true` in that config
- **Skill:** `leanagentkit-babysit-pr`
- **Default:** conditional
- **Enable when:** user opted in during bootstrap (Step 3c babysit follow-up) or set `offer_babysit_after_pr: true` manually
- **Note:** triages PR comments, conflicts, and in-scope CI until merge-ready. Requires `gh` on PATH. Never auto-merge.

## Architecture decomposition (optional)

- **Detect:** `.leanagentkit/architecture.yml` exists with `enabled: true`
- **Skills:** `leanagentkit-architecture` (`invocation: conditional`); `leanagentkit-decompose-spec` (explicit-invoke orchestration — advertise alongside architecture when active)
- **Default:** conditional (architecture integration skill only)
- **Enable when:** user opted in during bootstrap (Step 3g) or created the config file manually
- **Note:** spec owns intent; slices file (`docs/specs/NNN-*-slices.md`) owns work packages and parallel eligibility. Embedded CA/DDD references live in `.agent/skills/references/`. Parallel mode requires architecture config; sequential-by-slice does not. Never auto-spawn parallel agents.

## Token efficiency (Caveman, optional) — `match-stack` step 8 only

> **Do not process this row in step 7.** Caveman skills are never listed under
> Practice skills (guardrails). Step 8 reads `caveman.yml` toggles and writes
> `AGENTS.md §7` **Token efficiency (optional)** only.

- **Detect:** `.leanagentkit/caveman.yml` exists with `enabled: true`
- **Skills:** `leanagentkit-caveman`, `leanagentkit-caveman-commit`, `leanagentkit-caveman-review` (one AGENTS.md line per enabled toggle)
- **Default:** conditional
- **Enable when:** user opted in during bootstrap (Step 3e) or created the config file manually
- **Note:** `terse_communication` is off by default (per-turn skill overhead). Adapted from [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) (MIT).

---

## Adding rows

Match the fields above. Conditional skills should have clear Detect evidence —
don't enable skills the project can't use.
