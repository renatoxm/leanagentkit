# Scaffolder Registry

> Single source of truth mapping a supported scaffold item → its recipe file,
> kind (cli vs template), and the matching stack row in `.agent/stacks/registry.md`.
> `leanagentkit-scaffold` reads this. Edit here, not in the skill.
>
> **Parity rule:** every row here must have both a recipe in `.agent/scaffolders/`
> and a matching **Stacks row** in `.agent/stacks/registry.md`.

## How to read a row

- **Category** — questionnaire grouping (framework, backend, orm, ui, platform, monorepo).
- **Item** — user-facing name in the scaffold menu.
- **Kind** — `cli` (non-interactive generator command) or `template` (file writes + installs).
- **Stacks row** — exact heading in `.agent/stacks/registry.md` (parity link).
- **Recipe** — `.agent/scaffolders/<file>.scaffold.md`.
- **Depends-on** — prerequisites (existing stack or prior scaffold).
- **Chains-to** — optional follow-on scaffolds after this one.
- **Gate** — `base` (greenfield only) or `additive` (any occupied repo).
- **Optional tooling** — lint/format and VS Code options live in each recipe's
  `## Questions` table; only offered when the recipe declares them.

---

## Framework

| Item         | Kind | Stacks row         | Recipe                   | Depends-on | Chains-to                                                  | Gate |
| ------------ | ---- | ------------------ | ------------------------ | ---------- | ---------------------------------------------------------- | ---- |
| Astro        | cli  | Astro              | `astro.scaffold.md`      | none       | Tailwind CSS v4, Cloudflare                                | base |
| Next.js      | cli  | Next.js            | `next.scaffold.md`       | none       | PostgreSQL + Prisma, PostgreSQL + Drizzle, Tailwind CSS v4 | base |
| React (Vite) | cli  | React              | `react-vite.scaffold.md` | none       | Tailwind CSS v4                                            | base |
| SvelteKit    | cli  | Svelte / SvelteKit | `sveltekit.scaffold.md`  | none       | Tailwind CSS v4, shadcn-svelte                             | base |

## Backend

| Item          | Kind     | Stacks row     | Recipe                | Depends-on | Chains-to                                             | Gate |
| ------------- | -------- | -------------- | --------------------- | ---------- | ----------------------------------------------------- | ---- |
| Django        | cli      | Django         | `django.scaffold.md`  | none       | none                                                  | base |
| Express       | template | Node / Express | `express.scaffold.md` | none       | PostgreSQL + Prisma, PostgreSQL + Drizzle             | base |
| FastAPI       | template | FastAPI        | `fastapi.scaffold.md` | none       | none                                                  | base |
| Hono          | cli      | Hono           | `hono.scaffold.md`    | none       | Cloudflare, PostgreSQL + Prisma, PostgreSQL + Drizzle | base |
| Python (base) | template | Python         | `python.scaffold.md`  | none       | FastAPI, Django                                       | base |
| Go            | template | Go             | `go.scaffold.md`      | none       | none                                                  | base |

## ORM

| Item    | Kind     | Stacks row           | Recipe                | Depends-on  | Chains-to | Gate     |
| ------- | -------- | -------------------- | --------------------- | ----------- | --------- | -------- |
| Prisma  | cli      | PostgreSQL + Prisma  | `prisma.scaffold.md`  | Node/TS app | none      | additive |
| Drizzle | template | PostgreSQL + Drizzle | `drizzle.scaffold.md` | Node/TS app | none      | additive |

## UI

| Item            | Kind     | Stacks row                    | Recipe                      | Depends-on              | Chains-to     | Gate     |
| --------------- | -------- | ----------------------------- | --------------------------- | ----------------------- | ------------- | -------- |
| Tailwind CSS v4 | template | Tailwind CSS v4               | `tailwind.scaffold.md`      | JS/TS app               | shadcn-svelte | additive |
| shadcn-svelte   | cli      | shadcn-svelte (UI components) | `shadcn-svelte.scaffold.md` | SvelteKit + Tailwind v4 | none          | additive |

## Platform

| Item       | Kind | Stacks row                                | Recipe                   | Depends-on         | Chains-to | Gate           |
| ---------- | ---- | ----------------------------------------- | ------------------------ | ------------------ | --------- | -------------- |
| Cloudflare | cli  | Cloudflare (Workers / Pages / Agents SDK) | `cloudflare.scaffold.md` | framework optional | none      | base, additive |

## Monorepo

| Item      | Kind | Stacks row | Recipe                  | Depends-on | Chains-to                   | Gate |
| --------- | ---- | ---------- | ----------------------- | ---------- | --------------------------- | ---- |
| Turborepo | cli  | Turborepo  | `turborepo.scaffold.md` | none       | Next.js, React (Vite), Hono | base |

---

## Adding your own rows

1. Add a section to `.agent/stacks/registry.md` (playbook + detect rules).
2. Create `.agent/scaffolders/<name>.scaffold.md` from `_TEMPLATE.scaffold.md`.
3. Append a row above with matching **Stacks row** and **Recipe** paths.
4. Re-run `leanagentkit-scaffold` — the new item appears when its gate allows.
