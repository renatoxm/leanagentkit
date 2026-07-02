# Scaffolder: go

- **Category:** backend
- **Kind:** template
- **Stacks row:** Go
- **Depends-on:** none
- **Chains-to:** none
- **Verified:** 2026-07-02

## Questions

| id | prompt | options | default | → flag / param |
|----|--------|---------|---------|----------------|
| layout | Layout | standard (cmd/internal) · flat | standard | `{{layout}}` |
| module | Module path | `github.com/user/{{name}}` | `example.com/{{name}}` | `{{module}}` |

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

## Verify

- [ ] `go.mod` exists with module path `{{module}}`
- [ ] `go build ./...` succeeds
- [ ] `go run ./cmd/server` or `go run .` serves `/health`

## Handoff

- Run `leanagentkit-match-stack` (applies `stacks/go.md`).
