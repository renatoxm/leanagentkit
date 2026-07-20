# imaginary API reference

Base assumption: service running at `http://localhost:9000` (override if the
user's container is mapped elsewhere, or via `.leanagentkit/imaginary.yml`
`base_url`).

## Core endpoints

| Endpoint          | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `/resize`         | Resize to width/height                                           |
| `/crop`           | Crop to width/height with gravity                                |
| `/smartcrop`      | Content-aware crop (libvips smartcrop)                           |
| `/enlarge`        | Enlarge image                                                    |
| `/extract`        | Extract a region (top/left/areawidth/areaheight)                 |
| `/rotate`         | Rotate by degrees (with EXIF auto-rotate)                        |
| `/flip` / `/flop` | Flip / mirror                                                    |
| `/thumbnail`      | Generate thumbnail                                               |
| `/zoom`           | Zoom by factor                                                   |
| `/convert`        | Convert format only (e.g. jpeg -> webp)                          |
| `/watermark`      | Add text watermark                                               |
| `/watermarkimage` | Overlay an image as watermark                                    |
| `/blur`           | Gaussian blur                                                    |
| `/pipeline`       | Chain multiple operations in one request (POST JSON body of ops) |
| `/info`           | Return image metadata as JSON, no transform                      |
| `/health`         | Liveness/health check                                            |

## Common params (apply across most transform endpoints)

- `width`, `height` — target pixel dimensions
- `type` — output format: `jpeg`, `png`, `webp`, or `auto` (honors client `Accept` header)
- `gravity` — crop anchor: `north`, `south`, `centre`, `west`, `east`, `smart`
- `quality` — output quality (jpeg/webp)
- `compression` — png compression level
- `background` — RGB decimal color for flattening transparent PNGs
- `stripmeta` — strip EXIF/ICC metadata (`true`/`false`)
- `noprofile` — remove color profile

## Input modes

1. **Multipart upload** (default) — POST with a `file` field containing raw image bytes.
2. **Remote URL source** — start the container with `-enable-url-source`, then pass
   `?url=https://example.com/photo.jpg` as a query param instead of uploading a file.
   imaginary fetches the source itself.
3. **Local mounted directory** — start with `-mount /path/in/container`, then pass
   `?file=relative/path.jpg` to read from the mounted volume.

Only enable `-enable-url-source` on containers you control network access for —
unrestricted remote fetching is an SSRF risk if the container has broader network
reach than intended.

## Pipeline example (multiple ops, one request)

```bash
curl -X POST "http://localhost:9000/pipeline" \
  -F "file=@input.jpg" \
  -F 'operations=[{"operation":"resize","params":{"width":800}},{"operation":"convert","params":{"type":"webp"}}]' \
  -o out.webp
```

Supported pipeline operation names: `crop`, `smartcrop`, `resize`, `enlarge`,
`extract`, `rotate`, `flip`, `flop`, `thumbnail`, `zoom`, `convert`, `watermark`,
`blur`. (`watermarkimage` is documented but has had inconsistent pipeline support
in past releases — verify with a test call before relying on it.)

## Fetching the image

```bash
docker pull h2non/imaginary
```

## Starting the container

```bash
# basic, local file uploads only
docker run -d -p 9000:9000 h2non/imaginary imaginary -p 9000

# with remote URL source + local mounted directory
docker run -d -p 9000:9000 -v /path/on/host:/mnt/data \
  h2non/imaginary imaginary -p 9000 -enable-url-source -mount /mnt/data
```

docker-compose:

```yaml
version: "3"
services:
  imaginary:
    image: h2non/imaginary:latest
    volumes:
      - images:/mnt/data
    environment:
      PORT: 9000
    command: -enable-url-source -mount /mnt/data
    ports:
      - "9000:9000"
volumes:
  images:
```
