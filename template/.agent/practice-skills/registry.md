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
| `leanagentkit-security` | Auth, input, external integrations, sensitive data |
| `leanagentkit-performance` | Performance requirements or suspected regressions |
| `leanagentkit-deprecation` | Removing systems, APIs, or consolidating duplicates |
| `leanagentkit-api-design` | Designing APIs, module boundaries, public interfaces |

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

---

## Adding rows

Match the fields above. Conditional skills should have clear Detect evidence —
don't enable skills the project can't use.
