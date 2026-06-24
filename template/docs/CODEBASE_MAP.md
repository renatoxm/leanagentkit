# Codebase Map

> The navigation index for agents. Read this to locate code instead of scanning
> the repo. Keep entries to one line each — "what it does + where to look".
>
> Regenerate with the `map-codebase` skill. Last updated: <!-- YYYY-MM-DD -->

## Entry points

- `<path>` → <how the app boots / the main entry>

## Directory guide

```
<dir>/        → <what lives here, in one line>
  <subfile>   → <only call out files worth knowing individually>
<dir>/        → <...>
```

## Key modules (the 20% you touch 80% of the time)

| Module / file | Responsibility | Notes |
|---------------|----------------|-------|
| `<path>` | <what it owns> | <gotchas, source-of-truth flags> |

## Data & schema

- **Source of truth for schema:** `<path>`
- **Migrations:** `<path>`
- **Models / types:** `<path>`

## External integrations

| Service | Where it's wired | Config / secret name |
|---------|------------------|----------------------|
| `<svc>` | `<path>` | `<ENV_VAR>` |

## Cross-cutting concerns

- **Auth:** `<path>`
- **Config / env:** `<path>`
- **Error handling:** `<path>`
- **Logging:** `<path>`

## What to ignore

- `<generated dir>` — generated, never edit by hand
- `<vendored dir>` — third-party
