---
name: pre-release
description: Pre-release sanity — check, docs, and optional backlog sync
---

# Pre-release workflow

Run via Trevor: "Run workflow pre-release"

## Steps

1. [ ] Read active spec from `ACTIVE_CONTEXT` if present
2. [ ] Run `leanagentkit-check` on changed files this release
3. [ ] Confirm spec acceptance criteria are checked; if Backlog linked, verify card ACs match
4. [ ] Ask user: ready to mark spec `Status: done` and move Backlog card to Done? (only if check PASS and all AC met — follow `leanagentkit-backlog` rules)
5. [ ] Offer `leanagentkit-end-session` to persist state
