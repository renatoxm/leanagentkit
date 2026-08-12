# Migration to 1.0

<div class="page-hero">
<div class="page-hero-text">

Lean Agent Kit **1.0** changes the default from “everything ships dormant” to a
**lean core** plus **opt-in packs**.

</div>
<div class="page-hero-image">
<img src="/assets/images/TrevorLeanAgentKit.png" alt="Trevor — Lean Agent Kit concierge" />
</div>
</div>

## What changed

| Before (0.x)                      | After (1.0)                                               |
| --------------------------------- | --------------------------------------------------------- |
| Full skill set copied on scaffold | Core only by default                                      |
| Optional features dormant on disk | Packs installed via `--enable-pack` / `--with`            |
| “Do not glob the repo”            | Map-first; narrow search allowed                          |
| One heavy daily loop              | Workflow sizes: trivial / normal / substantial            |
| Upgrade never deletes             | Still additive; new `--prune-to-core` archives pack files |

## Recommended path

1. **Upgrade** (preserves memory, `AGENTS.md`, registries, user configs):

::: code-group

```bash [npm]
npx create-lean-agent-kit@latest . --upgrade
```

```bash [pnpm]
pnpm dlx create-lean-agent-kit@latest . --upgrade
```

```bash [yarn]
yarn dlx create-lean-agent-kit@latest . --upgrade
```

```bash [bun]
bunx create-lean-agent-kit@latest . --upgrade
```

:::

2. Choose footprint:

   - **Keep everything** — stop here. Stamp may list inferred packs from on-disk skills.
   - **Go lean** — prune, then re-enable what you need:

::: code-group

```bash [npm]
npx create-lean-agent-kit@latest . --prune-to-core
npx create-lean-agent-kit@latest . --enable-pack spec,stacks
```

```bash [pnpm]
pnpm dlx create-lean-agent-kit@latest . --prune-to-core
pnpm dlx create-lean-agent-kit@latest . --enable-pack spec,stacks
```

```bash [yarn]
yarn dlx create-lean-agent-kit@latest . --prune-to-core
yarn dlx create-lean-agent-kit@latest . --enable-pack spec,stacks
```

```bash [bun]
bunx create-lean-agent-kit@latest . --prune-to-core
bunx create-lean-agent-kit@latest . --enable-pack spec,stacks
```

:::

Prune archives pack overlays (including PROGRESS/SCRATCH if the spec pack is
removed) under `.leanagentkit-backup/`. Core `ACTIVE_CONTEXT` and `LEARNINGS`
are preserved.
User-authored `docs/specs/<feature>.md` files are left in place.

3. Merge **current protocol** into `AGENTS.md` §6 if upgrade preserved your old file
   (it does). Keep §1–5; adopt ambient memory + LEARNINGS + **Finalize** rules from the
   core template. Upgrade installs `docs/memory/LEARNINGS.md` when missing — it does
   **not** rewrite your `AGENTS.md`, so old ceremony-only §6 will coexist with the new
   LEARNINGS file until you merge. **Clear §7** lines for packs you no longer have
   (prune does not rewrite AGENTS.md).

4. Re-run `leanagentkit-wire-agent` (Cursor / Claude). `--upgrade` does **not** refresh
   `.cursor/hooks.json` or `CLAUDE.md`; re-wire (and opt in to refresh LAK hook entries)
   so ambient / LEARNINGS session prompts replace older start/end ceremony nudges.

Or ask the agent: **Read `.agent/skills/leanagentkit-migrate-1.md` and follow it.**

## Prune details

- Moves pack-owned files to `.leanagentkit-backup/<timestamp>-prune/`.
- Refreshes core files (respecting preserve rules).
- Sets `installedPacks` to `[]` or to `--keep-pack` list.
- Does not delete your project code or user memory content that is not pack-owned.

## New installs

::: code-group

```bash [npm]
npx create-lean-agent-kit@latest .
# optional:
npx create-lean-agent-kit@latest . --with spec,stacks
```

```bash [pnpm]
pnpm dlx create-lean-agent-kit@latest .
# optional:
pnpm dlx create-lean-agent-kit@latest . --with spec,stacks
```

```bash [yarn]
yarn dlx create-lean-agent-kit@latest .
# optional:
yarn dlx create-lean-agent-kit@latest . --with spec,stacks
```

```bash [bun]
bunx create-lean-agent-kit@latest .
# optional:
bunx create-lean-agent-kit@latest . --with spec,stacks
```

:::
