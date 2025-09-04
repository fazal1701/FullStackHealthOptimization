# Privacy Posture: HIPAA Alignment & Data Security

## PHI Minimization
- Only essential fields are sent to the client; all PHI is minimized in API responses.
- Data is partitioned by user and role; no cross-user data exposure.

## Access Controls
- Role-based access enforced at API and DB layers (patient, clinician, admin).
- Row-level security (RLS) policies in Postgres restrict access to only authorized users.
- All API endpoints require signed requests (HMAC, stubbed in dev).

## Audit Logging
- All access to PHI and sensitive actions are logged in the audit_logs table.
- Audit triggers record user, action, timestamp, and affected data.
- Logs are immutable and reviewed for suspicious activity.

## Compliance Posture
- Platform is designed for HIPAA alignment, with technical and administrative safeguards.
- Data in transit is encrypted (TLS, enforced in production).
- No secrets or PHI in client bundles; HttpOnly cookies for session tokens.
- Strict Content Security Policy (CSP), Referrer-Policy, and Permissions-Policy headers.

## Monitoring & Review
- Regular reviews of access logs and RLS policies.
- Incident response plan in place for any suspected breach.

---

*This document describes the privacy and security posture of the Health Optimization Platform as of the current release. For questions, contact the compliance lead.* 