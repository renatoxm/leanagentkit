# ADR-0001: Record architecture decisions

- **Status:** accepted
- **Date:** <!-- YYYY-MM-DD -->

## Context

We need a durable, tool-agnostic record of why the system is built the way it is,
so that both humans and AI agents can reconstruct intent without re-deriving it
from code.

## Decision

We will keep Architecture Decision Records as Markdown files in `docs/adr/`,
numbered sequentially (`NNNN-title.md`), using `_TEMPLATE.md`. ADRs are immutable;
a decision is changed by adding a new ADR that supersedes the old one.

## Consequences

**Positive**
- Decisions and their rationale survive context resets and team/agent changes.
- Cheap for an agent to read only when a decision is being made or changed.

**Negative / trade-offs**
- Requires discipline to write one when a real decision is made.

## Alternatives considered

- **Decisions in a wiki / commit messages** — harder to discover, not co-located with code, easily lost.
