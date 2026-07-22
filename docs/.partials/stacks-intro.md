Requires the **stacks** pack:

```bash
npx create-lean-agent-kit@latest . --enable-pack stacks
```

## What it is

The stacks pack teaches your agent about the frameworks and tools in your repo.
It can **detect** what you already use (Next.js, Hono, Prisma, …) and wire matching
skills and conventions into `AGENTS.md`. On a greenfield project it can also
**scaffold** a new app from a questionnaire, then run detection afterward.

Nothing runs as a Node library. The agent follows Markdown skills —
`leanagentkit-match-stack` and `leanagentkit-scaffold` — backed by a registry of
supported technologies.

## Do I need this pack?

```mermaid
flowchart TD
  q1{"Starting a new app or adding a framework?"} -->|Yes| enable["Enable stacks"]
  q1 -->|No| q2{"Want the agent to detect your stack and install matching skills?"}
  q2 -->|Yes| enable
  q2 -->|No| q3{"Happy managing AGENTS.md stack notes yourself?"}
  q3 -->|Yes| skip["Skip - core is enough"]
  q3 -->|No| maybe["Optional - enable later"]
```

- **Enable if** you are greenfield-scaffolding an app, or you want automatic stack
  detection + external skill install (Hono, Cloudflare, Tailwind, Svelte MCP, …).
- **Skip if** your repo is stable, you already wrote stack conventions in
  `AGENTS.md`, and you do not need scaffold recipes.

## Use cases

- **Greenfield** — empty or kit-only repo; pick Next.js / SvelteKit / Hono / etc.
  from a questionnaire; agent runs a non-interactive generator, then match-stack.
  May also offer optional [commit helpers](#optional-commit-helpers).
- **Brownfield** — existing Django + React monorepo; match-stack detects rows,
  offers skill installs, folds playbook conventions into `AGENTS.md` §4 / §7.
  Does **not** install commitlint/commitizen (scaffold-only — see below).
- **Additive** — already have a Node app; scaffold Prisma or Tailwind without
  replacing the base framework. Commit helpers may be offered when the recipe
  touches a Node `package.json`.
- **Re-run after enable** — you enabled Caveman or git-lifecycle; re-run
  match-stack so `AGENTS.md` §7 advertises the new skills.

## How it works

```mermaid
flowchart TD
  A[Enable stacks pack] --> B{Repo state?}
  B -->|Empty or kit-only| C[leanagentkit-scaffold]
  B -->|Existing app| D[leanagentkit-match-stack]
  C -->|Creates app files| D
  D --> E[Confirm detected stacks]
  E --> F{Row type?}
  F -->|skill| G[Install external skill]
  F -->|mcp| H[Write MCP config]
  F -->|playbook| I[Apply local playbook only]
  G --> J[Update AGENTS.md and CODEBASE_MAP]
  H --> J
  I --> J
```

| Path | Skill | When |
|------|-------|------|
| Detect / wire | `leanagentkit-match-stack` | Existing app, or after scaffold |
| Create / add | `leanagentkit-scaffold` | Greenfield base app or additive ORM / UI / platform |

**Playbook vs external skill:** some registry rows install an upstream skill or
MCP (Cloudflare, Hono, Svelte, Tailwind). Others are **playbook-only** (React,
Express, Django, Prisma, Go) — local conventions only, no external install.

Bootstrap offers stacks in Step 0; if chosen, it runs match-stack after
conventions (and may offer scaffold first on greenfield).

## Optional commit helpers

During `leanagentkit-scaffold` on Node apps, the agent may ask whether to add
**commit helpers** — Conventional Commits via commitlint, commitizen (`cz`),
husky `commit-msg`, and `commit-and-tag-version` for releases. That prompt is
**scaffold-only** (skill-level Step 4.6 in `leanagentkit-scaffold`, not listed
in recipe `## Questions` tables). When installed (or already present),
`leanagentkit-init-conventions` / scaffold records in `AGENTS.md` §4 that
subject and body/footer lines must be ≤ 100 chars
(`@commitlint/config-conventional`) and prefers the package manager’s
`commit` script (e.g. `pnpm commit`).

| Situation | Commit helpers offered? |
|-----------|-------------------------|
| Greenfield / additive scaffold that creates or updates a Node `package.json` | Yes (default yes) |
| Existing (occupied) app — bootstrap + `match-stack` only | No |
| Python/Go-only recipes with no Node manifest | No |
| Already configured (`commitlint.config.*`, `.husky/commit-msg`, or commitizen in `package.json`) | Skipped |

On a **brownfield** Vite + React (or similar) repo, installing the kit and
running bootstrap wires stack skills — it does **not** ask about commitlint or
commitizen. To add them later, ask the agent to run the commit-helpers steps
from `leanagentkit-scaffold` Step 5 against your app directory, or install the
packages yourself.

Related: [Getting Started](/getting-started#existing-apps) · [Git lifecycle](/git-lifecycle)
(branch/PR *offers*, not commit-message tooling) · [Caveman](/caveman) (terse
message style, not commitlint).

## Supported stacks (registry)

Detection rules, install commands, and playbook paths live in the pack registry
below. Edit the source file in the kit — do not edit the generated page by hand.
