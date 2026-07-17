# Stack Playbook: Go

> Applied when Go is detected.

## Defer to the skill / MCP for

- Packages, modules, testing, stdlib → official Go docs.

## Conventions to record in AGENTS.md

- Standard project layout (`cmd/`, `internal/`, `pkg/`) if used.
- Errors wrapped with context; avoid panic in library code.
- Tests alongside source (`*_test.go`).

## CODEBASE_MAP hints to capture

- `go.mod` module path and main entry (`cmd/*/main.go`).
- `internal/` packages and their boundaries.
- Config and env loading.

## AGENTS.md snippet to add

> For Go packages and modules, follow official Go docs and existing `internal/` boundaries.
