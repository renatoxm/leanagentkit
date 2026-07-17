# Performance Checklist

Quick reference for application performance. Use alongside
`leanagentkit-performance`.

## Core Web Vitals targets

| Metric | Good | Needs work | Poor |
|--------|------|------------|------|
| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## Measure first

- [ ] Baseline exists (before/after numbers, not guesses)
- [ ] Bottleneck identified from data, not assumption
- [ ] Field data (RUM) and lab data (Lighthouse) distinguished

## Frontend

- [ ] Images: modern formats, dimensions set, lazy-load below fold
- [ ] LCP image: `fetchpriority="high"`, not lazy-loaded
- [ ] Initial JS bundle < 200KB gzipped
- [ ] Code splitting for routes and heavy features
- [ ] No blocking scripts in `<head>`
- [ ] Fonts: limited count, preloaded, `font-display: swap`
- [ ] Static assets cached with content hashing

## Backend

- [ ] No N+1 query patterns
- [ ] List endpoints paginated
- [ ] Queries have appropriate indexes
- [ ] API p95 < 200ms (or project SLA)
- [ ] Response compression enabled
- [ ] Caching where reads dominate

## Anti-patterns

| Pattern | Fix |
|---------|-----|
| N+1 queries | Joins, includes, batch loading |
| Unbounded fetches | Pagination, LIMIT |
| Missing indexes | Index filtered/sorted columns |
| Large bundles | Code split, audit dependencies |
| Unoptimized images | WebP/AVIF, responsive sizes |
| Blocking main thread | Chunk long tasks, offload heavy work |

## Performance budget (typical web app)

```
JS bundle:     < 200KB gzipped (initial)
CSS:           < 50KB gzipped
API p95:       < 200ms
Lighthouse:    ≥ 90 (when applicable)
```
