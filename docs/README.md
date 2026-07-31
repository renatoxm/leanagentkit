# Lean Agent Kit Documentation

VitePress site for [renatoxm.github.io/leanagentkit](https://renatoxm.github.io/leanagentkit/).

User-facing install/upgrade commands: [getting-started.md](./getting-started.md).
Always document with `@latest`.

## Pages

| Page              | Source                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| Guide             | Generated from `template/core/LEAN_AGENT_KIT_GUIDE.md` (ambient memory + LEARNINGS)                           |
| Stacks            | Intro from `docs/.partials/stacks-intro.md` + registry from `template/packs/stacks/.agent/stacks/registry.md` |
| Packs / Migration | Hand-authored `packs.md`, `migration-1.0.md`                                                                  |
| Pack deep-dives   | `spec.md`, `practice.md`, `backlog.md`, `trevor.md`, `caveman.md`, `imaginary.md`, …                          |

## Running locally

::: code-group

```bash [npm]
cd docs
npm install
npm run docs:dev
npm run docs:build    # runs sync first, then builds
```

```bash [pnpm]
cd docs
pnpm install
pnpm run docs:dev
pnpm run docs:build    # runs sync first, then builds
```

```bash [yarn]
cd docs
yarn install
yarn docs:dev
yarn docs:build    # runs sync first, then builds
```

```bash [bun]
cd docs
bun install
bun run docs:dev
bun run docs:build    # runs sync first, then builds
```

:::

## Deployment

Push to main → GitHub Actions Pages workflow → https://renatoxm.github.io/leanagentkit/
