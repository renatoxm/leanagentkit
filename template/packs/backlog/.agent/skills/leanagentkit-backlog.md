---
name: leanagentkit-backlog
description: Optional Backlog.md integration — visual Kanban board synced to Lean Agent Kit specs and session lifecycle.
invocation: conditional
---

# Skill: leanagentkit-backlog

**Goal:** Wire [Backlog.md](https://github.com/MrLesk/Backlog.md) into the kit as an
optional visual task layer. The **spec** (`docs/specs/NNN-*.md`) is the source of
truth for content; the **Backlog card** is the status/visualization layer.

**When active:** other lifecycle skills (ambient start / optional `start-session`,
`new-spec`, `implement-spec`, `check`, finalize / optional `end-session`) call into
this skill's procedures. When inactive, they are silent no-ops.

## Detection contract

Backlog integration is **active** only when **both** are true:

1. `backlog` resolves on PATH (`command -v backlog`).
2. A Backlog project exists in the repo: `backlog/`, `.backlog/`, or `backlog.config.yml`.

If either check fails, skip every Backlog step — do not error, do not prompt.

## Install and init (agent-driven — never via `create-lean-agent-kit`)

Offer during `leanagentkit-bootstrap` or when the user asks for a visual board.
The scaffolder does **not** install Backlog.md.

```bash
# Install (pick one)
npm i -g backlog.md
# bun add -g backlog.md
# brew install backlog-md

# Initialize in the project root
backlog init "<project-name>"

# No Git repo? Use filesystem-only mode
backlog init "<project-name>" --no-git
```

During `backlog init`, when asked about AI integration:

- Choose **Skip** or **CLI instructions** — do **not** let Backlog overwrite
  `AGENTS.md`. The kit owns `AGENTS.md §7` via `leanagentkit-match-stack`.
- **Never run** `backlog agents --update-instructions` — it conflicts with kit
  memory protocol and is preserved on `--upgrade`.

After init, re-run `leanagentkit-match-stack` (or complete bootstrap Step 3) so
`leanagentkit-backlog` is advertised in `AGENTS.md §7`.

## Source of truth

| Layer        | Owns                                                | Location              |
| ------------ | --------------------------------------------------- | --------------------- |
| Spec         | Problem, goal, scope, acceptance criteria, approach | `docs/specs/NNN-*.md` |
| Backlog card | Status, Kanban column, visual AC checkboxes, notes  | `backlog/tasks/*.md`  |

Link them:

- On card create: `--ref docs/specs/NNN-<feature>.md`
- On spec: frontmatter line `> Backlog: <task-id>` (e.g. `BACK-12` or `task-12`)

Mirror acceptance criteria into the card **once** at creation (`--ac` per criterion).
After that, the spec is master — sync checkboxes when criteria are met, but do not
duplicate scope edits in both places.

## Status mapping

| Kit event                             | Backlog card status | Condition                                  |
| ------------------------------------- | ------------------- | ------------------------------------------ |
| `new-spec` creates card               | `To Do`             | Always when active                         |
| `implement-spec` starts               | `In Progress`       | Spec has linked card                       |
| `implement-spec` checks AC            | `--check-ac N`      | As each spec AC is met                     |
| Spec `Status: done`                   | `Done`              | All AC checked + `leanagentkit-check` PASS |
| `end-session` / finalize              | `Done`              | **Only** when spec is `Status: done`       |
| `end-session` / finalize (incomplete) | sync notes only     | Never auto-complete                        |

**No false Done:** ending a session does **not** complete a card. Move to `Done`
only when the spec is genuinely finished.

## Lifecycle commands (always `--plain` for agent parsing)

### Start session — surface open work

```bash
backlog task list -s "To Do" --plain
backlog task list -s "In Progress" --plain
```

Cross-reference with `docs/memory/ACTIVE_CONTEXT.md` and any linked spec.

### New spec — create card

After writing `docs/specs/NNN-<feature>.md`:

```bash
backlog task create "<feature name>" \
  -d "<one-line goal from spec>" \
  --ac "<acceptance criterion 1>" \
  --ac "<acceptance criterion 2>" \
  -s "To Do" \
  --ref "docs/specs/NNN-<feature>.md" \
  --plain
```

Record the returned task id in the spec frontmatter:

```markdown
> Backlog: <task-id> · Status: draft | active | done | abandoned · Updated: <!-- YYYY-MM-DD -->
```

### Implement spec — move to In Progress

```bash
backlog task edit <task-id> -s "In Progress" --plain
```

When a spec acceptance criterion is checked (`- [x]`), check the matching Backlog AC:

```bash
backlog task edit <task-id> --check-ac <n> --plain
```

AC index `n` matches creation order (1-based).

### End session — complete or sync only

**If** the linked spec is `Status: done`:

```bash
backlog task edit <task-id> -s "Done" --append-final-summary "<brief completion note>" --plain
```

**Else** (work continues):

```bash
backlog task edit <task-id> --append-notes "<session progress from ACTIVE_CONTEXT>" --plain
```

Do **not** change status to `Done` unless the spec is done.

## Human visualization

For the user (not required for agent workflow):

```bash
backlog board          # terminal Kanban
backlog browser        # web UI (default port 6420)
backlog overview       # project statistics
```

## Optional MCP (Cursor / Claude Code only)

CLI is the portable baseline. MCP is optional for hosts that support it:

```bash
# Claude Code
claude mcp add backlog --scope user -- backlog mcp start

# Cursor — add to .cursor/mcp.json (merge, do not clobber)
# { "mcpServers": { "backlog": { "command": "backlog", "args": ["mcp", "start"] } } }
```

When MCP is available, agents may use Backlog MCP tools instead of CLI for the
same operations. Still follow the status mapping and no-false-Done rules above.

## Rules

- Capability-gate every step — silent no-op when Backlog is not active.
- Spec owns content; card owns status visualization.
- Never run `backlog agents --update-instructions`.
- Never move a card to `Done` on session end alone.
- Use `--plain` on all CLI commands agents parse.
- Quote task text with single quotes when it contains backticks (see Backlog CLI docs).
