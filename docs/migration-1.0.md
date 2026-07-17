# Migration to 1.0

Lean Agent Kit **1.0** changes the default from “everything ships dormant” to a
**lean core** plus **opt-in packs**.

## What changed

| Before (0.x) | After (1.0) |
|--------------|-------------|
| Full skill set copied on scaffold | Core only by default |
| Optional features dormant on disk | Packs installed via `--enable-pack` / `--with` |
| “Do not glob the repo” | Map-first; narrow search allowed |
| One heavy daily loop | Workflow sizes: trivial / normal / substantial |
| Upgrade never deletes | Still additive; new `--prune-to-core` archives pack files |

## Recommended path

1. **Upgrade** (preserves memory, `AGENTS.md`, registries, user configs):

   ```bash
   npx create-lean-agent-kit@latest . --upgrade
   ```

2. Choose footprint:

   - **Keep everything** — stop here. Stamp may list inferred packs from on-disk skills.
   - **Go lean** — prune, then re-enable what you need:

   ```bash
   npx create-lean-agent-kit@latest . --prune-to-core
   npx create-lean-agent-kit@latest . --enable-pack spec,stacks
   ```

   Prune archives pack overlays (including PROGRESS/SCRATCH if the spec pack is
   removed) under `.leanagentkit-backup/`. Core `ACTIVE_CONTEXT` is preserved.
   User-authored `docs/specs/<feature>.md` files are left in place.

3. Merge **1.0 protocol** into `AGENTS.md` §6 if upgrade preserved your old file
   (it does). Keep §1–5; adopt map-first + workflow sizes from the core template.
   **Clear §7** lines for packs you no longer have (prune does not rewrite AGENTS.md).

4. Re-run `leanagentkit-wire-agent` (Cursor / Claude).

Or ask the agent: **Read `.agent/skills/leanagentkit-migrate-1.md` and follow it.**

## Prune details

- Moves pack-owned files to `.leanagentkit-backup/<timestamp>-prune/`.
- Refreshes core files (respecting preserve rules).
- Sets `installedPacks` to `[]` or to `--keep-pack` list.
- Does not delete your project code or user memory content that is not pack-owned.

## New installs

```bash
npx create-lean-agent-kit@latest .
# optional:
npx create-lean-agent-kit@latest . --with spec,stacks
```
