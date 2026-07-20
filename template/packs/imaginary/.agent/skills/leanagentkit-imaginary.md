---
name: leanagentkit-imaginary
description: Resize, crop, convert, watermark, or batch-process images via self-hosted imaginary (h2non/imaginary). Use when imaginary is mentioned or local image transforms are needed.
version: 1.0.0
invocation: conditional
metadata:
  tags: [images, imaginary, docker]
---

# Skill: leanagentkit-imaginary

Thin wrapper around the `h2non/imaginary` HTTP microservice (Go + libvips) for
resize/crop/convert/watermark/pipeline. Produces **already-processed files** ready
to deploy — not an on-the-fly CDN proxy like imgproxy. Availability is checked
up front every time — never assumed. The scaffolder does **not** start Docker.

## When to Use

- User mentions imaginary by name
- "Resize these images", "convert to webp", "crop this batch", "thumbnail these photos"
- Image transforms as an imgproxy alternative that outputs files to ship
- Local image-processing HTTP service is implied

## Prerequisites

- `curl` on PATH
- A running [`h2non/imaginary`](https://github.com/h2non/imaginary) Docker container
  reachable over HTTP (default `http://localhost:9000`)
- Optional: `.leanagentkit/imaginary.yml` with `base_url` (copy from
  `.leanagentkit/imaginary.yml.example`)

Docker start commands: `.agent/skills/references/imaginary/api-reference.md`.

## How to Run

Invoke through the host agent's shell/terminal tool.

Resolve `BASE_URL`: if `.leanagentkit/imaginary.yml` exists and sets `base_url`,
use that; otherwise `http://localhost:9000`.

```bash
bash .agent/skills/scripts/check_imaginary.sh "$BASE_URL"
```

## Quick Reference

| Action | Command sketch |
|--------|----------------|
| Health | `bash .agent/skills/scripts/check_imaginary.sh [base_url]` |
| Resize | `curl -o out.webp -F "file=@in.jpg" "$BASE_URL/resize?width=800&type=webp"` |
| Smartcrop | `curl -o out.webp -F "file=@in.jpg" "$BASE_URL/smartcrop?width=500&height=400&type=webp"` |
| Pipeline | See reference — `/pipeline` with `operations` JSON |
| Full API | `.agent/skills/references/imaginary/api-reference.md` |

## Procedure

### 1. Always check availability first

```bash
bash .agent/skills/scripts/check_imaginary.sh "$BASE_URL"
```

Prints one line of JSON; exits `0` if reachable, `1` if not.

**If unavailable (exit 1):** stop. Do not attempt transforms or fabricate results.
Tell the user plainly using the actual `$BASE_URL`, e.g.:

> imaginary isn't reachable at `$BASE_URL` right now, so I can't process any
> images. The container may not be running or is on a different port.

Then offer (don't assume) next steps:

- Share docker run / compose from `.agent/skills/references/imaginary/api-reference.md`
- Ask if they want you to start it (only if you have shell/Docker access)
- Offer to re-run the health check once they confirm it's up

**If available (exit 0):** continue.

### 2. Run the requested transform

Read `.agent/skills/references/imaginary/api-reference.md` for endpoints, params,
input modes (multipart / URL source / mounted dir), and pipeline syntax.

Single-image resize:

```bash
curl -o out.webp \
  -F "file=@input.jpg" \
  "$BASE_URL/resize?width=800&type=webp"
```

Content-aware crop:

```bash
curl -o out.webp \
  -F "file=@input.jpg" \
  "$BASE_URL/smartcrop?width=500&height=400&type=webp"
```

Chain multiple ops with `/pipeline` (one request) rather than several curl calls.

### 3. Batch processing

imaginary has no multi-file endpoint — loop one request per file. Always write to
a separate output directory so originals are never overwritten. Check HTTP status
per file; do not leave error bodies as output images:

```bash
shopt -s nullglob
mkdir -p ./out
ok=0
fail=0
for f in ./images/*.jpg; do
  name="$(basename "${f%.*}")"
  out="./out/${name}.webp"
  code=$(curl -s -o "$out" -w "%{http_code}" \
    -F "file=@${f}" \
    "$BASE_URL/resize?width=800&type=webp" || echo "000")
  if [ "$code" = "200" ] && [ -s "$out" ]; then
    ok=$((ok + 1))
  else
    fail=$((fail + 1))
    echo "failed: $f (http $code)" >&2
    # Surface imaginary's error body, then remove bogus output
    [ -s "$out" ] && cat "$out" >&2
    rm -f "$out"
  fi
done
echo "ok=$ok fail=$fail → ./out"
```

If `ok=0` and no files matched the glob, report that — do not claim success.
Report how many files were processed and where output landed.

### 4. Deploying the output

The output directory is the deliverable. Point the user at it or hand off to the
next build/deploy step. Do not re-process files already in the output dir unless asked.

## Pitfalls

- Never enable `-enable-url-source` without telling the user unrestricted remote
  fetching is an SSRF risk (see reference).
- On non-200 or empty output, surface imaginary's response body — it usually names
  the bad param or malformed input.
- Do not assume the container is up; always run the health script first.

## Verification

```bash
bash .agent/skills/scripts/check_imaginary.sh "$BASE_URL"
# expect {"available":true,"url":"...","http_code":"200"} and exit 0
ls -la <output-file-or-dir>
```
