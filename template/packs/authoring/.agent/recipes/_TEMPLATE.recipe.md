# Recipe: <artifact-type>

> Frozen, project-specific recipe for creating one <artifact-type>. Authored by
> `leanagentkit-skill-artifact-template`, consumed by `leanagentkit-create-<artifact-type>`. This is DATA —
> reading it (not the whole repo) is enough to generate the artifact.

- **Artifact type:** <page | component | crud | endpoint | …>
- **Reference example:** `<path to the existing artifact this was inferred from>`
- **Verified:** <!-- YYYY-MM-DD -->

## Parameters (asked once per generation)
| name | meaning | example |
|------|---------|---------|
| `<name>` | raw artifact name | `invoices` |
| `<Name>` | PascalCase | `Invoices` |
| `<name_kebab>` | kebab-case | `invoices` |
| `<name_snake>` | snake_case | `invoices` |

## Per-generation prompts
> Values that change every time and must be asked at generation, not baked in.
- `roles`: which roles may access this? (options: `<role-a>`, `<role-b>`, `public`)
- `<other prompt>`: <...>

## Steps
> Ordered. Each: id · action · target (+ anchor for edits) · template/patch · prompt?

### 1. create-file — `<path/pattern/with/<name>>`
```tpl
<file template parameterized with <Name>, <name_kebab>, etc.>
```

### 2. register-route — edit `<routing file>` at anchor `<marker / regex / section>`
```patch
<line(s) to insert, e.g.  app.route('/<name_kebab>', <name>Route)>
```

### 3. attach-middleware — edit `<file>` at `<anchor>`
```patch
<middleware wiring, if any>
```

### 4. set-roles — `<where/how access is enforced>`  (prompt: `roles`)
```tpl
<role-guard expression using {{roles}}>
```

### 5. add-i18n — for each locale file below, insert keys
- locales: `<path/en.json>`, `<path/pt.json>`, …
- key convention: `<e.g. <name_snake>.title>`
```tpl
{ "<name_snake>": { "title": "<Name>", "...": "..." } }
```

### 6. register — edit `<barrel/nav/DI file>` at `<anchor>`
```patch
<export / nav entry / container binding>
```

## Post-generation checks
- [ ] <e.g. typecheck passes>
- [ ] <e.g. route reachable / appears in nav>
