# Lean Agent Kit Documentation Github Page

Developed with [VitePress](https://vitepress.dev/)

## Running locally

```bash
cd docs
pnpm install
pnpm run docs:dev      # http://localhost:5173/leanagentkit/
pnpm run docs:build    # runs sync first, then builds
```

## Deployment

1. Push to main
2. In the repo: Settings → Pages → Build and deployment → Source: GitHub Actions
3. After the workflow runs, the site will be at https://renatoxm.github.io/leanagentkit/

The guide and stacks pages are auto-synced from template/LEAN_AGENT_KIT_GUIDE.md and the README stack table on every dev/build — no manual duplication.
