# Lean Agent Kit Documentation

VitePress site for [renatoxm.github.io/leanagentkit](https://renatoxm.github.io/leanagentkit/).

User-facing install/upgrade commands: [getting-started.md](./getting-started.md).
Always document with `@latest`.

## Pages

| Page | Source |
|------|--------|
| Guide | Generated from `template/core/LEAN_AGENT_KIT_GUIDE.md` |
| Stacks | Generated from `template/packs/stacks/.agent/stacks/registry.md` |
| Packs / Migration | Hand-authored `packs.md`, `migration-1.0.md` |
| Pack deep-dives | `backlog.md`, `trevor.md`, `caveman.md`, `imaginary.md`, … |

## Running locally

```bash
cd docs
pnpm install
pnpm run docs:dev
pnpm run docs:build    # runs sync first, then builds
```

## Deployment

Push to main → GitHub Actions Pages workflow → https://renatoxm.github.io/leanagentkit/
