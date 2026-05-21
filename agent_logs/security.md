# Security Analysis & Findings

## 2026-05-14: [security]
### Finding
`npm audit --audit-level=moderate` reports 4 moderate dependency advisories after MVP install.

**Severity:** Medium

**Status:** Open

**Mitigation:**
- Advisories affect `ai`, `jsondiffpatch`, and `next` transitive `postcss`.
- npm suggested fixes require breaking upgrades, so no forced audit fix was applied during MVP build.

***

## 2026-05-21: [security]
### Finding
API Key to model provider can be exhausted if an IP sends excessive requests to `/api/match`.

**Severity:** Medium

**Status:** Mitigated

**Mitigation:**
- Implemented in-memory IP-based rate limiting on the POST `/api/match` endpoint.
- Default limit is set to 3 requests per 10 minutes.
- Returns HTTP 429 Too Many Requests with a `Retry-After` header when limit is exceeded.

***

## [Date]: [Category]
### Finding
[Description of security issue or analysis]

**Severity:** [Critical / High / Medium / Low]

**Status:** [Open / Mitigated / Monitoring]

**Mitigation:**
- [Action taken]
- [Action taken]

***
