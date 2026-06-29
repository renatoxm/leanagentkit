# Lean Agent Kit

A lightweight, tool-agnostic alternative to GitHub Spec Kit for **existing**
projects. Tiered Markdown memory helps agents navigate by reading a map instead
of re-scanning the repo; stack detection wires up matching external skills;
`leanagentkit-check` validates work against captured conventions.

Works with Cursor, Claude Code, Copilot, ChatGPT, Aider, Cline — anything that
can read files and (optionally) MCP/skills.

## Why this instead of Spec Kit

- **Brownfield-first.** Maps and learns from code already in the repo — not a greenfield spec factory.
- **Smaller footprint.** Markdown files + prompt skills; tiers you don't use are never scaffolded.
- **Context-frugal.** Agents read `CODEBASE_MAP.md` + `ACTIVE_CONTEXT.md` and open only named files.
- **Guardrails.** `leanagentkit-check` enforces `AGENTS.md` conventions and stack playbooks.

## Quick start

1. Scaffold: `npm create lean-agent-kit` (or copy `AGENTS.md`, `.agent/`, `docs/`).
2. Tell your agent: **"Read `.agent/skills/leanagentkit-bootstrap.md` and follow it."**
3. Answer the questionnaire. Bootstrap maps the code, detects stack, wires agents.

Memory protocol and tier definitions live in **`AGENTS.md` §6** — the single source of truth.

## The full guide

This README is the _pitch_; **[`LEAN_AGENT_KIT_GUIDE.md`](./LEAN_AGENT_KIT_GUIDE.md) is the _playbook_.** It's the
end-to-end manual covering the mental model, memory tiers, the daily loop, workflows
from simple to complex, stacks & external skills, artifact generators,
engineering-practice guardrails, working across sessions/tools/teammates, pro tips &
anti-patterns, troubleshooting, and a one-page cheat sheet. Read it once front to
back, then keep it open as a reference.

## How it works: The daily loop workflow

Day to day, you don't re-explain your project to the agent — the Markdown memory
does it for you. Open your editor, tell the agent to **`leanagentkit-start-session`**,
and it primes itself by reading `ACTIVE_CONTEXT.md` and `CODEBASE_MAP.md` (cheap,
no repo scan), then picks up exactly where you left off. You describe what you
want; for anything new or fuzzy, let it `leanagentkit-grill` you into a clear plan
and freeze a spec with `leanagentkit-new-spec` before any code is written. Then you
build together. When a chunk of work is done, run `leanagentkit-check` to validate
it against your `AGENTS.md` conventions and stack rules, and close out with
`leanagentkit-end-session` so the next session — yours or a fresh agent's — starts
warm. Repeat each day; the memory files stay current as a side effect of working,
not as extra paperwork.

```
leanagentkit-start-session → (leanagentkit-grill → leanagentkit-new-spec for new work) → work  →  leanagentkit-check  →  leanagentkit-end-session
```

- **New feature** → `leanagentkit-grill` (align first) → `leanagentkit-new-spec` (before coding)
- **Refresh map** → `leanagentkit-map-codebase` (when structure changes)
- **Switching session/tool** → `leanagentkit-handoff` (bridge context to a fresh agent)

## What's inside

```
AGENTS.md                 # canonical rulebook + memory protocol (§6)
.agent/skills/            # kit skills (source of truth; frontmatter drives wrappers)
.agent/stacks/registry.md # tech → external skill mapping
.agent/recipes/           # frozen wiring for authored artifact generators
docs/CODEBASE_MAP.md      # navigation index
docs/memory/              # ACTIVE_CONTEXT, PROGRESS, SCRATCH
docs/specs/  docs/adr/    # feature specs, architecture decisions
```

Kit skills are listed in [`.agent/skills/README.md`](.agent/skills/README.md).
Invoke any skill: `Read .agent/skills/leanagentkit-<name>.md and follow it.`

## Built-in stack support

Detected automatically from `.agent/stacks/registry.md` (see that file for install commands).

| Stack                       | Type  | Notes                                     |
| --------------------------- | ----- | ----------------------------------------- |
| Cloudflare                  | skill | Workers, Pages, Wrangler                  |
| Hono                        | skill | needs `@hono/cli` devDep                  |
| Astro                       | skill | copy-in from framework monorepo           |
| Svelte/Kit                  | mcp   | `mcp.svelte.dev` — not copy-in files      |
| shadcn-svelte               | skill | needs Svelte 5 + Tailwind v4              |
| Tailwind v4                 | skill | REQUIRED docs-snapshot sync after install |
| Turborepo                   | skill | copy-in from framework monorepo           |
| Python / FastAPI / Django   | skill | see registry                              |
| Node / Express              | skill | see registry                              |
| React / Next.js             | skill | see registry                              |
| PostgreSQL + Prisma/Drizzle | skill | see registry                              |
| Go                          | skill | see registry                              |

Add your own tech by appending a row to `registry.md` (+ optional playbook).

## Artifact generators

No generators ship by default. To create one for your project (page, component,
CRUD, endpoint…):

```
Read .agent/skills/leanagentkit-skill-artifact-template.md and follow it.
```

The meta-skill infers wiring from an existing example, asks only about gaps, and
freezes a `leanagentkit-create-<type>` skill + recipe under `.agent/skills/generated/`
and `.agent/recipes/`. See `generated/README.md` for authored generators (empty until you create one).

## Stack skills (external, auto-installed)

_Filled by bootstrap Step 6. Re-run `leanagentkit-match-stack` after adding dependencies._

| Skill        | Use when |
| ------------ | -------- |
| _(none yet)_ |          |

## Key paths

| Path              | Role                                                     |
| ----------------- | -------------------------------------------------------- |
| `AGENTS.md`       | Canonical instructions — read every session              |
| `.agent/skills/`  | Kit skill definitions (single source of truth)           |
| `.agents/skills/` | External stack skills (`npx skills add` installs here)   |
| `.cursor/skills/` | Cursor wrappers (generated by `leanagentkit-wire-agent`) |
| `.claude/skills/` | Claude wrappers (generated by `leanagentkit-wire-agent`) |

> `.agent/` (singular) = kit files. `.agents/` (plural) = installed external skills.

## Refresh

Re-run bootstrap or individual skills when structure or stack changes:

```
Read .agent/skills/leanagentkit-bootstrap.md and follow it.
```

Or: `leanagentkit-map-codebase`, `leanagentkit-init-conventions`, `leanagentkit-match-stack`.

## All Skills

The kit ships 24 tool-agnostic skills grouped by lifecycle phase. Invoke any of
them with: **"Read `.agent/skills/leanagentkit-<name>.md` and follow it."**

### Orchestration — set up and maintain the kit

| Skill                      | What It Does                                                                                                                                  | Use When                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `leanagentkit-bootstrap`   | One-shot interactive setup — runs the questionnaire, maps the codebase, detects the stack, and wires agents (calls the other skills in order) | Setting up the kit in a project (**run this first**)       |
| `leanagentkit-wire-agent`  | Installs native agent config for Cursor and/or Claude — copies memory pointers and generates skill wrappers from `.agent/skills/` frontmatter | Wiring a new agent target, or after adding/renaming skills |
| `leanagentkit-match-stack` | Detects project technologies from `.agent/stacks/registry.md` and installs only the confirmed matching external skills                        | Bootstrapping, or after adding new dependencies            |
| `leanagentkit-check`       | Guardrail — validates changed files against `AGENTS.md`, stack playbooks, and the active spec; reports violations with citations              | After meaningful changes, before ending a session          |

### Memory — build and persist tiered context

| Skill                           | What It Does                                                                                                                                                                    | Use When                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `leanagentkit-map-codebase`     | (Re)generates `docs/CODEBASE_MAP.md` from repo structure and entry points so future sessions navigate by reading one file                                                       | Bootstrapping, or when the structure changes                        |
| `leanagentkit-init-conventions` | Fills `AGENTS.md` §1–5 with evidence-based conventions drawn from the actual repo                                                                                               | Bootstrapping, or when conventions drift from reality               |
| `leanagentkit-seed-adrs`        | Reverse-engineers architectural decisions already in the code into `docs/adr/*` files                                                                                           | Capturing the rationale behind existing decisions                   |
| `leanagentkit-grill`            | Relentlessly interviews you one question at a time to align on a plan before coding; explores the repo for answers instead of asking, then hands off to `leanagentkit-new-spec` | Before a feature or non-trivial change, when requirements are fuzzy |
| `leanagentkit-new-spec`         | Creates a feature spec in `docs/specs/<feature>.md`, Spec-Kit style, grounded in the current codebase                                                                           | Starting a new or in-progress feature, before coding                |
| `leanagentkit-start-session`    | Primes context cheaply — reads only `ACTIVE_CONTEXT.md` then `CODEBASE_MAP.md`, no repo globbing                                                                                | Starting a coding session                                           |
| `leanagentkit-end-session`      | Persists active context, progress, and map updates (runs `leanagentkit-check` first if code changed)                                                                            | Ending a coding session                                             |
| `leanagentkit-handoff`          | Compacts the current conversation into `docs/memory/HANDOFF.md` so a fresh agent or another tool can continue                                                                   | Context window fills, branching off, or switching tools mid-task    |

### Meta — author project-specific generators

| Skill                                  | What It Does                                                                                                                               | Use When                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `leanagentkit-skill-artifact-template` | Learns this codebase's recipe for an artifact once (from a real example) and freezes a standalone `create-<type>` generator skill + recipe | Creating a reusable generator (page, component, CRUD, endpoint…) |

### Engineering practice — always-on guardrails

| Skill                       | What It Does                                                                                                                           | Use When                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `leanagentkit-review`       | Multi-axis review across correctness, readability, architecture, security, and performance; approves when overall code health improves | Reviewing PRs or agent-generated code, before merge                     |
| `leanagentkit-simplify`     | Reduces complexity while preserving exact behavior — faster comprehension, not fewer lines                                             | Refactoring for readability, or when review flags complexity            |
| `leanagentkit-git-workflow` | Commits as save points, branches as sandboxes, history as documentation; atomic, reviewable changes                                    | Committing, branching, resolving conflicts, parallel work               |
| `leanagentkit-docs`         | Documents _why_ and rejected alternatives, not what the code already says — inline comments, API docs, README sections                 | Writing comments, API docs, changelogs, or README onboarding            |
| `leanagentkit-debug`        | Systematic root-cause triage — preserve evidence, localize, reduce, fix, guard against recurrence                                      | Tests fail, builds break, or behavior is unexpected                     |
| `leanagentkit-security`     | Treats input as hostile, secrets as sacred, authz as mandatory — OWASP-aligned boundary hardening                                      | Handling user input, auth, data storage, or integrations                |
| `leanagentkit-performance`  | Measurement-first optimization — profile, fix the proven bottleneck, measure again                                                     | Performance requirements exist or regressions are suspected             |
| `leanagentkit-deprecation`  | Removes code that no longer earns its keep; migrates users safely from old to new                                                      | Removing systems/APIs, consolidating duplicates, or sunsetting features |
| `leanagentkit-api-design`   | Designs stable interfaces that are hard to misuse — contracts, error semantics, boundary validation                                    | Creating endpoints, type contracts, or frontend/backend boundaries      |

### Engineering practice — conditional guardrails

Ship dormant (explicit-invoke); advertised in `AGENTS.md §7` only when
`leanagentkit-match-stack` detects matching evidence.

| Skill                        | What It Does                                                                                              | Use When                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `leanagentkit-ci-cd`         | Automates quality gates so no change reaches production without passing tests, lint, typecheck, and build | Setting up/modifying build pipelines, or debugging CI failures |
| `leanagentkit-observability` | Instruments code for production visibility — structured logging, metrics, tracing, symptom-based alerting | Adding telemetry, or shipping a deployable service             |

## Handoffs

The `leanagentkit-handoff` skill is one half of a two-step baton pass. It only **writes** the document; a fresh agent **reads** it to resume.

### Step 1 — The current agent writes the handoff (this skill)

When you run `leanagentkit-handoff`, the agent produces a single file:

```12:12:template/.agent/skills/leanagentkit-handoff.md
**Output file:** `docs/memory/HANDOFF.md`
```

That `docs/memory/HANDOFF.md` captures the goal, what's done, what's left, where you are, open questions/gotchas, and — importantly — a **"Suggested skills"** section telling the next agent exactly what to invoke (per step 3 of the procedure).

### Step 2 — The next agent picks it up

To continue the work in a **new session, new context window, or a different tool** (Cursor → Claude → Codex, etc.), the next agent does the following:

1. **Open `docs/memory/HANDOFF.md`** first. This is the in-flight baton — it's the entry point, not the normal session-start file.
2. **Run `leanagentkit-start-session`** to prime durable memory. This reads `docs/memory/ACTIVE_CONTEXT.md` → `docs/CODEBASE_MAP.md` → the active `docs/specs/<feature>.md`, then opens just the source files listed in "Files in play" / "Resume from here".

```12:18:template/.agent/skills/leanagentkit-start-session.md
1. Read **only**: `docs/memory/ACTIVE_CONTEXT.md`, then `docs/CODEBASE_MAP.md`.
2. Read the active feature's `docs/specs/<feature>.md` if one is named in
   ACTIVE_CONTEXT.
3. From the "Files in play" and "Resume from here" sections, open just those
   source files. Do not scan the repo.
```

3. **Follow the "Suggested skills" list** from the handoff, then **resume the concrete next action**.
4. Before wrapping up, run `leanagentkit-check`, and at a real stopping point run `leanagentkit-end-session`.

## Practically, how do you trigger the pickup?

Since the document lives **in the repo**, the next agent just needs to be pointed at it. In a fresh chat (any tool), start with something like:

> Read `docs/memory/HANDOFF.md` and continue the work. Follow the suggested skills.

The whole design goal is that this is self-sufficient:

```41:43:template/.agent/skills/leanagentkit-handoff.md
- A fresh agent could resume from `HANDOFF.md` alone plus the referenced files.
- No secrets or PII in the document.
- Nothing restated that already lives in a spec, ADR, or `PROGRESS.md`.
```

## Handoff vs. end-session — which to use

These solve different problems (lines 21–24 of the skill):

|                | `leanagentkit-handoff`                                                                                        | `leanagentkit-end-session`                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Purpose**    | Cross-window / cross-tool baton for an **in-flight** task                                                     | Persist **durable project memory** at a natural stopping point |
| **When**       | You're _not done_ but the conversation can't continue in place (context full, switching tools, branching off) | You've reached a real stopping point                           |
| **Writes**     | `docs/memory/HANDOFF.md`                                                                                      | `ACTIVE_CONTEXT.md`, `PROGRESS.md`, `CODEBASE_MAP.md`, ADRs    |
| **Resumed by** | Reading `HANDOFF.md` + `start-session`                                                                        | `start-session` alone                                          |

So: **handoff is for "pause mid-task and hand the baton to another agent right now"**, whereas end-session is for "this work is at a clean stopping point, save it for whenever."

One thing worth noting: the skill writes `HANDOFF.md` but doesn't say to **delete or stale-mark it** once consumed. If you do multiple handoffs over time, the next agent should treat the file as the _latest_ baton and overwrite it, so an old handoff isn't mistaken for current state. If you'd like, I can suggest a small wording addition to the skill to cover that — but I'm in Ask mode, so I can't edit it without you switching to Agent mode.
