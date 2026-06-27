---
name: leanagentkit-security
description: Security hardening for code touching user input, auth, data storage, or external integrations. Use when building features that accept untrusted data or manage sessions.
invocation: auto
---

# Skill: leanagentkit-security

**Goal:** Treat every external input as hostile, every secret as sacred, every
authorization check as mandatory. Security is a constraint on every relevant
line of code — not a phase.

**Output format:** For audit-style reports, read
`.agent/skills/frame/findings-report.md`.

**Checklist:** `.agent/skills/references/security-checklist.md`

## When to use

- User input, auth, sensitive data, file uploads, webhooks, external APIs
- Payment or PII handling
- Security-focused review before merge (deeper than `leanagentkit-review` §4)

## Process: threat model first (5 minutes)

1. **Map trust boundaries** — HTTP, forms, uploads, webhooks, third-party APIs, LLM output
2. **Name assets** — credentials, PII, payment data, admin actions
3. **STRIDE each boundary** — Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation
4. **Write abuse cases** — "How would I misuse this?" → make it the first test

## Three-tier boundary system

### Always do
- Validate external input at system boundaries
- Parameterize database queries
- Encode output (prevent XSS); use framework auto-escaping
- HTTPS for external communication
- Hash passwords (bcrypt/scrypt/argon2)
- Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- httpOnly, secure, sameSite cookies for sessions
- Run dependency audit before release

### Ask first (human approval)
- New auth flows or auth logic changes
- New sensitive data categories (PII, payment)
- New external integrations, CORS changes, file upload handlers
- Rate limiting changes, elevated permissions

### Never do
- Commit secrets; log sensitive data
- Trust client-side validation as security boundary
- Disable security headers for convenience
- Use eval/innerHTML with user or model-provided data
- Store auth tokens in client-accessible storage
- Expose stack traces or internal errors to users

## Key prevention patterns

**Injection:** Parameterized queries / ORM — never concatenate user input into SQL.

**Broken auth:** Strong hashing, secure session cookies, rate limit login endpoints.

**XSS:** Framework auto-escaping; sanitize if HTML rendering required.

**Broken access control:** Check authorization on every protected endpoint; verify
resource ownership (IDOR).

**SSRF:** Allowlist schemes/hosts; reject private/reserved IPs on server-side fetches;
forbid redirects on untrusted URLs.

**Sensitive data exposure:** Strip sensitive fields from API responses; secrets in
environment variables only.

## Dependency audit triage

```
Critical/high + reachable in production → fix immediately
Critical/high + dev-only/unreachable    → fix soon
Moderate                              → next release cycle
Low                                   → regular updates
```

Also: commit lockfile, reproducible CI install, review new deps, watch postinstall
scripts and typosquats.

## AI / LLM features (if present)

- Treat model output as untrusted input (LLM05)
- Don't rely on system prompt as security boundary (LLM01)
- Keep secrets and cross-tenant data out of prompts (LLM02/07)
- Scope tool permissions; confirm destructive actions (LLM06)
- Cap tokens, rate, recursion depth (LLM10)

## Red flags

- User input → query/shell/HTML without validation
- Secrets in source or git history
- Endpoints without auth/authz checks
- Wildcard CORS in production
- No rate limiting on auth endpoints
- LLM output passed to query/DOM/shell/eval

## Verification

- [ ] Dependency audit: no critical/high reachable vulnerabilities
- [ ] No secrets in code or staged diff
- [ ] Input validated at boundaries; auth/authz on protected endpoints
- [ ] Security headers present; errors don't expose internals
- [ ] SSRF protections on user-influenced URL fetches
- [ ] LLM output validated before use (if AI features present)
