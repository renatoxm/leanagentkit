---
name: leanagentkit-observability
description: Instrument code for production visibility. Use when adding logging, metrics, tracing, or alerting for deployable services.
invocation: conditional
---

# Skill: leanagentkit-observability

**Goal:** Code you can't observe is code you can't operate. Instrument alongside
the feature — same as tests. If a feature ships without telemetry, the first
production bug becomes archaeology.

**Enable when:** project is a deployable service (see
`.agent/practice-skills/registry.md`).

For active failure diagnosis → `leanagentkit-debug`.
For performance profiling → `leanagentkit-performance`.

## When to use

- New service, endpoint, background job, or external integration going to production
- Production incident took too long to diagnose
- PR adds I/O, retries, queues, or cross-service calls

## Process

### 1. Define "working" before instrumenting

Write 2–4 questions on-call will ask about this feature. Every signal must answer
one of them. No questions → not ready to instrument.

### 2. Pick the right signal

| Signal | Answers | Example |
|--------|---------|---------|
| Structured log | What happened in this case? | `payment_failed` with error code |
| Metric | How often / how fast? | p99 latency histogram |
| Trace | Where did time go? | Request span breakdown |

Metrics tell you **that** something is wrong; traces tell you **where**; logs
tell you **why**.

### 3. Structured logging

Log events (JSON), not prose. Stable event name + machine-readable fields.

Levels: `error` (investigate), `warn` (degraded but handled), `info` (business
event), `debug` (off in production).

**Correlation IDs mandatory** — generate or accept request ID at boundary; attach
to every log line and outbound call.

**Never log secrets, tokens, passwords, or full PII** (see `leanagentkit-security`).

### 4. Metrics

Request-driven services: **RED** on every endpoint and external dependency —
Rate, Errors, Duration (histogram, not average).

Resources (queues, pools): **USE** — Utilization, Saturation, Errors.

**Cardinality is the failure mode.** Labels from small fixed sets (route template,
status class, provider name). Never user IDs, raw URLs, or error message text as labels.

Track percentiles (p50/p95/p99), not averages.

### 5. Distributed tracing

Use OpenTelemetry where project supports it. Propagate context across async
boundaries. Sample by default; keep errors if backend supports tail sampling.

### 6. Alerting

Alert on **symptoms users feel**, not causes:
```
Page-worthy:  error rate > 1% for 5 min, p99 latency > SLA
Dashboard:    CPU at 85%, one pod restarted
```

Every alert: actionable, links to runbook, has threshold + duration, test-fired once.

### 7. Verify telemetry

In staging: force error → find by requestId; send traffic → confirm metrics;
follow one request in tracing UI; test-fire each new alert.

## Red flags

- Feature with retries/queues/external calls and zero new telemetry
- String-interpolated logs (unqueryable)
- No correlation/request ID
- High-cardinality metric labels (user ID, raw URL)
- Latency tracked as average only
- Alerts that fire daily and get ignored
- Secrets or full request bodies in logs

## Verification

- [ ] On-call questions written; each signal maps to one
- [ ] Logs structured with stable event names and correlation ID
- [ ] No secrets/PII in log output (spot-check)
- [ ] RED metrics on new endpoints and external dependencies
- [ ] Latency as histogram with queryable p95/p99
- [ ] End-to-end trace follows one request without broken spans
- [ ] Induced failure in staging located via telemetry alone
