# Scaffolder: astro

- **Category:** framework
- **Kind:** cli
- **Stacks row:** Astro
- **Depends-on:** none
- **Chains-to:** tailwind, cloudflare
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| template | Starter template | minimal · basics · blog | minimal | `--template {{value}}` |
| ts | TypeScript strictness | strict · relaxed · none | strict | `--typescript strict` / `relaxed` / `false` |
| install | Install dependencies now? | yes · no | yes | omit `--install none` / `--install none` |
| git | Initialize git? | yes · no | no | omit `--git false` / `--git false` |
| dir | Project directory | `.` · `<name>` | `.` | `{{dir}}` |

## Command (cli kind only)

```bash
CI=true npm create astro@latest {{dir}} -- {{flags}} --yes
```

**Flag compilation notes**

- Pass flags after `--` to the Astro CLI.
- For non-interactive: always include `--yes`.
- Template: `--template minimal|basics|blog`.
- TypeScript: `--typescript strict|relaxed|false`.

## Verify

- [ ] `astro.config.mjs` or `astro.config.ts` exists
- [ ] `package.json` includes `astro`
- [ ] `src/pages/` or `src/` with at least one route

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/astro.md`, may copy Astro skills via degit).
- Offer `tailwind` or `cloudflare` adapter via `Chains-to`.
