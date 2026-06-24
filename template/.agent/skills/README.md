# Skills

Tool-agnostic skills an AI agent runs to set up and maintain this project's
memory and stack integration. Invoke any of them with:

> "Read `.agent/skills/<name>.md` and follow it."

## Orchestration (start here)

| Skill | Does |
|-------|------|
| `bootstrap.md` | **Run first.** Interactive setup: questionnaire → map → detect stack → wire skills. Calls the others. |
| `match-stack.md` | Detect technologies from `.agent/stacks/registry.md`, install matching external skills, apply playbooks. |

## Artifact generators (meta-skill)

| Skill | Does |
|-------|------|
| `skill-artifact-template.md` | Authors a project-specific generator (e.g. `create-new-page`). Infers the recipe from an existing example, asks only about gaps, freezes it into `generated/create-<type>.md` + `recipes/<type>.recipe.md`. |
| `generated/create-<type>.md` | The authored generators. Plan-first, then create files / routes / middleware / roles / i18n — no full-repo read. See `generated/README.md`. |

Recipes (the frozen wiring data) live in `.agent/recipes/`.

## Memory population (called by bootstrap, or run individually)

| Skill | Writes to | Tier |
|-------|-----------|------|
| `map-codebase.md` | `docs/CODEBASE_MAP.md` | long |
| `init-conventions.md` | `AGENTS.md` §1–5 | long |
| `seed-adrs.md` | `docs/adr/*` | long |
| `new-spec.md` | `docs/specs/<feature>.md` | medium |
| `start-session.md` | reads memory, primes context | — |
| `end-session.md` | updates active context, progress, map, ADRs | medium |

## Stack data

External-skill mappings live in `.agent/stacks/registry.md`; per-stack conventions
in `.agent/stacks/<name>.md`. Edit the registry to add support for new tech.
