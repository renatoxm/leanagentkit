# Getting Started

Lean Agent Kit 1.0 installs a **lean core**: Markdown memory so your agent
resumes from a map and active context, plus a convention check. Optional
**packs** add specs, stacks, and integrations.

## Install

Pin `@latest` so caches do not run a stale package.

::: code-group

```bash [npm]
npx create-lean-agent-kit@latest .
```

```bash [pnpm]
pnpm dlx create-lean-agent-kit@latest .
```

```bash [yarn]
yarn dlx create-lean-agent-kit@latest .
```

```bash [bun]
bunx create-lean-agent-kit@latest .
```

:::

Confirm the CLI prints `create-lean-agent-kit v…` before scaffolding.

### Guided installer (TTY)

When stdin/stdout are a terminal and you pass **no mode flags**, the CLI walks you through:

1. **Existing install** (if detected) — skip update, update (with or without backup), or **delete and clean install** (destructive warning; backup or permanent delete).
2. **Framework intent** (empty or freshly cleaned folder) — choosing a base framework installs the `stacks` pack and customizes the final agent prompt so you can run `leanagentkit-scaffold` for that framework. Generators are **not** run by the CLI.
3. **Optional packs** — multi-select list from the pack catalog. Keyboard: `↑/↓` move · `Space` select/unselect · `Enter` confirm. Dependencies (e.g. `spec` for `architecture`) are added automatically.

Non-TTY / CI runs stay non-interactive (**core only** unless you pass flags).

### Non-interactive flags

To include packs on first scaffold without prompts:

::: code-group

```bash [npm]
npx create-lean-agent-kit@latest . --with spec,stacks
```

```bash [pnpm]
pnpm dlx create-lean-agent-kit@latest . --with spec,stacks
```

```bash [yarn]
yarn dlx create-lean-agent-kit@latest . --with spec,stacks
```

```bash [bun]
bunx create-lean-agent-kit@latest . --with spec,stacks
```

:::

## Bootstrap

Follow the **printed agent prompt** after install. Typical core-only prompt:

> Read `.agent/skills/leanagentkit-bootstrap.md` and follow it.

With a framework intent + `stacks`, the prompt asks the agent to run `leanagentkit-scaffold` for that framework, then bootstrap (including match-stack).

Bootstrap maps the codebase, fills `AGENTS.md` conventions, wires agents, and can offer more packs.

### Existing apps

Dropping the kit onto a repo that **already** has an app (e.g. Vite + React) is
**occupied**: bootstrap runs map → conventions → `match-stack`. It does **not**
run a base framework scaffold, and it does **not** offer commitlint / commitizen /
husky. Those [commit helpers](/stacks#optional-commit-helpers) are asked only
during `leanagentkit-scaffold` on Node greenfield or additive recipes.

## Workflow sizes

| Size | Loop |
|------|------|
| Trivial | Just work |
| Normal | `start-session` → work → `check` → `end-session` |
| Substantial | Enable `spec` pack → grill → new-spec → implement-spec → check → end-session |

## Add packs later

::: code-group

```bash [npm]
npx create-lean-agent-kit@latest . --enable-pack practice
```

```bash [pnpm]
pnpm dlx create-lean-agent-kit@latest . --enable-pack practice
```

```bash [yarn]
yarn dlx create-lean-agent-kit@latest . --enable-pack practice
```

```bash [bun]
bunx create-lean-agent-kit@latest . --enable-pack practice
```

:::

Or: `leanagentkit-enable-pack`. Catalog: [Packs](/packs).

## Upgrade & prune

::: code-group

```bash [npm]
npx create-lean-agent-kit@latest . --upgrade
npx create-lean-agent-kit@latest . --prune-to-core
```

```bash [pnpm]
pnpm dlx create-lean-agent-kit@latest . --upgrade
pnpm dlx create-lean-agent-kit@latest . --prune-to-core
```

```bash [yarn]
yarn dlx create-lean-agent-kit@latest . --upgrade
yarn dlx create-lean-agent-kit@latest . --prune-to-core
```

```bash [bun]
bunx create-lean-agent-kit@latest . --upgrade
bunx create-lean-agent-kit@latest . --prune-to-core
```

:::

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
