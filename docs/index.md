---
layout: home

hero:
  image:
    light: /assets/images/HeroLeanRobot.png
    dark: /assets/images/HeroLeanRobot.png
    alt: Lean Agent Kit Robot
  name: Lean Agent Kit
  text: Keep your agent's context lean
  tagline: A persistent Markdown brain that navigates by a map and pulls only what each task needs — instead of re-scanning your repo. Tool-agnostic, greenfield or brownfield.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Full Guide
      link: /guide
    - theme: alt
      text: GitHub
      link: https://github.com/renatoxm/leanagentkit

features:
  - title: Lean context (runtime)
    details: The agent reads CODEBASE_MAP.md and ACTIVE_CONTEXT.md, then opens only the files a task needs. Context is demand-paged, never dumped — no globbing, no drift.
  - title: Lean footprint (setup)
    details: Only what your project actually uses gets scaffolded — unused tiers and stacks are never created. A small footprint is what keeps context lean.
  - title: Greenfield or brownfield
    details: Scaffold a fresh app with leanagentkit-scaffold, or map and learn from an existing repo — the same lean loop runs either way.
  - title: Guardrails built in
    details: leanagentkit-check enforces AGENTS.md conventions and stack playbooks on every change.
  - title: Tool-agnostic
    details: Works with Cursor, Claude Code, Copilot, ChatGPT, Aider, Cline — anything that can read files.
  - title: Self-improving skills
    details: Distill session workflows into reusable skills; curate stale generators — skills compound via Learned notes.
  - title: Optional Caveman skills
    details: Terse commit messages, PR comments, and agent replies — opt in via caveman.yml; adapted from Julius Brussee's Caveman (MIT).
---
