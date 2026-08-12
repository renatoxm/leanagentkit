# Lean Agent Kit

> Persistent context & skills for AI coding agents.

Give your coding agent the context, memory, and skills it needs to be an expert
in your codebase, conventions, current work, and hard-won lessons — so it gets
productive faster and stays on track. **Free and open source forever** (MIT).

A small Markdown core plus optional **packs** for specs, stacks, guardrails, and
integrations — only when you enable them. Works with Cursor, Claude Code,
Copilot, ChatGPT, Aider, Cline, and other file-reading agents. No account,
subscription, or lock-in.

**Docs:** [renatoxm.github.io/leanagentkit](https://renatoxm.github.io/leanagentkit/) ·
[Why Lean Agent Kit?](https://renatoxm.github.io/leanagentkit/about)

## The problem

Every new session starts cold. The agent does not know your codebase,
conventions, what you are working on, or what the last session discovered. It
re-searches familiar files, burns context, and can repeat mistakes your team has
already solved.

## The fix (core)

Lean Agent Kit installs a small, persistent project memory:

| File                            | Role                                           |
| ------------------------------- | ---------------------------------------------- |
| `AGENTS.md`                     | Project facts, commands, conventions, never-dos |
| `docs/CODEBASE_MAP.md`          | Navigation index                               |
| `docs/memory/ACTIVE_CONTEXT.md` | Current focus + resume note                    |
| `docs/memory/LEARNINGS.md`      | Discoveries & avoidable mistakes → promote to AGENTS.md |
| `.agent/skills/`                | Check, handoff, optional session wrappers, packs |

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

In a **TTY**, the CLI runs a **guided installer**:

1. If Lean Agent Kit is already present — **skip update**, **update**, or **delete and clean install**
2. Empty / freshly cleaned folder — optional framework intent (installs the `stacks` pack; the agent runs the scaffolder)
3. Multi-select optional packs — `↑/↓` move · `Space` select/unselect · `Enter` confirm

Non-TTY / CI installs stay **core only** (or use flags below). After install, follow the printed agent prompt (usually bootstrap; with a framework intent it points at `leanagentkit-scaffold` first).

### Non-interactive flags

```bash
npx create-lean-agent-kit@latest . --with spec,stacks   # packs on first scaffold
npx create-lean-agent-kit@latest . --enable-pack practice
npx create-lean-agent-kit@latest . --upgrade            # additive; preserves memory
npx create-lean-agent-kit@latest . --prune-to-core      # archive pack files; re-enable what you need
```

**Clean install** (guided only): warns that all kit files and memories will be removed, then asks whether to **back up** or **permanently delete** before reinstalling.

See [Migration 1.0](https://renatoxm.github.io/leanagentkit/migration-1.0).

## Workflow sizes

| Size            | When              | Loop                                                                      |
| --------------- | ----------------- | ------------------------------------------------------------------------- |
| **Trivial**     | Typo, rename, Q&A | Just do it                                                                |
| **Normal**      | Typical coding    | Ambient work → `check` → finalize                                         |
| **Substantial** | New/fuzzy feature | Needs **spec** pack: grill → new-spec → implement-spec → check → finalize |

## Optional packs

| Pack            | Purpose                                 |
| --------------- | --------------------------------------- |
| `spec`          | Grill, specs, implement, ADRs, progress |
| `stacks`        | Stack detect + greenfield scaffolders   |
| `practice`      | Review, debug, TDD, security, …         |
| `architecture`  | CA/DDD decomposition (needs `spec`)     |
| `backlog`       | Backlog.md board sync (needs `spec`)    |
| `git-lifecycle` | Branch/commit/PR offers (needs `spec`)  |
| `trevor`        | Reminders / concierge                   |
| `caveman`       | Terse commits & review comments         |
| `authoring`     | Distill / create project skills         |
| `imaginary`     | Resize/crop/convert via h2non/imaginary |

Full catalog: [Packs](https://renatoxm.github.io/leanagentkit/packs).

## Honest costs

- Memory stays useful only if `ACTIVE_CONTEXT` is refreshed on focus/edit
  milestones (ambient) and finalize runs when packs need PROGRESS/hooks.
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

MIT — free and open source forever. Use it, inspect it, adapt it, and share it
without paying for access.
