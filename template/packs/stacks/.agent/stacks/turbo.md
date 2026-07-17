# Stack Playbook: Turborepo

> Applied when Turborepo is detected. Thin layer: conventions + when to defer to
> the `turborepo` skill (vendored from `vercel/turborepo/skills/turborepo`). Don't
> duplicate Turborepo docs here.

## Install note
Turborepo's skill lives inside the framework monorepo under `skills/turborepo/`
next to a root `AGENTS.md`. There's no published `npx skills add` — copy the folder
in (e.g. `npx degit vercel/turborepo/skills/turborepo .agent/skills/vendor/turborepo`)
and point your agent at it. Pin to a release tag; these track Turborepo versions.

## Defer to the skill for
- `turbo.json` task config: `dependsOn` (`^task` vs `task`), `outputs`, `inputs`, `env`, `cache`, `persistent`.
- Caching: local + remote cache, debugging cache misses (`--summarize`, `--dry`).
- Filtering: `--filter` syntax and `--affected` for running only changed packages.
- Environment variables: strict vs loose mode, `globalEnv` / `passThroughEnv`.
- CI setup (GitHub Actions, Vercel, `turbo-ignore`), package structure, and boundaries.

## Conventions to record in AGENTS.md
- Prefer package tasks over Root Tasks (`//#task`); root `package.json` only
  delegates via `turbo run <task>` — never put real task logic there.
- Always write `turbo run <task>` (not the `turbo <task>` shorthand) in
  `package.json` scripts and CI; reserve the shorthand for one-off terminal use.
- Cacheable file-producing tasks must declare `outputs`.
- Use `dependsOn: ["^build"]` for dependency ordering and declare `workspace:*`
  deps instead of `prebuild` hacks that build dependencies manually.
- Keep `globalDependencies` / `globalEnv` narrow; avoid a root `.env`.

## CODEBASE_MAP hints to capture
- `turbo.json` (+ per-package `turbo.json` with `extends: ["//"]`) → the task
  graph. Mark root `turbo.json` as source of truth for the pipeline.
- Workspace config (`pnpm-workspace.yaml` or `workspaces` in `package.json`) →
  the package list.
- `apps/` (deployables) vs `packages/` (shared libraries) layout; note each
  internal package and its build/dev/test scripts.

## AGENTS.md snippet to add
> For Turborepo (`turbo.json` tasks, caching, `--filter`/`--affected`, CI), use
> the vendored `turborepo` skill. Prefer package tasks over root tasks and always
> write `turbo run` in scripts and CI.
