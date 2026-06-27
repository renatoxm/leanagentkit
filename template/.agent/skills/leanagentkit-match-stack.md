---
name: leanagentkit-match-stack
description: Detect project technologies and install matching external agent skills.
---

# Skill: leanagentkit-match-stack

**Goal:** Detect the project's technologies and wire up the matching external
agent skills — installing only what's confirmed, with correct per-skill methods.

**Reads:** `.agent/stacks/registry.md` (the source of truth) + the codebase.
**Writes:** appends to `AGENTS.md`, updates `docs/CODEBASE_MAP.md`, may create
config (`.mcp.json` entries), and runs install commands when approved.

## Procedure

1. **Detect.** For each row in `registry.md`, check its **Detect** condition
   against the repo (manifests, imports, config files, file extensions). Collect
   the rows that match. Note the detected version where it matters (e.g. Tailwind v4).

2. **Confirm.** Show the user the matched stacks as a checklist:
   `Detected: Cloudflare, Hono, Tailwind v4. Install skills for these? [per-item yes/no]`
   Respect their Step-0 choice (install / list-only / skip). Never install silently.

3. **Install** (for each approved match), using the row's **Install** method.
   Skip this step when **Type** is `playbook` (no external skill — apply playbook only).
   - If Cursor is in Step-0 agent targets (or `.cursor/` exists from `leanagentkit-wire-agent`),
     prefer for copy-in skills:
     ```bash
     npx skills add <repo> -a cursor --copy
     ```
     (`--copy` avoids symlink discovery bugs in Cursor.)
   - Else if Claude Code is in Step-0 agent targets (or `.claude/` exists from
     `leanagentkit-wire-agent`), prefer for copy-in skills:
     ```bash
     npx skills add <repo> -a claude-code
     ```
   - Otherwise prefer the portable `npx skills add <repo>` for copy-in skills.
   - For MCP-type rows (e.g. Svelte), add the MCP server to the agent config
     instead of copying files — they are NOT skill folders. When Cursor is a
     target, write `.cursor/mcp.json` with the `mcpServers` entry (merge with
     existing config; do not clobber unrelated servers). When Claude Code is a
     target, write the same entry to root `.mcp.json` (merge; do not clobber).
   - If the host agent has a native plugin marketplace and the user prefers it,
     use the noted alternative command.
   - If you cannot run commands, OUTPUT the exact commands for the user to run.

4. **Post-install (critical).** Execute or surface each row's **Post-install**:
   - Hono → ensure `@hono/cli` devDependency.
   - Tailwind → run the docs-snapshot sync script (`--accept-docs-license`);
     the skill is not usable without it.
   - Verify MCP rows: confirm the server's tools are listed by the agent.

5. **Integrate the playbook.** For each matched stack, open
   `.agent/stacks/<name>.md` and:
   - append its "AGENTS.md snippet" to a `## Stack skills` section in `AGENTS.md`
     (create the section once; don't duplicate snippets on re-run),
   - apply its "CODEBASE_MAP hints" when (re)building the map,
   - fold its key conventions into AGENTS.md section 4.

6. **Report.** List: detected stacks, install status per stack, any pending
   REQUIRED post-install steps, and which playbooks were applied.

7. **Detect practice skills.** Read `.agent/practice-skills/registry.md`.
   For each **conditional** row, check its **Detect** condition. These skills
   ship dormant (`invocation: conditional` → explicit-invoke wrappers), so they
   only become active guidance once advertised here. For each row whose Detect
   matches, add a line to the `AGENTS.md` §7 "Practice skills (guardrails)"
   subsection — skill name + when to use. Omit rows that don't match (don't
   advertise `leanagentkit-ci-cd` on a repo with no CI config). Always-on
   guardrails (`invocation: auto`) need no detection — they auto-load when wired
   and aren't listed here. Idempotent: rebuild the subsection on re-run, don't
   duplicate rows.

## Rules
- The registry is authoritative — don't hardcode install commands here.
- Distinguish `skill` (copy-in) from `mcp` (server) rows; they install differently.
- Idempotent: re-running updates, never duplicates snippets or re-installs needlessly.
- If a detected tech has no registry row, note it and suggest adding a row.
