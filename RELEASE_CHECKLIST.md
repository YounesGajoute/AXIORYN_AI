# AXIORYN AI — Production Release Checklist
**Baseline:** GOV-1.0 | **Release:** TBD | **Status:** NOT READY

Each gate requires evidence URL/ID, reviewer and date. Unchecked P0 gates block release.

## Governance
- [ ] G0 initialization complete and owner-approved
- [ ] MVP scope and requirement acceptance criteria frozen
- [ ] Architecture decisions approved and deviations recorded
- [ ] Repository and build provenance verified

## Functional quality
- [ ] P0 requirements traced to passing tests
- [ ] End-to-end Sales Team workflows verified
- [ ] CRM sync and conflict/idempotency tests passed
- [ ] Human approval gates tested for external actions
- [ ] Error and edge-case scenarios covered

## Security and compliance
- [ ] Threat model reviewed; critical/high issues resolved or explicitly accepted
- [ ] Authentication, authorization and least-privilege tests passed
- [ ] Secrets and dependency scans passed
- [ ] Privacy, consent, retention and deletion controls approved
- [ ] External platform API terms and permissions verified
- [ ] Audit trail completeness validated

## Reliability and operations
- [ ] SLOs and alert thresholds approved
- [ ] Load, retry, timeout and recovery tests passed
- [ ] Backup and restore exercise completed
- [ ] Monitoring, logs and on-call ownership established
- [ ] Rollback procedure rehearsed
- [ ] Cost limits and rate limits enforced

## Deployment
- [ ] CI/CD reproducible and artifacts versioned
- [ ] Environment configuration reviewed
- [ ] Staging sign-off completed
- [ ] Release notes and runbooks prepared
- [ ] Final owner go/no-go recorded

## Decision record
Release version: TBD
Evidence package: TBD
Reviewer: TBD
Owner approval: PENDING
Decision: NO-GO until every mandatory gate is evidenced and approved.
