# Imaginary — image processing

> **Requires pack:** `imaginary`. Skills are not on disk until the pack is enabled. See [Packs](/packs).

::: code-group

```bash [npm]
npx create-lean-agent-kit@latest . --enable-pack imaginary
```

```bash [pnpm]
pnpm dlx create-lean-agent-kit@latest . --enable-pack imaginary
```

```bash [yarn]
yarn dlx create-lean-agent-kit@latest . --enable-pack imaginary
```

```bash [bun]
bunx create-lean-agent-kit@latest . --enable-pack imaginary
```

:::

Optional skill for **resize, crop, convert, watermark, and batch** image transforms
via the self-hosted [`h2non/imaginary`](https://github.com/h2non/imaginary) Docker
service (Go + libvips). Output is **already-processed files** ready to deploy —
not an on-the-fly CDN proxy.

The scaffolder (`npm create lean-agent-kit`) does **not** start Docker or pull
the imaginary image. You run the container yourself (or let the agent guide you).

## What Imaginary is / is not

| Imaginary pack is | Imaginary pack is not |
|-------------------|------------------------|
| A procedure + health check for local image transforms | A bundled Docker daemon or CLI binary |
| An imgproxy-style alternative that writes files to disk | An on-the-fly image CDN / proxy for production traffic |
| Opt-in via `--enable-pack imaginary` | Always-on; zero impact until you invoke the skill |
| Config for `base_url` only | Automatic container orchestration |

## Prerequisites

- Docker (to run `h2non/imaginary`)
- `curl` on PATH
- Container reachable over HTTP (default `http://localhost:9000`)

## Quick start

1. Enable the pack (command above).
2. Copy the config example (optional):

   ```bash
   cp .leanagentkit/imaginary.yml.example .leanagentkit/imaginary.yml
   ```

3. Start imaginary:

   ```bash
   docker pull h2non/imaginary
   docker run -d -p 9000:9000 h2non/imaginary imaginary -p 9000
   ```

4. Invoke the skill:

   > Read `.agent/skills/leanagentkit-imaginary.md` and follow it.

5. The skill **always** runs the health check first:

   ```bash
   bash .agent/skills/scripts/check_imaginary.sh http://localhost:9000
   ```

   If unavailable, it stops and warns — it does not fabricate results.

6. Example resize:

   ```bash
   curl -o out.webp \
     -F "file=@input.jpg" \
     "http://localhost:9000/resize?width=800&type=webp"
   ```

## Config

`.leanagentkit/imaginary.yml`:

```yaml
base_url: http://localhost:9000
```

Use this when the container is mapped to a different host or port. If the file
is missing, the skill defaults to `http://localhost:9000`.

## Security note

Only enable imaginary’s `-enable-url-source` flag on containers whose network
access you control — unrestricted remote fetching is an **SSRF** risk. Prefer
multipart file upload for local workflows. Details:
`.agent/skills/references/imaginary/api-reference.md`.

## Pack contents

| Path | Role |
|------|------|
| `.agent/skills/leanagentkit-imaginary.md` | Procedure (health → transform → batch) |
| `.agent/skills/scripts/check_imaginary.sh` | Deterministic `/health` check |
| `.agent/skills/references/imaginary/api-reference.md` | Endpoints, params, docker run / compose |
| `.leanagentkit/imaginary.yml.example` | Optional `base_url` |

## Attribution

Built around [h2non/imaginary](https://github.com/h2non/imaginary) (MIT).
