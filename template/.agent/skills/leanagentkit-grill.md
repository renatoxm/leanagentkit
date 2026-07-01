---
name: leanagentkit-grill
description: Relentlessly interview the user to align on a plan or design before coding. Use before starting a feature or non-trivial change, when requirements are fuzzy, or to stress-test an approach.
invocation: auto
---

# Skill: leanagentkit-grill

**Goal:** Close the gap between what the user wants and what the agent is about
to build — *before* any code is written. Interview relentlessly until you reach a
shared understanding of the change.

## When to use

- Before starting a feature or any non-trivial change.
- When the request is fuzzy, broad, or has meaningful trade-offs.
- To stress-test an approach you (or the user) already have in mind.

**Not for:** Routine or obvious changes that need no alignment. Convention
enforcement against `AGENTS.md` — use `leanagentkit-check`. Multi-axis code
review — use `leanagentkit-review`.

## Procedure

1. **Prime cheaply.** Read `docs/memory/ACTIVE_CONTEXT.md` and
   `docs/CODEBASE_MAP.md` first so questions are grounded in the real repo.
2. **Interview one question at a time.** Ask a single question, give your
   *recommended* answer, then wait for the user's response before continuing.
   Use the host's interactive multiple-choice UI when available (see AGENTS.md
   §6 — Asking the user); fall back to inline text only when unsupported.
   Asking multiple questions at once is bewildering.
3. **Walk the design tree.** Cover every branch of the change, resolving
   dependencies between decisions one-by-one — early answers narrow later ones.
4. **Explore instead of asking.** If a question can be answered from the repo,
   open the named files via `docs/CODEBASE_MAP.md` and answer it yourself rather
   than asking the user.
5. **Stop when aligned.** When no open branches remain and the user agrees,
   summarize the agreed scope, approach, and acceptance criteria in 3–5 lines.

## Handoff

Once aligned:

- Run `leanagentkit-new-spec` to capture the agreed scope into
  `docs/specs/NNN-<feature>.md` and point `docs/memory/ACTIVE_CONTEXT.md` at it.
- When the user is ready to code, they invoke `leanagentkit-implement-spec`.
- For any decision that surfaced that is hard to reverse, surprising without
  context, and the result of a real trade-off, offer `leanagentkit-seed-adrs`.

## Host enhancements (optional — never required)

When beginning a grill session (this skill guides the workflow) and the host is
Cursor:

- Offer switching to **Ask mode** so the interview stays read-only and accidental
  edits are avoided.
- Ask: "Switch to Ask mode for this alignment?" with options: "Switch to Ask mode",
  "Not yet", and "Something else (I will type it)".
- On agreement: suggest Ask mode manually (Shift+Tab or the mode picker). If
  `SwitchMode` later supports Ask, call it with user consent.
- Suggested prompt after switch: "Grill me on [feature/change]. One question at a
  time with a recommended answer. Do not write code."

On other hosts (Claude, Aider, Cline, Copilot, etc.): continue the portable
procedure; use "do not write code" in the prompt if the host might edit files.

## Quality bar

- Questions are concrete and answered one at a time, each with a recommendation.
- Anything answerable from the codebase was looked up, not asked.
- The session ends with scope and acceptance criteria specific enough that
  `leanagentkit-new-spec` can capture them without re-deriving intent.
