---
name: leanagentkit-caveman
description: Terse agent replies. Optional; adds per-turn overhead.
version: 1.0.0
invocation: conditional
metadata:
  tags: [TokenEfficiency, Optional]
  source: JuliusBrussee/caveman (MIT) — adapted for Lean Agent Kit
  upstream: https://github.com/JuliusBrussee/caveman
---

# Skill: leanagentkit-caveman

**Goal:** Cut output tokens by speaking terse while keeping full technical accuracy.
Does not compress memory files or project artifacts — only how the agent replies.

**Not for:** commit messages (`leanagentkit-caveman-commit`), PR comments
(`leanagentkit-caveman-review`), or compressing `docs/memory/*` / specs.

## When to Use

- User says "talk like caveman", "caveman mode", "be brief", "less tokens"
- `.leanagentkit/caveman.yml` has `enabled: true` and `terse_communication: true`
- Long explanatory sessions where verbose replies dominate token cost

**Off:** "stop caveman" or "normal mode".

## Prerequisites

For **AGENTS.md §7 routing** (advertised after bootstrap / match-stack):

- `.leanagentkit/caveman.yml` exists with `enabled: true`
- `terse_communication: true` (off by default — adds skill overhead each turn)

**Explicit invoke always works** — if the user asks for caveman mode by name, follow
this skill even when the config is off or missing.

## Procedure

1. Respond terse. All technical substance stays. Only fluff goes.
2. Default intensity: **full**. User may switch: `lite`, `full`, or `ultra`.
3. Stay active every response until user says "stop caveman" or "normal mode".

### Rules

Drop: articles (a/an/the), filler (just/really/basically), pleasantries (sure/certainly),
hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for").
No tool-call narration, no decorative tables/emoji, no long raw error logs unless asked —
quote the shortest decisive line.

Preserve the user's dominant language — compress style, not language.

No self-reference. Never announce the mode. Pattern: `[thing] [action] [reason]. [next step].`

Technical terms, code, API names, CLI commands, and exact error strings stay verbatim.
Code blocks unchanged.

### Intensity

| Level | What changes |
|-------|--------------|
| **lite** | No filler/hedging. Keep articles + full sentences. Professional but tight |
| **full** | Drop articles, fragments OK, short synonyms. Classic terse mode |
| **ultra** | Strip conjunctions when cause-then-effect stays clear. One word when enough |

### Auto-Clarity — drop terse mode when

- Security warnings or irreversible action confirmations
- Multi-step sequences where fragments risk misread
- User asks to clarify or repeats the question
- Writing `docs/memory/HANDOFF.md` — use clear prose for cross-session handoffs
  (see `leanagentkit-handoff`)

Resume terse after the clear part is done.

### LAK boundaries

- **Memory files** (`ACTIVE_CONTEXT.md`, `PROGRESS.md`, specs): write normal readable prose
- **Code, commits, PR bodies in artifacts:** write normal
- **Agent chat replies:** terse

## Pitfalls

- Skill adds ~1–1.5k input tokens per turn when active — net-negative on already-terse
  coding Q&A. See [Caveman honest numbers](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md).
- Do not compress kit memory files — LAK navigation depends on human-readable maps.

## Verification

User sees shorter replies with unchanged code/commands/errors. Say "normal mode" — replies
return to standard verbosity.

## Attribution

Adapted from [Caveman](https://github.com/JuliusBrussee/caveman) (MIT) by Julius Brussee.
