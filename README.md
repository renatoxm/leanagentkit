# 🧠 Lean Agent Kit

> **Give your AI coding agent a memory — and a backbone.**
> A tool-agnostic memory + guardrail system that keeps your agent's **context lean**: it navigates by a Markdown _map_ and pulls only the files each task needs — instead of re-scanning your whole repo every session.

⚡ Works with **Cursor, Claude Code, Copilot, ChatGPT, Aider, Cline** — anything that can read files (and optionally MCP/skills). Far leaner on your context window than letting the agent glob the repo (or than GitHub Spec Kit).

📖 **Documentation:** [renatoxm.github.io/leanagentkit](https://renatoxm.github.io/leanagentkit/)

---

## 😩 The problem (you know this pain)

Every new AI session starts from zero. You re-explain the architecture. The agent re-scans the whole repo, burns your context window, and _still_ drifts away from your conventions. One file is clean, the next ignores every pattern you've established.

## 🚀 The fix

**Lean Agent Kit** gives your agent a persistent, tiered Markdown **memory** so it navigates by reading a _map_ instead of re-scanning the repo — plus **guardrails** that enforce your conventions on every change. The payoff is a **lean context window**: the agent loads a small, curated map and pulls only the files each task needs, no more, no less.

It works from **any starting point**. Point it at an existing codebase and it learns your architecture, workflows, and conventions; start from zero and `leanagentkit-scaffold` stands up a new app first (registry-backed, non-interactive). Either way, the *same* memory + guardrail loop keeps consistency high and architectural drift low.

> 💡 The visitor's reaction we're going for: _"OMG, this is exactly what I needed."_ 😄

---

## ✨ Why it's *lean*: two dimensions of one idea

"Lean" isn't about being tidier than the next tool — it's about **context economics**. The kit is lean in two reinforcing ways:

- 🧮 **Lean context (runtime).** Every session the agent reads a small, curated memory — `CODEBASE_MAP.md` + `ACTIVE_CONTEXT.md` — then opens _only_ the files a task needs. Context is demand-paged, never dumped. No globbing, no 40-message warm-up, no drift.
- 🪶 **Lean footprint (setup).** The kit only scaffolds what your project actually uses — tiers you don't enable and stacks you don't have are never created. A small, high-signal footprint is _what makes_ lean context possible.

Everything else follows from those two:

- 🏗️ **Green- or brownfield.** Scaffold a fresh app with `leanagentkit-scaffold`, or map and learn from the code already in your repo — the same lean loop runs either way.
- 🛡️ **Guardrails built in.** `leanagentkit-check` enforces `AGENTS.md` conventions and stack playbooks.
- 🔌 **Tool-agnostic.** No lock-in. Cursor & Claude Code get native wiring; everyone else just reads the files.
- 🔄 **Closed learning loop.** Distill session workflows into reusable skills; curate stale generators — skills compound over time.

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

🚩 **Flags:** `--force` overwrite existing kit files · `--upgrade` refresh kit files safely · `--help`.

### Upgrading an installed kit

```bash
# refresh kit-owned files; preserve your memory and conventions
npm create lean-agent-kit . --upgrade

# equivalently
npx create-lean-agent-kit . --upgrade
```

**Refreshed** (kit-owned): `.agent/skills/`, `.agent/stacks/*` playbooks, `.agent/scaffolders/`, `.agent/install/` templates, `LEAN_AGENT_KIT_GUIDE.md`, and other template files.

**Preserved** (user-owned): `AGENTS.md`, `docs/CODEBASE_MAP.md`, `docs/memory/*`, `.agent/stacks/registry.md` (your custom rows), `.agent/skills/generated/README.md`, and `docs/adr/0001-*`.

Before overwriting any differing file, the CLI backs it up under `.leanagentkit-backup/<timestamp>/`. The installed version is recorded in `.agent/.leanagentkit-version`.

After upgrading, re-run the wire-agent skill if you use Cursor or Claude Code:

> Read `.agent/skills/leanagentkit-wire-agent.md` and follow it.

> **Note:** Upgrade is additive — files removed from the kit in a newer release are not deleted from your project. Use `--force` only for a full re-scaffold (will clobber user data).

---

## 📚 The full guide

The README is the _pitch_; **[`LEAN_AGENT_KIT_GUIDE.md`](template/LEAN_AGENT_KIT_GUIDE.md) is the _playbook_.** 🏈

It's the end-to-end manual that takes you from your very first `start-session` to authoring custom generators and orchestrating multiple agents in parallel — the mental model, memory tiers, the daily loop, workflows from simple to complex, stacks & external skills, engineering-practice guardrails, pro tips, troubleshooting, and a one-page cheat sheet.

> 💡 Read it once front to back, then keep it open as a reference. (It ships in every scaffolded project as `LEAN_AGENT_KIT_GUIDE.md`.)

---

## 📦 Installation (the no-npm way)

The kit is _just files_, so you can also pull the template directly:

```bash
npx degit YOUR_USER/create-lean-agent-kit/template
```

---

## 📥 What it scaffolds

Tiered Markdown memory (long / medium / short), the `.agent/` skills and stack registry, `.agent/scaffolders/` greenfield recipes, and `docs/` for the codebase map, ADRs, specs, and session memory.

```
AGENTS.md                 # 📜 canonical rulebook + memory protocol (§6)
.agent/skills/            # 🧩 kit skills (source of truth; frontmatter drives wrappers)
.agent/stacks/registry.md # 🔍 tech → external skill mapping
.agent/scaffolders/       # 🌱 greenfield scaffold recipes (registry-backed)
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
leanagentkit-start-session → (grill → new-spec → implement-spec for new work) → check → end-session
```

1. ▶️ **`leanagentkit-start-session`** — primes itself from `ACTIVE_CONTEXT.md` + `CODEBASE_MAP.md` (cheap, no repo scan) and picks up where you left off.
2. 🔥 **`leanagentkit-grill`** → ❄️ **`leanagentkit-new-spec`** → 🛠️ **`leanagentkit-implement-spec`** — for anything new or fuzzy, interrogate into a clear plan, freeze a spec, then implement it spec-driven and sequentially.
3. ✅ **`leanagentkit-check`** — validates the work against your `AGENTS.md` conventions and stack rules.
4. 💾 **`leanagentkit-end-session`** — so the next session (yours or a fresh agent's) starts warm.

The memory files stay current as a **side effect of working**, not as extra paperwork. 🙌

- 🆕 **New feature** → `leanagentkit-grill` → `leanagentkit-new-spec` → `leanagentkit-implement-spec`
- 🗺️ **Refresh map** → `leanagentkit-map-codebase` (when structure changes)
- 🤝 **Context full mid-task** → `leanagentkit-handoff` → new chat → `leanagentkit-start-session` (read `HANDOFF.md`)
- 💾 **Natural pause** → `leanagentkit-check` → `leanagentkit-end-session` → `leanagentkit-start-session` next time
- 🤖 **Ask Trevor** → `leanagentkit-ask-trevor` — optional concierge for teaching, reminders, checklists, and Backlog UX ([docs](/trevor))

Starting a new chat when context fills is fine — use **`handoff`** when the same task continues, **`end-session`** when you're at a clean stopping point. See the [full guide](template/LEAN_AGENT_KIT_GUIDE.md#-9-working-across-sessions-tools--teammates).

---

## 🧰 Built-in stack support

Detected automatically from `.agent/stacks/registry.md`.

| Stack                          | Type  | Notes                                     |
| ------------------------------ | ----- | ----------------------------------------- |
| ☁️ Cloudflare                  | skill | Workers, Pages, Wrangler                  |
| 🔥 Hono                        | skill | needs `@hono/cli` devDep                  |
| 🚀 Astro                       | skill | copy-in from framework monorepo           |
| 🧡 Svelte/Kit                  | mcp   | `mcp.svelte.dev` — not copy-in files      |
| 🎨 shadcn-svelte               | skill | needs Svelte 5 + Tailwind v4              |
| 💨 Tailwind v4                 | skill | REQUIRED docs-snapshot sync after install |
| 🏗️ Turborepo                   | skill | copy-in from framework monorepo           |
| 🐍 Python / FastAPI / Django   | skill | see registry                              |
| 🟢 Node / Express              | skill | see registry                              |
| ⚛️ React / Next.js             | skill | see registry                              |
| 🐘 PostgreSQL + Prisma/Drizzle | skill | see registry                              |
| 🐹 Go                          | skill | see registry                              |

➕ Add your own tech by appending a row to `registry.md` (+ optional playbook).

---

## Visual task board (Backlog.md)

Optional integration for a **Kanban terminal board** or **web UI** synced to your
Lean Agent Kit specs. The kit stays files-only and zero-deps — Backlog.md is a
separate install the agent guides you through during bootstrap.

```bash
npm i -g backlog.md          # or: brew install backlog-md
backlog init "<project-name>"   # use --no-git if no Git repo
```

Then run bootstrap (or re-run `leanagentkit-match-stack`) so `leanagentkit-backlog`
is detected and wired into the daily loop:

- **`new-spec`** creates a linked Backlog card (`To Do`)
- **`implement-spec`** moves it to `In Progress` and checks off acceptance criteria
- **`end-session`** moves to `Done` only when the spec is finished

Specs (`docs/specs/`) own content; Backlog cards own status visualization.
Human views: `backlog board` · `backlog browser`.

Full details: [Backlog.md integration guide](/backlog) · skill:
`.agent/skills/leanagentkit-backlog.md`

---

## Git lifecycle (optional prompts)

Optional integration for **branch, commit, and PR offers** at natural lifecycle
boundaries — synced to specs, never forced on `new-spec`. Opt in during bootstrap
(Step 3c); the agent copies `.leanagentkit/git-lifecycle.yml.example` to
`.leanagentkit/git-lifecycle.yml`.

Then run bootstrap (or re-run `leanagentkit-match-stack`) so `leanagentkit-git-lifecycle`
is detected and wired into the daily loop:

- **`implement-spec`** offers a feature branch at start; optional PR when spec is done
- **`end-session`** offers a save-point commit when the working tree is dirty

Specs (`docs/specs/`) own intent; the git branch is the execution sandbox.
Every operation is prompt-only — never auto-commit, push, or open PR.

Full details: [Git lifecycle integration guide](/git-lifecycle) · skill:
`.agent/skills/leanagentkit-git-lifecycle.md`

---

## 🎁 What's in the box — 32 tool-agnostic skills

Invoke any skill with: **"Read `.agent/skills/leanagentkit-<name>.md` and follow it."**

### 🎛️ Orchestration — set up and maintain the kit

| Skill                      | What It Does                                                                                                                                  | Use When                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `leanagentkit-bootstrap`   | One-shot interactive setup — questionnaire, maps the codebase, detects the stack, wires agents (calls the other skills in order)              | Setting up the kit in a project (**run this first**)       |
| `leanagentkit-wire-agent`  | Installs native agent config for Cursor and/or Claude — copies memory pointers and generates skill wrappers from `.agent/skills/` frontmatter | Wiring a new agent target, or after adding/renaming skills |
| `leanagentkit-match-stack` | Detects project technologies from `.agent/stacks/registry.md` and installs only the confirmed matching external skills                        | Bootstrapping, or after adding new dependencies            |
| `leanagentkit-scaffold`    | Memory-aware greenfield/additive scaffolding — questionnaire, non-interactive generators, handoff to match-stack                               | Empty repo or adding ORM/UI/platform to an existing app    |
| `leanagentkit-check`       | Guardrail — validates changed files against `AGENTS.md`, stack playbooks, and the active spec; reports violations with citations              | After meaningful changes, before ending a session          |

### 🧠 Memory — build and persist tiered context

| Skill                           | What It Does                                                                                                                   | Use When                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `leanagentkit-map-codebase`     | (Re)generates `docs/CODEBASE_MAP.md` from repo structure and entry points so future sessions navigate by reading one file      | Bootstrapping, or when the structure changes                        |
| `leanagentkit-init-conventions` | Fills `AGENTS.md` §1–5 with evidence-based conventions drawn from the actual repo                                              | Bootstrapping, or when conventions drift from reality               |
| `leanagentkit-seed-adrs`        | Reverse-engineers architectural decisions already in the code into `docs/adr/*` files                                          | Capturing the rationale behind existing decisions                   |
| `leanagentkit-grill`            | Relentlessly interviews you one question at a time to align on a plan before coding, then hands off to `leanagentkit-new-spec` | Before a feature or non-trivial change, when requirements are fuzzy |
| `leanagentkit-spike`            | Throwaway feasibility experiments under `spikes/` to validate an idea before committing to a build                            | "Is this possible?", comparing approaches, or prototyping           |
| `leanagentkit-new-spec`         | Creates a feature spec in `docs/specs/<feature>.md`, Spec-Kit style, grounded in the current codebase                          | Starting a new or in-progress feature, before coding                |
| `leanagentkit-implement-spec`   | Implements an approved spec from `docs/specs/` — spec-driven, sequential work with optional Cursor Plan mode handoff           | When a spec exists and the user is ready to code                    |
| `leanagentkit-start-session`    | Primes context cheaply — reads only `ACTIVE_CONTEXT.md` then `CODEBASE_MAP.md`, no repo globbing                               | Starting a coding session                                           |
| `leanagentkit-end-session`      | Persists active context, progress, and map updates (runs `leanagentkit-check` first if code changed)                           | Ending a coding session                                             |
| `leanagentkit-handoff`          | Compacts the current conversation into `docs/memory/HANDOFF.md` so a fresh agent or another tool can continue                  | Context window fills, branching off, or switching tools mid-task    |
| `leanagentkit-ask-trevor`       | Trevor concierge — teach the kit, answer from memory, reminders, checklists, Backlog UX, workflows (opt-in via `trevor.yml`)   | "How do I…", reminders, checklists, "what should I do next?"        |
| `leanagentkit-distill-skill`    | Distills a session workflow (or named source) into a reusable `generated/` skill following agentskills.io standards            | After repeating a workflow 2+ times or when a procedure should persist |

### 🏭 Meta — author project-specific generators

| Skill                                  | What It Does                                                                                                                               | Use When                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `leanagentkit-skill-artifact-template` | Learns this codebase's recipe for an artifact once (from a real example) and freezes a standalone `create-<type>` generator skill + recipe | Creating a reusable generator (page, component, CRUD, endpoint…) |
| `leanagentkit-curate-skills`         | Reviews generated skills — flags stale/duplicate generators, archives (never deletes), respects `pinned` status                            | Periodically, or when the generated skills registry grows          |

### 🛡️ Engineering practice — always-on guardrails

| Skill                       | What It Does                                                                                                                           | Use When                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `leanagentkit-review`       | Multi-axis review across correctness, readability, architecture, security, and performance; approves when overall code health improves | Reviewing PRs or agent-generated code, before merge                     |
| `leanagentkit-simplify`     | Reduces complexity while preserving exact behavior — faster comprehension, not fewer lines                                             | Refactoring for readability, or when review flags complexity            |
| `leanagentkit-git-workflow` | Commits as save points, branches as sandboxes, history as documentation; atomic, reviewable changes                                    | Committing, branching, resolving conflicts, parallel work               |
| `leanagentkit-docs`         | Documents _why_ and rejected alternatives, not what the code already says                                                              | Writing comments, API docs, changelogs, or README onboarding            |
| `leanagentkit-debug`        | Systematic root-cause triage — preserve evidence, localize, reduce, fix, guard against recurrence                                      | Tests fail, builds break, or behavior is unexpected                     |
| `leanagentkit-tdd`          | Test-first RED-GREEN-REFACTOR discipline — write failing test, minimal code, refactor after green                                    | Adding features, fixing bugs, or changing behavior                        |
| `leanagentkit-security`     | Treats input as hostile, secrets as sacred, authz as mandatory — OWASP-aligned boundary hardening                                      | Handling user input, auth, data storage, or integrations                |
| `leanagentkit-performance`  | Measurement-first optimization — profile, fix the proven bottleneck, measure again                                                     | Performance requirements exist or regressions are suspected             |
| `leanagentkit-deprecation`  | Removes code that no longer earns its keep; migrates users safely from old to new                                                      | Removing systems/APIs, consolidating duplicates, or sunsetting features |
| `leanagentkit-api-design`   | Designs stable interfaces that are hard to misuse — contracts, error semantics, boundary validation                                    | Creating endpoints, type contracts, or frontend/backend boundaries      |

### ⚙️ Engineering practice — conditional guardrails

Ship dormant (explicit-invoke); advertised in `AGENTS.md §7` only when `leanagentkit-match-stack` detects matching evidence.

| Skill                        | What It Does                                                                                              | Use When                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `leanagentkit-ci-cd`         | Automates quality gates so no change reaches production without passing tests, lint, typecheck, and build | Setting up/modifying build pipelines, or debugging CI failures |
| `leanagentkit-observability` | Instruments code for production visibility — structured logging, metrics, tracing, symptom-based alerting | Adding telemetry, or shipping a deployable service             |
| `leanagentkit-backlog`       | Syncs Backlog.md Kanban cards to kit specs and session lifecycle (status layer only)                      | Visual task board when Backlog.md is installed and initialized |
| `leanagentkit-git-lifecycle` | Branch, commit, and PR offers synced to spec workflow (prompt-only; never automatic)                      | Git repo with `.leanagentkit/git-lifecycle.yml` config         |

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

The engineering-practice skills (code review, simplification, git workflow, documentation, debugging, TDD, security, performance, deprecation, API design, CI/CD, and observability) were adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — thanks to **Addy Osmani** and contributors for the inspiration. 💛

The alignment and handoff skills (`leanagentkit-grill`, `leanagentkit-handoff`) were adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT) — thanks to **Matt Pocock** for the `grilling` and `handoff` skills. 💛

The learning-loop skills (`leanagentkit-distill-skill`, `leanagentkit-curate-skills`) and agentskills.io-compliant authoring standards were inspired by [Hermes Agent](https://github.com/NousResearch/hermes-agent) from **Nous Research** and the [agentskills.io](https://agentskills.io) open standard. 💛

`leanagentkit-tdd` was adapted from [obra/superpowers](https://github.com/obra/superpowers) (MIT) via Hermes Agent. `leanagentkit-spike` was adapted from [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) (MIT) by Lex Christopherson, via Hermes Agent. 💛

---

## 📜 License

**MIT** — go build something great. 🚀
