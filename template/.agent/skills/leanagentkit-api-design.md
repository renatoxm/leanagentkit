---
name: leanagentkit-api-design
description: Design stable APIs and module interfaces. Use when creating REST/GraphQL/RPC endpoints, defining type contracts between modules, or establishing frontend/backend boundaries.
invocation: auto
---

# Skill: leanagentkit-api-design

**Goal:** Design stable, well-documented interfaces that are hard to misuse. Good
interfaces make the right thing easy and the wrong thing hard.

## When to use

- New API endpoints or public module boundaries
- Component prop interfaces shared across teams
- Database schema that informs API shape
- Changing existing public interfaces

For removing or versioning old interfaces → `leanagentkit-deprecation`.

## Core principles

### Hyrum's Law
Every observable behavior — including undocumented quirks — becomes a de facto
contract. Be intentional about what you expose. Plan deprecation at design time.

### Contract first
Define the interface before implementing. Types/schemas ARE the spec.

### Consistent error semantics
One error strategy everywhere:
```
{ error: { code, message, details? } }
```
Map HTTP status consistently (400/401/403/404/409/422/500). Don't mix throw,
null, and error-object patterns across endpoints.

### Validate at boundaries
Trust internal code. Validate at system edges:
- API route handlers, form handlers
- External service responses (**always treat as untrusted**)
- Environment/config loading

Don't validate between internal functions sharing type contracts.

### Prefer addition over modification
Add optional fields; don't change types or remove fields without migration plan.

### Predictable naming

| Pattern | Convention |
|---------|------------|
| REST endpoints | Plural nouns: `GET /api/tasks` |
| Query params | camelCase |
| Response fields | camelCase |
| Booleans | `is`/`has`/`can` prefix |
| Enums | UPPER_SNAKE or project convention |

## REST patterns

```
GET    /api/tasks           → list (paginated)
POST   /api/tasks           → create
GET    /api/tasks/:id       → get one
PATCH  /api/tasks/:id       → partial update
DELETE /api/tasks/:id       → delete (idempotent)
```

**Pagination required** on all list endpoints.

**PATCH:** accept partial objects — only update provided fields.

## Type patterns

- **Input/output separation** — caller provides `CreateInput`; system returns
  full entity with server-generated fields
- **Discriminated unions** for variants — enables type narrowing
- **Branded types for IDs** — prevent passing wrong ID type

## Red flags

- Endpoints returning different shapes depending on conditions
- Inconsistent error formats
- Validation scattered through internal code
- Breaking field type changes or removals
- List endpoints without pagination
- Verbs in REST URLs (`/api/createTask`)
- Third-party responses used without validation

## Verification

- [ ] Every endpoint has typed input and output schemas
- [ ] Error responses follow single consistent format
- [ ] Validation at boundaries only
- [ ] List endpoints paginated
- [ ] New fields additive and optional
- [ ] Naming consistent across all endpoints
- [ ] Types/docs committed alongside implementation
