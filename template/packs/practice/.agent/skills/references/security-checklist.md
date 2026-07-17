# Security Checklist

Quick reference for web application security. Use alongside
`leanagentkit-security`.

## Threat modeling (start here)

- [ ] Trust boundaries mapped (requests, uploads, webhooks, third-party APIs, LLM output)
- [ ] Assets named (credentials, PII, payment data, admin actions)
- [ ] STRIDE run per boundary
- [ ] Abuse cases written next to use cases

## Pre-commit

- [ ] No secrets in code
- [ ] `.gitignore` covers `.env`, `.env.local`, `*.pem`, `*.key`
- [ ] `.env.example` uses placeholders only

## Authentication

- [ ] Passwords hashed (bcrypt ≥12 rounds, scrypt, or argon2)
- [ ] Session cookies: `httpOnly`, `secure`, `sameSite`
- [ ] Rate limiting on login (≤10 attempts / 15 min)
- [ ] Password reset tokens: time-limited, single-use

## Authorization

- [ ] Every protected endpoint checks authentication
- [ ] Resource access checks ownership/role (prevents IDOR)
- [ ] Admin actions require admin role verification

## Input validation

- [ ] All user input validated at system boundaries
- [ ] SQL queries parameterized
- [ ] HTML output encoded (framework auto-escaping)
- [ ] File uploads: type restricted, size limited
- [ ] Server-side URL fetches allowlisted (no SSRF)

## Security headers & CORS

- [ ] CSP, HSTS, X-Content-Type-Options, X-Frame-Options configured
- [ ] CORS restricted to known origins (never `*` in production)

## Data protection

- [ ] Sensitive fields excluded from API responses and logs
- [ ] HTTPS for all external communication

## Dependencies

- [ ] `npm audit` (or equivalent) run before release
- [ ] Lockfile committed; CI uses reproducible install
- [ ] New dependencies reviewed before adding

## AI / LLM (if present)

- [ ] Model output treated as untrusted (no eval/SQL/shell/innerHTML)
- [ ] Permissions enforced in code, not in system prompt
- [ ] Secrets and cross-tenant data kept out of prompts
- [ ] Tool permissions scoped; destructive actions require confirmation

## OWASP Top 10 quick reference

| # | Vulnerability | Prevention |
|---|---------------|------------|
| 1 | Broken access control | Auth + ownership checks on every endpoint |
| 2 | Cryptographic failures | HTTPS, strong hashing, no secrets in code |
| 3 | Injection | Parameterized queries, input validation |
| 4 | Insecure design | Threat modeling before coding |
| 5 | Security misconfiguration | Headers, minimal permissions, audit deps |
| 6 | Vulnerable components | Dependency audit, keep deps updated |
| 7 | Auth failures | Strong passwords, rate limiting, sessions |
| 8 | Data integrity failures | Verify updates, signed artifacts |
| 9 | Logging failures | Log security events, not secrets |
| 10 | SSRF | Validate/allowlist URLs, restrict outbound |
