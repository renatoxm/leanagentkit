# Lean Agent Kit

> Give your AI coding agent a small, trustworthy memory — not another operating system.

A **tool-agnostic lean core**: Markdown memory so the agent navigates by a map and
opens what each task needs, plus a convention check. Optional **packs** add specs,
stacks, guardrails, and integrations — only when you enable them.

Works with Cursor, Claude Code, Copilot, ChatGPT, Aider, Cline — anything that can
read files.

**Docs:** [renatoxm.github.io/leanagentkit](https://renatoxm.github.io/leanagentkit/)

## The problem

Every new session starts cold. The agent re-scans the repo, burns context, and
still drifts from your conventions.

## The fix (core)

Four files do most of the work:

| File | Role |
|------|------|
| `AGENTS.md` | Project facts, commands, conventions, never-dos |
| `docs/CODEBASE_MAP.md` | Navigation index |
| `docs/memory/ACTIVE_CONTEXT.md` | Current focus + resume note |
| `.agent/skills/` | Session loop: start → check → end (+ handoff) |

**Map-first, not map-only:** start from the map; use narrow search when needed.
Do not dump the whole repo to re-orient.

## Install

Pin `@latest` so you do not run a stale cached package.

```bash
npm create lean-agent-kit@latest
# or
npx create-lean-agent-kit@latest .
pnpm dlx create-lean-agent-kit@latest .
```

Default install is **core only**. Then:

> Read `.agent/skills/leanagentkit-bootstrap.md` and follow it.

### With packs on first scaffold

```bash
npx create-lean-agent-kit@latest . --with spec,stacks
```

### Add packs later

```bash
npx create-lean-agent-kit@latest . --enable-pack practice
```

### Upgrade / prune (0.x → 1.0)

```bash
npx create-lean-agent-kit@latest . --upgrade          # additive; preserves memory
npx create-lean-agent-kit@latest . --prune-to-core    # archive pack files; re-enable what you need
```

See [Migration 1.0](https://renatoxm.github.io/leanagentkit/migration-1.0).

## Workflow sizes

| Size | When | Loop |
|------|------|------|
| **Trivial** | Typo, rename, Q&A | Just do it |
| **Normal** | Typical coding | `start-session` → work → `check` → `end-session` |
| **Substantial** | New/fuzzy feature | Needs **spec** pack: grill → new-spec → implement-spec → check → end-session |

## Optional packs

| Pack | Purpose |
|------|---------|
| `spec` | Grill, specs, implement, ADRs, progress |
| `stacks` | Stack detect + greenfield scaffolders |
| `practice` | Review, debug, TDD, security, … |
| `architecture` | CA/DDD decomposition (needs `spec`) |
| `backlog` | Backlog.md board sync (needs `spec`) |
| `git-lifecycle` | Branch/commit/PR offers (needs `spec`) |
| `trevor` | Reminders / concierge |
| `caveman` | Terse commits & review comments |
| `authoring` | Distill / create project skills |
| `imaginary` | Resize/crop/convert via h2non/imaginary |

Full catalog: [Packs](https://renatoxm.github.io/leanagentkit/packs).

## Honest costs

- Memory stays useful only if `ACTIVE_CONTEXT` and the map are updated at real
  stopping points — automated, but not free.
- Stale maps hurt; narrow search is allowed and expected.
- More packs → more skills on disk and more ceremony. Prefer core until you feel the gap.

## Built-in stack support (stacks pack)

When the **stacks** pack is installed, detection uses `.agent/stacks/registry.md`
(Cloudflare, Hono, Astro, Svelte, React/Next, Python, Go, Postgres ORMs, …).
See [Stacks](https://renatoxm.github.io/leanagentkit/stacks).

## Repo layout (this repository)

```
bin/cli.mjs       # npx entry (zero deps)
template/core/    # default install payload
template/packs/   # opt-in overlays + manifest.json
docs/             # VitePress site (not shipped on npm)
```

## Developing

```bash
npm install
node bin/cli.mjs /tmp/test-target
npm test
```

## License

MIT
