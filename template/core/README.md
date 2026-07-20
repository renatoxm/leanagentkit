# Lean Agent Kit

Tool-agnostic **lean core** memory for AI coding agents. Navigate by a Markdown
map, keep a short active context, check work against your conventions. Optional
**packs** add specs, stacks, guardrails, and integrations.

Works with Cursor, Claude Code, Copilot, ChatGPT, Aider, Cline — anything that
can read files.

## Core files

| File | Role |
|------|------|
| `AGENTS.md` | Canonical rules + memory protocol (§6) |
| `docs/CODEBASE_MAP.md` | Navigation index |
| `docs/memory/ACTIVE_CONTEXT.md` | Focus + resume |
| `.agent/skills/` | Bootstrap, session, check, wire, packs |

## Quick start

1. You already scaffolded (or: `npx create-lean-agent-kit@latest .`).
2. Tell your agent: **Read `.agent/skills/leanagentkit-bootstrap.md` and follow it.**
3. Add packs when needed:

```bash
npx create-lean-agent-kit@latest . --enable-pack spec,stacks
```

## Workflow sizes

- **Trivial** — no ceremony.
- **Normal** — `start-session` → work → `check` → `end-session`.
- **Substantial** — enable `spec` pack; grill → new-spec → implement-spec.

Protocol details: **`AGENTS.md` §6**. Full playbook: **`LEAN_AGENT_KIT_GUIDE.md`**.

## Packs

See stamp `.agent/.leanagentkit-version` → `installedPacks`. Catalog and install
commands: [docs / packs](https://renatoxm.github.io/leanagentkit/packs).

| Pack | Purpose |
|------|---------|
| `spec` | Spec-driven feature loop |
| `stacks` | Stack skills + scaffold |
| `practice` | Engineering guardrails |
| `architecture` | Decomposition (needs `spec`) |
| `backlog` / `git-lifecycle` | Board / git offers (need `spec`) |
| `trevor` / `caveman` / `authoring` | Concierge / terse output / skill authoring |
| `imaginary` | Image resize/crop/convert (h2non/imaginary) |

## Upgrade & prune

```bash
npx create-lean-agent-kit@latest . --upgrade
npx create-lean-agent-kit@latest . --prune-to-core
```

Migration: [1.0 guide](https://renatoxm.github.io/leanagentkit/migration-1.0).

## Credits

Engineering-practice skills adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills).
Alignment/handoff and skill craft from [mattpocock/skills](https://github.com/mattpocock/skills).
Learning-loop ideas from [Hermes Agent](https://github.com/NousResearch/hermes-agent).
Caveman from [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman).
See `.agent/skills/references/THIRD_PARTY.md` when present.

## License

MIT
