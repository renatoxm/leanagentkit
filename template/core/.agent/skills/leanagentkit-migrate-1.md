---
name: leanagentkit-migrate-1
description: Migrate a 0.x Lean Agent Kit install to 1.0 — upgrade, optional prune-to-core, re-enable packs.
---

# Skill: leanagentkit-migrate-1

**Goal:** Move an existing 0.x project to Lean Agent Kit 1.0 safely.

## Background

1.0 defaults to a **lean core**. Optional features live in **packs**. Upgrading is
**additive** (old pack files are not deleted). To reclaim disk/context footprint,
prune, then re-enable only what you need.

## Procedure

1. **Confirm install.** Read `.agent/.leanagentkit-version` (or detect bootstrap skill).
2. **Upgrade first** (preserves memory, AGENTS.md, registries, user `.leanagentkit/*.yml`):

   ```bash
   npx create-lean-agent-kit@latest . --upgrade
   ```

3. **Explain options** (interactive; recommend B for most users who want lean):

   - **A — Keep everything.** Stop after upgrade. Stamp may list inferred packs.
   - **B — Prune to core, then re-enable.** Reclaim lean footprint.
   - **C — Prune but keep some packs.** Use `--keep-pack`.

4. If **B**:

   ```bash
   npx create-lean-agent-kit@latest . --prune-to-core
   ```

   Then ask which packs to keep and run `--enable-pack` (or `leanagentkit-enable-pack`).

5. If **C**:

   ```bash
   npx create-lean-agent-kit@latest . --prune-to-core --keep-pack spec,stacks
   ```

6. Show backup path under `.leanagentkit-backup/*-prune/` if prune ran.
   Warn if PROGRESS/SCRATCH/reminders were moved — those are recoverable from backup.
   Pack user configs (`.leanagentkit/*.yml` for removed packs) are archived the same
   way; `--keep-pack` leaves those packs' YAML in place. `--upgrade` does not
   touch user YAML.
   User-authored `docs/specs/<feature>.md` files are left in place.
7. Rewrite `AGENTS.md` §6–§7 to match current protocol if still on older wording
   (upgrade refreshes kit-owned `AGENTS.md` only when not preserved — **AGENTS.md
   is preserved on upgrade and prune**). Merge protocol sections into the user's
   AGENTS.md carefully: keep §1–5 content; replace §6 memory protocol with the
   ambient / map-first / LEARNINGS / workflow-sizes text from the core template;
   **clear stale §7** practice/token/pack lines that reference packs no longer installed.
   Ensure `docs/memory/LEARNINGS.md` exists (upgrade adds it when missing). Merge
   ambient + Finalize rules into preserved `AGENTS.md` §6 (upgrade does not rewrite
   AGENTS.md).
8. Re-run `leanagentkit-wire-agent` for Cursor/Claude — refresh LAK hooks so ambient /
   LEARNINGS prompts replace older ceremony nudges (`--upgrade` does not touch
   `.cursor/hooks.json`).
9. Summarize: version, packs kept, prune backup path, next step (follow `AGENTS.md`
   §6 ambient start — optional `leanagentkit-start-session` for pack hooks; finalize
   via `end-session` when packs/PROGRESS apply).

## Do not

- Do not run `--force` scaffold as a migration path.
- Do not delete `.leanagentkit-backup/` for the user.
- Do not prune without explicit user choice (B or C).
