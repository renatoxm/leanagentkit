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
| `leanagentkit-scaffold.md` | Greenfield/additive scaffolding — memory-aware questionnaire, non-interactive generators, handoff to match-stack. |
| `leanagentkit-check.md` | Guardrail — validate changed files against `AGENTS.md`, playbooks, and active spec. |

## Assistant (optional)

| Skill | Does |
|-------|------|
| `leanagentkit-ask-trevor.md` | Trevor — teach the kit, answer from memory, reminders, checklists, Backlog UX, workflows. Opt in via `.leanagentkit/trevor.yml`. |

## Artifact generators (meta-skill)

| Skill | Does |
|-------|------|
| `leanagentkit-create-skill.md` | Create or refactor generated skills — LAK standards + predictability craft (orchestrator). |
| `leanagentkit-skill-artifact-template.md` | Authors a project-specific generator. Infers recipe from an example → `generated/leanagentkit-create-<type>.md`. |
| `leanagentkit-distill-skill.md` | Distills a session workflow (or named source) into a reusable `generated/` skill. |
| `leanagentkit-curate-skills.md` | Reviews generated skills — archive stale/duplicate; never delete; respect `pinned`. |
| `generated/leanagentkit-create-<type>.md` | Authored generators (empty until created). See `generated/README.md`. |

Recipes live in `.agent/recipes/`. Authoring standards: `references/skill-authoring-standards.md`.
Craft glossary: `references/skill-craft-glossary.md`.

## Memory (called by bootstrap, or run individually)

| Skill | Writes to |
|-------|-----------|
| `leanagentkit-map-codebase.md` | `docs/CODEBASE_MAP.md` |
| `leanagentkit-init-conventions.md` | `AGENTS.md` §1–5 |
| `leanagentkit-seed-adrs.md` | `docs/adr/*` |
| `leanagentkit-grill.md` | aligns on a plan (interview), then hands off to `leanagentkit-new-spec` |
| `leanagentkit-spike.md` | throwaway feasibility experiments under `spikes/` before committing to a build |
| `leanagentkit-new-spec.md` | `docs/specs/<feature>.md` |
| `leanagentkit-implement-spec.md` | implements an active spec (spec-driven, sequential) |
| `leanagentkit-start-session.md` | reads memory, primes context |
| `leanagentkit-end-session.md` | persists state (runs `leanagentkit-check` first if code changed) |
| `leanagentkit-handoff.md` | `docs/memory/HANDOFF.md` (cross-session/cross-tool baton) |
| `leanagentkit-distill-skill.md` | `generated/` skill + optional recipe (session → reusable procedure) |
| `leanagentkit-curate-skills.md` | reviews `generated/` skills; archives stale; updates `PROGRESS.md` |

## Stack data

External-skill mappings: `.agent/stacks/registry.md`. Per-stack conventions:
`.agent/stacks/<name>.md`. Greenfield scaffold recipes: `.agent/scaffolders/registry.md`
and `.agent/scaffolders/<name>.scaffold.md`.

## Engineering practice (guardrails)

Cross-cutting skills for review, debugging, security, etc. Shipped in
`.agent/skills/`. The ten always-on skills use `invocation: auto` (lazy-loaded
when relevant). Four conditional skills (CI/CD, observability, Backlog.md, git lifecycle) ship
dormant (explicit-invoke) and are advertised in `AGENTS.md §7` only when
`leanagentkit-match-stack` detects matching evidence — see
`.agent/practice-skills/registry.md`.

| Skill | Use when |
|-------|----------|
| `leanagentkit-review.md` | Multi-axis review before merge |
| `leanagentkit-simplify.md` | Refactor for clarity without behavior change |
| `leanagentkit-git-workflow.md` | Committing, branching, parallel work |
| `leanagentkit-docs.md` | Comments, API docs, README (ADRs → `leanagentkit-seed-adrs`) |
| `leanagentkit-debug.md` | Tests fail, builds break, unexpected errors |
| `leanagentkit-tdd.md` | Adding features, fixing bugs, or changing behavior |
| `leanagentkit-security.md` | Auth, input, external integrations |
| `leanagentkit-performance.md` | Performance requirements or regressions |
| `leanagentkit-deprecation.md` | Removing systems, APIs, legacy code |
| `leanagentkit-api-design.md` | Designing APIs and module boundaries |
| `leanagentkit-ci-cd.md` | CI pipeline setup or failures *(conditional)* |
| `leanagentkit-observability.md` | Logging, metrics, tracing for services *(conditional)* |
| `leanagentkit-backlog.md` | Visual Kanban board synced to specs *(conditional — Backlog.md)* |
| `leanagentkit-git-lifecycle.md` | Branch, commit, PR offers synced to spec workflow *(conditional — git config)* |

## Optional token efficiency (Caveman)

Adapted from [Caveman](https://github.com/JuliusBrussee/caveman) (MIT). Opt in via
`.leanagentkit/caveman.yml` (bootstrap Step 3e). Advertised in `AGENTS.md §7` when
`enabled: true`; each toggle enables one skill.

| Skill | Use when |
|-------|----------|
| `leanagentkit-caveman.md` | Terse agent replies (`terse_communication: true`; off by default) |
| `leanagentkit-caveman-commit.md` | Terse Conventional Commit messages (`terse_commits: true`) |
| `leanagentkit-caveman-review.md` | One-line PR review comments (`terse_reviews: true`) |

Shared audit report format: `.agent/skills/frame/findings-report.md`.
Checklists: `.agent/skills/references/`.
