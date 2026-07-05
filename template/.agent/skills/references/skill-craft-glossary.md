# Skill craft glossary

> Disclosed reference for `leanagentkit-create-skill`. Adapted from Matt Pocock's
> [`writing-great-skills`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills)
> (MIT). **Bold terms** below are defined in this file.

A skill wrangles determinism out of a stochastic system. **Predictability** — the
agent taking the same _process_ every run, not producing the same output — is the
root virtue; every lever below serves it.

## Predictability

The degree to which a skill makes the agent behave the same _way_ on every run.
Output may vary; process should not.

## Information hierarchy

Content ranked by how immediately the agent needs it:

1. **In-skill steps** — ordered actions in the skill file; primary tier. Each step
   ends on a **completion criterion**.
2. **In-skill reference** — definitions, rules, facts consulted on demand.
3. **Disclosed reference** — material in a sibling file (e.g. this glossary),
   reached by a **context pointer**, loaded only when the pointer fires.

**Progressive disclosure** moves reference down the ladder so the top stays legible.
Inline what every **branch** needs; disclose what only some branches reach.

**Co-location** keeps a concept's definition, rules, and caveats under one heading
so reading one part brings its neighbours with it.

## Steps and reference

**Steps** are what the agent does, in order. Not every skill has steps.

**Reference** is material consulted on demand — definitions, examples, conditional
rules. The prime candidate for progressive disclosure.

**Completion criterion** — the condition that tells the agent a unit of work is
done. Make it _checkable_ (can the agent tell done from not-done?) and, where it
matters, _exhaustive_ ("every modified model accounted for", not "produce a change
list"). Vague criteria invite **premature completion**.

**Legwork** — digging the agent does within a step (read files, trace code, run
checks). Raised by demanding completion criteria and strong **leading words**.

**Post-completion steps** — steps that follow the current one. Visible, they pull
the agent forward into premature completion; hide them by splitting the sequence
when sharpening the criterion is not enough.

## Invocation (craft framing)

How a skill is reached trades two loads:

- **Context load** — description always in the agent's window (model-discoverable).
- **Cognitive load** — the human must remember which skill to invoke by name.

**Context pointer** — wording that names out-of-context material and encodes when
to reach it. The description is the top-level pointer; links to disclosed files are
one level down. Fix pointer wording before inlining must-have material.

In Lean Agent Kit, see **LAK overrides** below for how this maps to `invocation:
auto` and wrappers.

## Leading words

A compact concept already in the model's pretraining (e.g. _relentless_, _red_,
_tight_) that anchors behaviour in few tokens. In the body it anchors execution; in
the description it anchors invocation when the same word appears in prompts and code.

Hunt restatements to **collapse** into one token: "fast, deterministic, low-overhead"
→ _tight_; "a loop you believe in" → _red_.

## Pruning

Keep each meaning in a **single source of truth**.

- **Relevance** — does the line still bear on what the skill does?
- **No-op test** — does the line change behaviour versus the default? Delete whole
  sentences that fail; do not trim words from them.

## Failure modes

Diagnose refactor work using these tags:

| Mode | Symptom | Cure (in order) |
|------|---------|-----------------|
| **Premature completion** | Step ends before genuinely done | Sharpen completion criterion; split sequence if criterion stays fuzzy and rush persists |
| **Duplication** | Same meaning in two places | Collapse to single source of truth |
| **Sediment** | Stale layers never removed | Prune for relevance; archive if skill is obsolete |
| **Sprawl** | Skill too long even when live | Progressive disclosure; split by branch or sequence |
| **No-op** | Line restates default behaviour | Delete; strengthen leading word if the concept matters |

**Granularity** — split only when the cut earns it: by invocation (distinct leading
word worth its own discoverability) or by sequence (hide post-completion steps).

## LAK overrides

Matt's craft vocabulary applies to LAK generated skills with these hard constraints:

| Craft concept | LAK rule |
|---------------|----------|
| Rich model-invoked **description** | Generated skills: **one sentence, ≤60 chars**, capability not implementation. Count before save. |
| **Router skill** | Forbidden — do not write index-only skills that only point at others. |
| Write target | Project skills → `.agent/skills/generated/leanagentkit-<name>.md` only |
| Kit-owned skills | Never modify `leanagentkit-*.md` in user projects — overwritten on `--upgrade` |
| Retire a skill | **Archive** to `generated/archived/`; set `status: archived`; never delete |
| Model-invoked vs user-invoked | `invocation: auto` on kit guardrails; generated skills ship explicit-invoke wrappers (`disable-model-invocation: true`) unless you deliberately opt into auto |
| Section order | Follow `skill-authoring-standards.md` — When to Use through Learned notes |
| Self-improvement | Append gotchas under `## Learned notes` in generated skills only |

For the full upstream domain model, see
[mattpocock/skills — writing-great-skills](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-great-skills).
