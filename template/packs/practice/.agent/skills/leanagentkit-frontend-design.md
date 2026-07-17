---
name: leanagentkit-frontend-design
description: Distinctive, intentional UI when building or reshaping visual interfaces. Use for new pages, landing surfaces, design systems, or when output risks looking like templated AI defaults.
invocation: auto
---

# Skill: leanagentkit-frontend-design

**Goal:** Ship visual work with a subject-specific point of view — palette,
typography, layout, and one justified aesthetic risk — not a generic template.

**Does not:** replace stack docs (Tailwind, shadcn, framework playbooks), measure
performance (`leanagentkit-performance`), harden security
(`leanagentkit-security`), or invent APIs (`leanagentkit-api-design`).

**Checklist:** `.agent/skills/references/frontend-design-checklist.md`

## When to use

- New page, landing surface, marketing hero, or product shell UI
- Reshaping an existing interface's visual identity
- "Make it look good" / "design the UI" / "this looks templated / AI-generated"
- Establishing or extending theme tokens (color, type, spacing)

**When NOT to use:** Pure logic/API work with no visual surface; stack-API
questions (defer to `leanagentkit-match-stack` playbooks / external skills).

## Prerequisites

At task start (memory protocol — `AGENTS.md` §6):

1. `docs/memory/ACTIVE_CONTEXT.md` — prior design notes, active feature
2. `docs/CODEBASE_MAP.md` — theme/CSS/component locations
3. `AGENTS.md` §4 — project conventions
4. Active `docs/specs/<feature>.md` when the UI implements a feature
5. Stack playbooks that apply (e.g. `.agent/stacks/tailwind.md`,
   `shadcn-svelte.md`, `react.md`) — **existing tokens win** over a new parallel system

## How to Run

> Read `.agent/skills/leanagentkit-frontend-design.md` and follow it.

## Quick Reference

| Need | Go to |
|------|--------|
| Anti-default looks, copy, quality floor | `references/frontend-design-checklist.md` |
| Bundle / CWV / image CLS | `leanagentkit-performance` + `references/performance-checklist.md` |
| Component recipes (shadcn, etc.) | Stack skill via `AGENTS.md` §7 / match-stack |
| Fuzzy product brief before UI | `leanagentkit-grill` then this skill |
| Guardrail after code lands | `leanagentkit-check` |

## Procedure

### 1. Ground the subject

Name **subject**, **audience**, and the surface's **single job**. Prefer evidence
from the spec, `ACTIVE_CONTEXT`, and real product content over placeholder lorem.
If memory holds prior aesthetic choices, reuse them unless the brief asks for a
reset.

**Done when:** subject / audience / job are stated (to the user if ambiguous).

### 2. Draft a design plan (before code)

Produce a compact token plan:

| Axis | Required |
|------|----------|
| Color | 4–6 named hex roles |
| Type | Display + body (+ utility if needed); scale intent |
| Layout | One-sentence concept + ASCII first-viewport wireframe |
| Signature | One memorable element that embodies the brief |

Load `references/frontend-design-checklist.md` and reject plans that land on an
**anti-default** look when the brief left that axis free. Brief wording always
wins when it pins a direction.

**Done when:** plan written; any default-looking axis revised with a one-line why.

### 3. Critique uniqueness

Ask: would the same plan appear for an unrelated product? If yes, change the weak
axis. Spend boldness in **one** place (the signature); keep the rest disciplined.

Prefer planning in thinking; show the user the plan when confidence is high, or
when the brief is ambiguous and a choice needs consent.

**Done when:** uniqueness check passed (or brief-forced defaults acknowledged).

### 4. Implement from the plan

- Derive every color/type decision from the plan; map onto existing `@theme` /
  CSS variables / design-system files — do not fork a second token source.
- Hero is a thesis: open with the most characteristic content (headline, image,
  live demo, interaction) — not a stats strip + gradient unless that *is* the brief.
- Structure encodes information (numbered markers only when order is real).
- Motion: one orchestrated moment beats scattered effects; respect
  `prefers-reduced-motion`.
- Copy: treat words as design material — see checklist.
- Prefer stack utilities over competing CSS specificities.

**Done when:** UI matches the plan's tokens and signature; no orphan hex/font choices.

### 5. Self-critique and quality floor

- Screenshot or visual check if the host supports it.
- Remove one accessory that does not serve the brief.
- Run the quality-floor items in the checklist.
- Run `leanagentkit-check` on changed files when code landed.

**Done when:** checklist floor checked; check skill clean (or findings listed).

### 6. Persist direction

If this establishes or changes project visual identity, append a short note to
`docs/memory/ACTIVE_CONTEXT.md` (palette/type/signature). For lasting system
choices, seed or update an ADR via `leanagentkit-seed-adrs`.

**Done when:** context (and ADR if warranted) updated, or explicitly N/A for a
one-off surface.

## Pitfalls

- Skipping the plan and coding straight into Inter + purple gradient
- Inventing tokens that ignore Tailwind `@theme` / shadcn theme already in repo
- Hero clutter (stats, chips, floating badges) that dilutes the thesis
- Motion noise that reads as AI-default
- Clever copy that obscures what the control does
- Treating this skill as a substitute for framework or Tailwind docs

## Verification

- [ ] Subject, audience, and page job stated
- [ ] Design plan (color / type / layout / signature) exists and was critiqued
- [ ] Implementation derives from plan and project token files
- [ ] Anti-default checklist consulted when the brief left axes free
- [ ] Quality floor satisfied; `leanagentkit-check` run if files changed
- [ ] Visual direction noted in `ACTIVE_CONTEXT` when identity changed

## Attribution

Design principles and process adapted from
[anthropics/skills `frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md).
Procedure, memory hooks, and stack integration are Lean Agent Kit.
