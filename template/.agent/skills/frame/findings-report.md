# Frame: findings report

Shared output contract for audit-style skills (`leanagentkit-review`,
`leanagentkit-security`, `leanagentkit-performance`). Read only when producing
a structured findings report — not on every session.

## Severity labels

| Label | Meaning | Author action |
|-------|---------|---------------|
| **Critical** | Blocks merge / release | Must fix |
| **Required** | Real issue, not cosmetic | Must fix before merge |
| **Suggestion** | Worth considering | Optional |
| **Nit** | Style preference | Optional — author may ignore |
| **FYI** | Context only | No action |

Lead with Critical and Required findings. Order by leverage, not file order.

## Report template

```markdown
## [Skill name] report

**Scope:** <files, feature, or area reviewed>
**Verdict:** APPROVE | REQUEST CHANGES | FAIL

### Summary
<1–2 sentences>

### Critical
- [location] <finding> — <recommended fix>

### Required
- [location] <finding> — <recommended fix>

### Suggestions
- [location] <finding>

### What's done well
- <at least one positive observation>

### Verification
- Tests: <pass/fail/observations>
- Build: <pass/fail>
- Manual check: <if applicable>
```

## Rules

- Every Critical/Required finding cites a file/location and proposes a fix.
- Do not rubber-stamp — evidence of review required.
- Quantify impact when possible ("N+1 adds ~50ms per row").
- Acknowledge good practices — specific praise, not generic "LGTM".
