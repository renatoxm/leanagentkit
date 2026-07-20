# Lean Agent Kit skills

## Core (always installed)

| Skill | Purpose |
|-------|---------|
| `leanagentkit-bootstrap` | First-time setup |
| `leanagentkit-wire-agent` | Cursor / Claude wrappers |
| `leanagentkit-map-codebase` | Build/refresh `CODEBASE_MAP` |
| `leanagentkit-init-conventions` | Fill `AGENTS.md` §1–5 |
| `leanagentkit-start-session` | Cheap session prime |
| `leanagentkit-end-session` | Persist ACTIVE_CONTEXT |
| `leanagentkit-handoff` | Mid-task baton |
| `leanagentkit-check` | Convention check |
| `leanagentkit-enable-pack` | Install packs |
| `leanagentkit-migrate-1` | 0.x → 1.0 migration |

## Packs (opt-in)

Pack skills appear under this folder only after:

```bash
npx create-lean-agent-kit@latest . --enable-pack <id>
```

| Pack | Skills (summary) |
|------|------------------|
| `spec` | grill, new-spec, implement-spec, spike, seed-adrs |
| `stacks` | match-stack, scaffold |
| `practice` | review, debug, tdd, security, … |
| `architecture` | architecture, decompose-spec |
| `backlog` | backlog |
| `git-lifecycle` | git-lifecycle, babysit-pr |
| `trevor` | ask-trevor |
| `caveman` | caveman, caveman-commit, caveman-review |
| `authoring` | create-skill, distill-skill, curate-skills, skill-artifact-template |
| `imaginary` | imaginary |

See `LEAN_AGENT_KIT_GUIDE.md` and [packs docs](https://renatoxm.github.io/leanagentkit/packs).

## Invocation

Invoke any skill with: **Read `.agent/skills/<name>.md` and follow it.**

`wire-agent` generates host wrappers only for skills present on disk (core + installed packs).
