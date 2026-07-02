# Scaffolder: cloudflare

- **Category:** platform
- **Kind:** cli
- **Stacks row:** Cloudflare (Workers / Pages / Agents SDK)
- **Depends-on:** framework optional (can scaffold standalone Worker)
- **Chains-to:** none
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| platform | Platform | Workers · Pages | Workers | `--platform={{value}}` |
| framework | Framework preset | hono · next · astro · svelte · none (plain worker) | hono | `--framework={{value}}` |
| lang | Language | TypeScript · JavaScript | TypeScript | `--lang=ts` / `--lang=js` |
| dir | Project directory | `.` · `<name>` | `.` | `{{dir}}` |

## Command (cli kind only)

```bash
CI=true npm create cloudflare@latest {{dir}} -- --platform={{platform}} --framework={{framework}} --lang={{lang}} --yes
```

**Flag compilation notes**

- For plain Worker without framework preset, use `--framework=none` or documented equivalent.
- Always pass `--yes` after `--` for C3 non-interactive mode.

## Verify

- [ ] `wrangler.toml` or `wrangler.jsonc` exists
- [ ] `package.json` includes `wrangler` or `@cloudflare/workers-types`
- [ ] `{{pm}} run dev` or `wrangler dev` documented in README/package scripts

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/cloudflare.md`, installs Cloudflare skills).
