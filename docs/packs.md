# Packs

Optional overlays shipped in the same npm package. **Not** copied on a default
core install.

## Install

```bash
# First scaffold
npx create-lean-agent-kit@latest . --with spec,stacks

# Existing install
npx create-lean-agent-kit@latest . --enable-pack practice,caveman

# Agent skill
# Read .agent/skills/leanagentkit-enable-pack.md and follow it.
```

Dependencies are resolved automatically (`architecture`, `backlog`, and
`git-lifecycle` pull in `spec`).

## Catalog

| Id | Depends | Docs |
|----|---------|------|
| `spec` | — | Spec-driven loop in [Guide](/guide) |
| `stacks` | — | [Stacks](/stacks) |
| `practice` | — | Engineering guardrails (review, debug, TDD, …) |
| `architecture` | `spec` | [Architecture](/architecture-decomposition) |
| `backlog` | `spec` | [Backlog.md](/backlog) |
| `git-lifecycle` | `spec` | [Git lifecycle](/git-lifecycle) |
| `trevor` | — | [Trevor](/trevor) |
| `caveman` | — | [Caveman](/caveman) |
| `authoring` | — | [Create skill](/create-skill) |

Installed packs are recorded in `.agent/.leanagentkit-version` → `installedPacks`.

## Prune

```bash
npx create-lean-agent-kit@latest . --prune-to-core
npx create-lean-agent-kit@latest . --prune-to-core --keep-pack spec,stacks
```

Pack files are moved to `.leanagentkit-backup/<timestamp>-prune/`, not deleted
forever. That can include pack memory such as `PROGRESS.md` / reminders when
those packs are removed; core `ACTIVE_CONTEXT` stays. User-authored specs under
`docs/specs/` are left in place. After prune, **review `AGENTS.md` §7** — it is
preserved and may still list removed packs.

Dependencies are **auto-installed** (e.g. `--enable-pack backlog` also installs
`spec`). Re-enable packs with `--enable-pack`.

## practice

Adds always-on-style engineering skills (review, simplify, git-workflow, docs,
debug, tdd, security, performance, deprecation, api-design, frontend-design) plus
conditional ci-cd / observability when evidence matches. They exist on disk only
after the pack is enabled.
