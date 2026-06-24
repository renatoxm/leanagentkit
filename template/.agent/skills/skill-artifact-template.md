# Skill: skill-artifact-template

**Goal:** Author a new, project-specific **artifact generator skill** (e.g.
`create-new-page`, `create-new-component`, `create-crud`). It learns *this*
codebase's recipe for an artifact ONCE — by inferring from a real example and
asking only about gaps — then freezes it into a standalone skill + recipe so
future generation is fast and needs no full-repo read.

**Run when:** "use skill-artifact-template to generate a new <artifact-type>".

**Inputs:** the artifact type (page, component, crud, endpoint, model, …).
**Outputs:**
- `.agent/recipes/<artifact-type>.recipe.md` — the structured recipe (data).
- `.agent/skills/generated/create-<artifact-type>.md` — the runtime generator skill.
- A registry line appended to `.agent/skills/generated/README.md`.
- If `.cursor/skills/` exists (Cursor wired via `wire-cursor`), also create
  `.cursor/skills/create-<artifact-type>/SKILL.md` — a wrapper with frontmatter
  (`name`, `description`, `disable-model-invocation: true`) that delegates to
  `.agent/skills/generated/create-<artifact-type>.md`.

---

## Authoring procedure (infer first, ask only for gaps)

### 1. Orient cheaply
Read `docs/CODEBASE_MAP.md` and relevant `.agent/stacks/*.md` playbooks. Do NOT
scan the whole repo — the map tells you where things live.

### 2. Find a reference example
Ask the user (or infer from the map) for ONE existing artifact of this type that
is representative — e.g. "which existing page is a good template?". If they name
one, use it; otherwise pick the most canonical-looking instance from the map and
state your choice.

### 3. Infer the recipe by tracing that example
For the chosen example, trace everything that had to exist for it to work. Capture
each as a recipe **step**. Cover at least these capability areas:

- **Files & folders** — every file created for the artifact, with its path
  pattern (e.g. `src/routes/<name>/+page.svelte`) and a template derived from the
  example (parameterized with `<name>`, `<Name>`, `<name_snake>`, etc.).
- **Routes** — how the artifact is registered in routing (file-based? a route
  table entry? a `app.route()` call?). Record the exact file and the insertion point.
- **Middleware** — any middleware attached (auth, validation, rate-limit) and where.
- **Roles / access control** — how access is gated. This is a **runtime question**
  (which roles can access THIS artifact), so record *where* the role check goes and
  *how* it's expressed, and mark it as a per-generation prompt.
- **i18n / localization** — which locale files get new keys, the key-naming
  convention, and which languages exist (so the generator adds a stub per language).
- **Registry edits** — barrel exports, nav menus, sidebar entries, DI containers,
  type unions — anything that must be edited (not created) to "wire in" the artifact.

For each step record: `id`, `action` (create-file | edit-file | add-i18n |
register-route | attach-middleware | set-roles | run-command), `target` (path +
insertion anchor for edits), `template` or `patch`, and `prompt?` (a question to
ask at generation time if the value can't be derived from the artifact name).

### 4. Identify gaps → questionnaire
Anything you could NOT infer with confidence becomes a question. Ask them as ONE
interactive set (use the host's multiple-choice UI if available), e.g.:
- "Which locale files should new keys go in?" (multi-select from detected files)
- "Default roles allowed, or always ask per artifact?"
- "Should the route be public by default?"
Fold answers into the recipe. Mark genuinely per-instance values (like roles) as
`prompt` steps rather than fixed values.

### 5. Write the recipe
Write `.agent/recipes/<artifact-type>.recipe.md` using
`.agent/recipes/_TEMPLATE.recipe.md`. Keep templates as fenced blocks with
`<placeholders>`. Record the reference example path and a `verified` date.

### 6. Generate the runtime skill
Write `.agent/skills/generated/create-<artifact-type>.md` from
`.agent/skills/generated/_GENERATOR_TEMPLATE.md`, pointing it at the recipe. The
generated skill must be self-contained: reading it + the recipe is enough to
produce the artifact WITHOUT reading the whole codebase.

### 7. Register & report
Append a row to `.agent/skills/generated/README.md`. If `.cursor/skills/` exists,
write the Cursor skill wrapper (see Outputs). Report: artifact type,
reference example used, capabilities captured, per-generation prompts, and the
invocation string (`Read .agent/skills/generated/create-<type>.md and follow it`).

---

## Rules
- **Infer, then confirm.** Show the inferred recipe summary before writing; let the
  user correct it. Don't silently guess role/i18n behavior.
- **Parameterize, don't hardcode.** Templates use placeholders; instance values
  come from name + per-generation prompts.
- **Idempotent re-authoring.** Re-running on an existing type updates the recipe
  (diff and confirm), never silently overwrites a hand-edited recipe.
- **Stay lean.** The recipe captures only what's needed to wire the artifact in —
  not a copy of the codebase.
