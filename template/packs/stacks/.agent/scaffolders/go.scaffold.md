# Scaffolder: go

- **Category:** backend
- **Kind:** template
- **Stacks row:** Go
- **Depends-on:** none
- **Chains-to:** none
- **Verified:** 2026-07-06

## Questions

| id       | prompt                      | options                        | default                | → flag / param      | when |
| -------- | --------------------------- | ------------------------------ | ---------------------- | ------------------- | ---- |
| layout   | Layout                      | standard (cmd/internal) · flat | standard               | `{{layout}}`        |      |
| module   | Module path                 | `github.com/user/{{name}}`     | `example.com/{{name}}` | `{{module}}`        |      |
| golangci | golangci-lint?              | yes · no                       | yes                    | add `.golangci.yml` |      |
| vscode   | VS Code workspace settings? | yes · no                       | yes                    | write `.vscode/*`   |      |

## Files (template kind only)

### 1. init

```bash
go mod init {{module}}
```

### 2. create-file — `cmd/server/main.go` (standard layout)

```tpl
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"ok":true}`)
	})
	log.Println("listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

> For `layout=flat`, use `main.go` at repo root.

### 3. create-file — `.gitignore`

```tpl
/bin/
/dist/
*.exe
*.test
vendor/
.env
```

### 4. optional — golangci-lint (if golangci=yes)

Create `.golangci.yml`:

```yaml
run:
  timeout: 5m
linters:
  enable:
    - errcheck
    - gosimple
    - govet
    - ineffassign
    - staticcheck
    - unused
```

Create `Makefile`:

```makefile
.PHONY: lint
lint:
	golangci-lint run ./...
```

> Requires `golangci-lint` on PATH (`go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest`).

## VS Code (only when vscode=yes)

Copy `.agent/scaffolders/snippets/vscode/go.settings.json.tpl` → `.vscode/settings.json`
Copy `.agent/scaffolders/snippets/vscode/go.extensions.json` → `.vscode/extensions.json`

> When `golangci=no`, `go.settings.json.tpl` still enables format-on-save via `golang.go`;
> `go.lintTool` applies only when golangci-lint is installed.

## Verify

- [ ] `go.mod` exists with module path `{{module}}`
- [ ] `go build ./...` succeeds
- [ ] `go run ./cmd/server` or `go run .` serves `/health`
- [ ] When `golangci=yes`: `.golangci.yml` exists and `golangci-lint run ./...` succeeds
- [ ] When `vscode=yes`: `.vscode/settings.json` and `extensions.json` exist

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/go.md`).
