# 🧠 Lean Agent Kit

> **Give your AI coding agent a memory — and a backbone.**
> A lightweight, tool-agnostic memory + stack-skill system that drops into **any existing project** and turns chaotic AI sessions into a disciplined, repeatable workflow.

⚡ **A leaner alternative to GitHub Spec Kit.** Works with **Cursor, Claude Code, Copilot, ChatGPT, Aider, Cline** — anything that can read files (and optionally MCP/skills).

---

## 😩 The problem (you know this pain)

Every new AI session starts from zero. You re-explain the architecture. The agent re-scans the whole repo, burns your context window, and *still* drifts away from your conventions. One file is clean, the next ignores every pattern you've established.

## 🚀 The fix

**Lean Agent Kit** gives your agent a persistent, tiered Markdown **memory** so it navigates by reading a *map* instead of re-scanning the repo — plus **guardrails** that enforce your conventions on every change.

It's **not** here to bootstrap a project from scratch. It's built for the real world: you point it at your **existing** codebase, it learns your architecture, workflows, and conventions, then acts as a guardrail system that keeps consistency high, architectural drift low, and output quality aligned with *your* stack and standards.

> 💡 The visitor's reaction we're going for: *"OMG, this is exactly what I needed."* 😄

---

## ✨ Why this instead of Spec Kit

- 🏗️ **Brownfield-first.** Maps and learns from the code already in your repo — not a greenfield spec factory.
- 🪶 **Smaller footprint.** Markdown files + prompt skills; tiers you don't use are never scaffolded.
- 🧮 **Context-frugal.** Agents read `CODEBASE_MAP.md` + `ACTIVE_CONTEXT.md` and open only the files they need.
- 🛡️ **Guardrails built in.** `leanagentkit-check` enforces `AGENTS.md` conventions and stack playbooks.
- 🔌 **Tool-agnostic.** No lock-in. Cursor & Claude Code get native wiring; everyone else just reads the files.

---

## ⚡ Usage

```bash
# 📂 into the current directory
npm create lean-agent-kit

# 🆕 into a new/named folder
npm create lean-agent-kit my-app

# 🔁 equivalently
npx create-lean-agent-kit .
```

Then open your AI agent in the project and say:

> 🪄 Read `.agent/skills/leanagentkit-bootstrap.md` and follow it.

That runs the **interactive setup**: choose memory tiers, map the codebase, detect your stack, and wire up matching framework skills.

🚩 **Flags:** `--force` overwrite existing kit files · `--help`.

---

## 📚 The full guide

The README is the *pitch*; **[`GUIDE.md`](template/GUIDE.md) is the *playbook*.** 🏈

It's the end-to-end manual that takes you from your very first `start-session` to authoring custom generators and orchestrating multiple agents in parallel — the mental model, memory tiers, the daily loop, workflows from simple to complex, stacks & external skills, engineering-practice guardrails, pro tips, troubleshooting, and a one-page cheat sheet.

> 💡 Read it once front to back, then keep it open as a reference. (It ships in every scaffolded project as `GUIDE.md`.)

---

## 📦 Installation (the no-npm way)

The kit is *just files*, so you can also pull the template directly:

```bash
npx degit YOUR_USER/create-lean-agent-kit/template
```

---

## 📥 What it scaffolds

Tiered Markdown memory (long / medium / short), the `.agent/` skills and stack registry, and `docs/` for the codebase map, ADRs, specs, and session memory.

```
AGENTS.md                 # 📜 canonical rulebook + memory protocol (§6)
.agent/skills/            # 🧩 kit skills (source of truth; frontmatter drives wrappers)
.agent/stacks/registry.md # 🔍 tech → external skill mapping
.agent/recipes/           # ❄️ frozen wiring for authored artifact generators
docs/CODEBASE_MAP.md      # 🗺️ navigation index
docs/memory/              # 🧠 ACTIVE_CONTEXT, PROGRESS, SCRATCH
docs/specs/  docs/adr/    # 📋 feature specs, architecture decisions
```

> Full details land in `LEAN_AGENT_KIT.md` in the target project (a copy of the kit's own README, renamed so it never clobbers your project README).

---

## 🔄 The daily loop

Day to day, you don't re-explain your project — the Markdown memory does it for you.

```
leanagentkit-start-session → (grill → new-spec for new work) → work → check → end-session
```

1. ▶️ **`leanagentkit-start-session`** — primes itself from `ACTIVE_CONTEXT.md` + `CODEBASE_MAP.md` (cheap, no repo scan) and picks up where you left off.
2. 🔥 **`leanagentkit-grill`** → ❄️ **`leanagentkit-new-spec`** — for anything new or fuzzy, it interrogates you into a clear plan and freezes a spec *before* any code is written.
3. 🛠️ **Work together** — you build the feature.
4. ✅ **`leanagentkit-check`** — validates the work against your `AGENTS.md` conventions and stack rules.
5. 💾 **`leanagentkit-end-session`** — so the next session (yours or a fresh agent's) starts warm.

The memory files stay current as a **side effect of working**, not as extra paperwork. 🙌

- 🆕 **New feature** → `leanagentkit-grill` → `leanagentkit-new-spec`
- 🗺️ **Refresh map** → `leanagentkit-map-codebase` (when structure changes)
- 🤝 **Switching session/tool** → `leanagentkit-handoff` (bridge context to a fresh agent)

---

## 🧰 Built-in stack support

Detected automatically from `.agent/stacks/registry.md`.

| Stack                       | Type  | Notes                                     |
| --------------------------- | ----- | ----------------------------------------- |
| ☁️ Cloudflare               | skill | Workers, Pages, Wrangler                  |
| 🔥 Hono                      | skill | needs `@hono/cli` devDep                  |
| 🚀 Astro                     | skill | copy-in from framework monorepo           |
| 🧡 Svelte/Kit                | mcp   | `mcp.svelte.dev` — not copy-in files      |
| 🎨 shadcn-svelte             | skill | needs Svelte 5 + Tailwind v4              |
| 💨 Tailwind v4               | skill | REQUIRED docs-snapshot sync after install |
| 🏗️ Turborepo                | skill | copy-in from framework monorepo           |
| 🐍 Python / FastAPI / Django | skill | see registry                              |
| 🟢 Node / Express            | skill | see registry                              |
| ⚛️ React / Next.js          | skill | see registry                              |
| 🐘 PostgreSQL + Prisma/Drizzle | skill | see registry                            |
| 🐹 Go                        | skill | see registry                              |

➕ Add your own tech by appending a row to `registry.md` (+ optional playbook).

---

## 🎁 What's in the box — 24 tool-agnostic skills

Invoke any skill with: **"Read `.agent/skills/leanagentkit-<name>.md` and follow it."**

### 🎛️ Orchestration — set up and maintain the kit

| Skill                      | What It Does                                                                                                                                  | Use When                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `leanagentkit-bootstrap`   | One-shot interactive setup — questionnaire, maps the codebase, detects the stack, wires agents (calls the other skills in order)               | Setting up the kit in a project (**run this first**)       |
| `leanagentkit-wire-agent`  | Installs native agent config for Cursor and/or Claude — copies memory pointers and generates skill wrappers from `.agent/skills/` frontmatter | Wiring a new agent target, or after adding/renaming skills |
| `leanagentkit-match-stack` | Detects project technologies from `.agent/stacks/registry.md` and installs only the confirmed matching external skills                        | Bootstrapping, or after adding new dependencies            |
| `leanagentkit-check`       | Guardrail — validates changed files against `AGENTS.md`, stack playbooks, and the active spec; reports violations with citations              | After meaningful changes, before ending a session          |

### 🧠 Memory — build and persist tiered context

| Skill                           | What It Does                                                                                                                                  | Use When                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `leanagentkit-map-codebase`     | (Re)generates `docs/CODEBASE_MAP.md` from repo structure and entry points so future sessions navigate by reading one file                     | Bootstrapping, or when the structure changes                        |
| `leanagentkit-init-conventions` | Fills `AGENTS.md` §1–5 with evidence-based conventions drawn from the actual repo                                                             | Bootstrapping, or when conventions drift from reality               |
| `leanagentkit-seed-adrs`        | Reverse-engineers architectural decisions already in the code into `docs/adr/*` files                                                         | Capturing the rationale behind existing decisions                   |
| `leanagentkit-grill`            | Relentlessly interviews you one question at a time to align on a plan before coding, then hands off to `leanagentkit-new-spec`                 | Before a feature or non-trivial change, when requirements are fuzzy |
| `leanagentkit-new-spec`         | Creates a feature spec in `docs/specs/<feature>.md`, Spec-Kit style, grounded in the current codebase                                         | Starting a new or in-progress feature, before coding                |
| `leanagentkit-start-session`    | Primes context cheaply — reads only `ACTIVE_CONTEXT.md` then `CODEBASE_MAP.md`, no repo globbing                                              | Starting a coding session                                           |
| `leanagentkit-end-session`      | Persists active context, progress, and map updates (runs `leanagentkit-check` first if code changed)                                          | Ending a coding session                                             |
| `leanagentkit-handoff`          | Compacts the current conversation into `docs/memory/HANDOFF.md` so a fresh agent or another tool can continue                                 | Context window fills, branching off, or switching tools mid-task    |

### 🏭 Meta — author project-specific generators

| Skill                                  | What It Does                                                                                                                               | Use When                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `leanagentkit-skill-artifact-template` | Learns this codebase's recipe for an artifact once (from a real example) and freezes a standalone `create-<type>` generator skill + recipe | Creating a reusable generator (page, component, CRUD, endpoint…) |

### 🛡️ Engineering practice — always-on guardrails

| Skill                       | What It Does                                                                                                                           | Use When                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `leanagentkit-review`       | Multi-axis review across correctness, readability, architecture, security, and performance; approves when overall code health improves | Reviewing PRs or agent-generated code, before merge                     |
| `leanagentkit-simplify`     | Reduces complexity while preserving exact behavior — faster comprehension, not fewer lines                                             | Refactoring for readability, or when review flags complexity            |
| `leanagentkit-git-workflow` | Commits as save points, branches as sandboxes, history as documentation; atomic, reviewable changes                                    | Committing, branching, resolving conflicts, parallel work               |
| `leanagentkit-docs`         | Documents _why_ and rejected alternatives, not what the code already says                                                              | Writing comments, API docs, changelogs, or README onboarding            |
| `leanagentkit-debug`        | Systematic root-cause triage — preserve evidence, localize, reduce, fix, guard against recurrence                                      | Tests fail, builds break, or behavior is unexpected                     |
| `leanagentkit-security`     | Treats input as hostile, secrets as sacred, authz as mandatory — OWASP-aligned boundary hardening                                      | Handling user input, auth, data storage, or integrations                |
| `leanagentkit-performance`  | Measurement-first optimization — profile, fix the proven bottleneck, measure again                                                     | Performance requirements exist or regressions are suspected             |
| `leanagentkit-deprecation`  | Removes code that no longer earns its keep; migrates users safely from old to new                                                      | Removing systems/APIs, consolidating duplicates, or sunsetting features |
| `leanagentkit-api-design`   | Designs stable interfaces that are hard to misuse — contracts, error semantics, boundary validation                                    | Creating endpoints, type contracts, or frontend/backend boundaries      |

### ⚙️ Engineering practice — conditional guardrails

Ship dormant (explicit-invoke); advertised in `AGENTS.md §7` only when `leanagentkit-match-stack` detects matching evidence.

| Skill                        | What It Does                                                                                              | Use When                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `leanagentkit-ci-cd`         | Automates quality gates so no change reaches production without passing tests, lint, typecheck, and build | Setting up/modifying build pipelines, or debugging CI failures |
| `leanagentkit-observability` | Instruments code for production visibility — structured logging, metrics, tracing, symptom-based alerting | Adding telemetry, or shipping a deployable service             |

---

## 🗂️ Repo layout

```
bin/cli.mjs            # 🚪 the npx entry point (zero deps)
template/              # 📦 the payload copied into user projects
  AGENTS.md  .agent/  docs/  README.md
.husky/                # 🪝 commit hooks (contributors only; not shipped)
commitlint.config.js
package.json           # 📋 "files" ships only bin/ + template/
```

---

## 🧑‍💻 Developing

```bash
npm install            # ⚙️ sets up husky hooks via "prepare"

# 🧪 test the CLI locally without publishing:
node bin/cli.mjs /tmp/test-target
npm test
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint on `commit-msg`). ✍️

---

## 🚢 Publishing

```bash
npm login
npm publish --access public
```

Only `bin/` and `template/` ship (see the `files` whitelist in `package.json`); husky, configs, and tests stay in the repo. 🔒

---

## 🙏 Credits

The engineering-practice skills (code review, simplification, git workflow, documentation, debugging, security, performance, deprecation, API design, CI/CD, and observability) were adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — thanks to **Addy Osmani** and contributors for the inspiration. 💛

The alignment and handoff skills (`leanagentkit-grill`, `leanagentkit-handoff`) were adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT) — thanks to **Matt Pocock** for the `grilling` and `handoff` skills. 💛

---

## 📜 License

**MIT** — go build something great. 🚀
