# Work slices: <feature name>

> Companion to parent spec. One slices file per feature.
> Parent: docs/specs/NNN-<feature>.md · Updated: <!-- YYYY-MM-DD -->

## Architecture diagnostics

| Framework            | Score (0–10)    | Failed diagnostic rows  |
| -------------------- | --------------- | ----------------------- |
| Clean Architecture   | <!-- e.g. 7 --> | <!-- list or "none" --> |
| Domain-Driven Design | <!-- e.g. 6 --> | <!-- list or "none" --> |

## Bounded contexts (optional)

<!-- Prose or mermaid context map: contexts, relationships, ACL/events between them. -->

## Work slices

| ID  | Title                                     | Type        | DependsOn | Parallel | Contract            | FilesInPlay    | Status  |
| --- | ----------------------------------------- | ----------- | --------- | -------- | ------------------- | -------------- | ------- |
| S1  | <!-- e.g. Order aggregate -->             | domain      | —         | no       | —                   | <!-- paths --> | pending |
| S2  | <!-- e.g. PlaceOrder use case + ports --> | use_case    | S1        | no       | <!-- port names --> | <!-- paths --> | pending |
| S3  | <!-- e.g. HTTP adapter -->                | adapter     | S2        | yes      | PlaceOrderInput     | <!-- paths --> | pending |
| S4  | <!-- e.g. Postgres repository -->         | adapter     | S2        | yes      | OrderRepository     | <!-- paths --> | pending |
| S5  | <!-- e.g. Integration / wiring -->        | integration | S3,S4     | no       | composition root    | <!-- paths --> | pending |

**Type values:** `domain` · `use_case` · `adapter` · `context` · `integration`

**Status values:** `pending` · `active` · `done` · `blocked`

## Integration contracts

<!-- Ports, DTOs, domain events, API schemas — required before parallel work when require_contracts: true. -->

### Ports / interfaces

<!-- e.g. OrderRepository, PlaceOrderInput, PlaceOrderOutput -->

### Events / schemas

<!-- e.g. OrderPlaced { orderId, customerId, timestamp } -->

## Merge plan

1. Complete sequential foundation slices (domain, use_case) first.
2. Parallel adapter/context slices up to `max_parallel` (see `.leanagentkit/architecture.yml`).
3. Integration slice last — merge worktrees, wire composition root.
4. Run `leanagentkit-check` on all changed files before marking parent spec ACs done.
