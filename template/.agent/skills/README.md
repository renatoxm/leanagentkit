# Skills

Tool-agnostic skills an AI agent runs to set up and maintain this project.
Invoke any of them with:

> "Read `.agent/skills/leanagentkit-<name>.md` and follow it."

Memory protocol and tiers: see **`AGENTS.md` §6** (canonical — do not duplicate here).

## Orchestration (start here)

| Skill | Does |
|-------|------|
| `leanagentkit-bootstrap.md` | **Run first.** Interactive setup: questionnaire → map → detect stack → wire agents. |
| `leanagentkit-wire-agent.md` | Wire Cursor and/or Claude — copy memory pointers, generate skill wrappers from frontmatter. |
| `leanagentkit-match-stack.md` | Detect technologies from `.agent/stacks/registry.md`, install external skills, apply playbooks. |
| `leanagentkit-check.md` | Guardrail — validate changed files against `AGENTS.md`, playbooks, and active spec. |

## Artifact generators (meta-skill)

| Skill | Does |
|-------|------|
| `leanagentkit-skill-artifact-template.md` | Authors a project-specific generator. Infers recipe from an example → `generated/leanagentkit-create-<type>.md`. |
| `generated/leanagentkit-create-<type>.md` | Authored generators (empty until created). See `generated/README.md`. |

Recipes live in `.agent/recipes/`.

## Memory (called by bootstrap, or run individually)

| Skill | Writes to |
|-------|-----------|
| `leanagentkit-map-codebase.md` | `docs/CODEBASE_MAP.md` |
| `leanagentkit-init-conventions.md` | `AGENTS.md` §1–5 |
| `leanagentkit-seed-adrs.md` | `docs/adr/*` |
| `leanagentkit-new-spec.md` | `docs/specs/<feature>.md` |
| `leanagentkit-start-session.md` | reads memory, primes context |
| `leanagentkit-end-session.md` | persists state (runs `leanagentkit-check` first if code changed) |

## Stack data

External-skill mappings: `.agent/stacks/registry.md`. Per-stack conventions:
`.agent/stacks/<name>.md`.

## Engineering practice (guardrails)

Cross-cutting skills for review, debugging, security, etc. Shipped in
`.agent/skills/`. The nine always-on skills use `invocation: auto` (lazy-loaded
when relevant). The two conditional skills (CI/CD, observability) ship dormant
(explicit-invoke) and are advertised in `AGENTS.md §7` only when
`leanagentkit-match-stack` detects matching evidence — see
`.agent/practice-skills/registry.md`.

| Skill | Use when |
|-------|----------|
| `leanagentkit-review.md` | Multi-axis review before merge |
| `leanagentkit-simplify.md` | Refactor for clarity without behavior change |
| `leanagentkit-git-workflow.md` | Committing, branching, parallel work |
| `leanagentkit-docs.md` | Comments, API docs, README (ADRs → `leanagentkit-seed-adrs`) |
| `leanagentkit-debug.md` | Tests fail, builds break, unexpected errors |
| `leanagentkit-security.md` | Auth, input, external integrations |
| `leanagentkit-performance.md` | Performance requirements or regressions |
| `leanagentkit-deprecation.md` | Removing systems, APIs, legacy code |
| `leanagentkit-api-design.md` | Designing APIs and module boundaries |
| `leanagentkit-ci-cd.md` | CI pipeline setup or failures *(conditional)* |
| `leanagentkit-observability.md` | Logging, metrics, tracing for services *(conditional)* |

Shared audit report format: `.agent/skills/frame/findings-report.md`.
Checklists: `.agent/skills/references/`.
