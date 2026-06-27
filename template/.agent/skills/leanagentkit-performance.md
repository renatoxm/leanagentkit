---
name: leanagentkit-performance
description: Performance optimization with measurement-first discipline. Use when performance requirements exist, regressions are suspected, or Core Web Vitals need improvement.
invocation: auto
---

# Skill: leanagentkit-performance

**Goal:** Measure before optimizing. Profile first, fix the actual bottleneck,
measure again. Optimize only what data proves matters.

**Output format:** For audit-style reports, read
`.agent/skills/frame/findings-report.md`. Never fabricate metrics — label
static-analysis findings as **potential impact**.

**Checklist:** `.agent/skills/references/performance-checklist.md`

## When to use

- Performance requirements in spec (SLAs, load budgets, CWV targets)
- Users or monitoring report slowness
- Suspected regression after a change
- Large datasets or high-traffic features

**When NOT to use:** No evidence of a problem — premature optimization adds
complexity without gain.

## Core Web Vitals targets

| Metric | Good | Needs work | Poor |
|--------|------|------------|------|
| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## Workflow

```
1. MEASURE  → baseline with real data
2. IDENTIFY → actual bottleneck (not assumed)
3. FIX      → address specific bottleneck
4. VERIFY   → measure again
5. GUARD    → monitoring or budget test to prevent regression
```

Use both lab (Lighthouse, profiler) and field (RUM/web-vitals) where applicable.
Field = what users experience; lab = reproducible diagnosis.

## Where to start

```
Slow first load     → bundle size, TTFB, render-blocking resources
Sluggish interaction → main-thread long tasks, re-renders, input lag
After navigation    → API waterfalls, client render cost
Backend/API         → N+1 queries, missing indexes, connection pool
```

## Common anti-patterns

| Pattern | Fix |
|---------|-----|
| N+1 queries | Joins, includes, batch loading |
| Unbounded fetches | Pagination, LIMIT |
| Missing image dimensions | width/height, lazy below fold, priority on LCP |
| Large initial bundle | Code split, dynamic import for heavy features |
| Unnecessary re-renders | Stable references; memo only when profiled |
| Missing caching | HTTP cache headers, in-memory for hot reads |
| Blocking main thread | Chunk long tasks; offload heavy computation |

## Performance budget (typical web app)

```
JS bundle:   < 200KB gzipped (initial)
CSS:         < 50KB gzipped
API p95:     < 200ms
Lighthouse:  ≥ 90 (when applicable)
```

Enforce in CI when project configures bundle-size or Lighthouse checks.

## Metric honesty

Without tool artifacts (Lighthouse JSON, CrUX, traces):
- Report source-level findings only
- Mark scorecard as `not measured`
- Label every finding `potential impact`

With artifacts: cite source (Field/Lab/Trace) per value.

Match recommendations to detected stack — don't suggest framework patterns the
project doesn't use.

## Red flags

- Optimization without profiling data
- N+1 in new data fetching
- List endpoints without pagination
- Bundle growing without review
- Memo/cache applied everywhere without measurement

## Verification

- [ ] Before/after measurements exist (specific numbers)
- [ ] Bottleneck identified and addressed
- [ ] CWV within Good thresholds (when measured)
- [ ] No N+1 in new fetching code
- [ ] Existing tests still pass
- [ ] Performance budget passes CI (if configured)
