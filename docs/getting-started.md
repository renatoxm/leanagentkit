# Getting Started

Lean Agent Kit 1.0 installs a **lean core**: Markdown memory so your agent
resumes from a map and active context, plus a convention check. Optional
**packs** add specs, stacks, and integrations.

## Install

Pin `@latest` so caches do not run a stale package.

```bash
npm create lean-agent-kit@latest
npx create-lean-agent-kit@latest .
pnpm dlx create-lean-agent-kit@latest .
```

Confirm the CLI prints `create-lean-agent-kit v…` before scaffolding.

**Core only by default.** To include packs on first scaffold:

```bash
npx create-lean-agent-kit@latest . --with spec,stacks
```

## Bootstrap

> Read `.agent/skills/leanagentkit-bootstrap.md` and follow it.

Maps the codebase, fills `AGENTS.md` conventions, wires agents, and offers packs
(does not install packs unless you choose them).

## Workflow sizes

| Size | Loop |
|------|------|
| Trivial | Just work |
| Normal | `start-session` → work → `check` → `end-session` |
| Substantial | Enable `spec` pack → grill → new-spec → implement-spec → check → end-session |

## Add packs later

```bash
npx create-lean-agent-kit@latest . --enable-pack practice
```

Or: `leanagentkit-enable-pack`. Catalog: [Packs](/packs).

## Upgrade & prune

```bash
npx create-lean-agent-kit@latest . --upgrade
npx create-lean-agent-kit@latest . --prune-to-core
```

Coming from 0.x? See [Migration 1.0](/migration-1.0).

## What core scaffolds

```
AGENTS.md
docs/CODEBASE_MAP.md
docs/memory/ACTIVE_CONTEXT.md
.agent/skills/          # core skills only
.agent/install/         # Cursor / Claude templates
LEAN_AGENT_KIT.md
LEAN_AGENT_KIT_GUIDE.md
```

## Next steps

- [Full guide](/guide)
- [Packs](/packs)
- Re-run `leanagentkit-wire-agent` after enabling packs (Cursor / Claude)
