# AXIORYN AI — B-002 Requirements Traceability Matrix
**Task:** B-002-DOCUMENTATION-PACKAGE  
**Status:** PROPOSED / GOVERNANCE ONLY  
**Governance baseline:** GOV-1.0

## Scope and preservation rules
- Original requirements preserved: `R-001` through `R-026`
- Original backlog preserved: `B-001` through `B-022`
- Proposed Sales Manager requirements remain `PROPOSED` and are not accepted by this package
- No implementation authorization is implied by this matrix

## Original requirement traceability

| Requirement ID | Short description | Related use case(s) | Backlog dependency | Acceptance criteria | Verification method | Status |
|---|---|---|---|---|---|---|
| R-001 | Core module boundaries and ownership | UC-B002-12 | B-005, B-006 | Interface contracts, restricted runtime ownership | Architecture review | DRAFT |
| R-002 | Agent identity, permissions, budgets | UC-B002-12 | B-007 | Deny-by-default enforcement and budget constraints | Policy and security review | DRAFT |
| R-003 | External write approvals and idempotency | UC-B002-06, UC-B002-07, UC-B002-08 | B-008, B-017 | All external actions require policy review and approval | Negative-path and replay tests | DRAFT |
| R-004 | Accounts and contacts provenance | UC-B002-01, UC-B002-02, UC-B002-03, UC-B002-05 | B-010 | Provenance, retention, suppression state | Data model validation | DRAFT |
| R-005 | CRM lifecycle support | UC-B002-09 | B-011 | Duplicate detection and lifecycle management | Scenario tests | DRAFT |
| R-006 | Approved research sources | UC-B002-01, UC-B002-02, UC-B002-04 | B-013 | Source constraints and provenance review | Policy validation | DRAFT |
| R-007 | Buying committee representation | UC-B002-03 | B-014 | Stakeholder roles and evidence mapping | Scenario tests | DRAFT |
| R-008 | Competitor analysis with confidence labels | UC-B002-02 | B-015 | Source links and uncertainty records | Research evaluation set | DRAFT |
| R-009 | LinkedIn marketing via approved flows only | UC-B002-06, UC-B002-07 | B-003, B-019 | Policy-compliant workflow and user approval | Platform terms review + auth tests | DRAFT |
| R-010 | Personalized outreach anchored in approved sources | UC-B002-07 | B-016 | Evidence-linked messaging and uncertainty labeling | Evaluation and prompt-injection tests | DRAFT |
| R-011 | Follow-up policy and quiet windows | UC-B002-10 | B-018 | Opt-out and frequency enforcement | Policy + opt-out tests | DRAFT |
| R-012 | Optional CRM sync adapter | UC-B002-09 | B-020 | Resilience, idempotency, and failure handling | Contract and reconciliation tests | DRAFT |
| R-013 | Least privilege and deletion policy | UC-B002-09 | B-009, B-010 | Access log, retention, and deletion procedure | Security and deletion tests | DRAFT |
| R-014 | Operator inspection of state and audit | UC-B002-11, UC-B002-12 | B-012, B-017 | Reviewable task and approval records | UI acceptance test | DRAFT |
| R-015 | Task traceability, cancellation, retries | UC-B002-12 | B-007 | Trace IDs and dead-letter handling | Fault injection tests | DRAFT |
| R-016 | Evaluation for fabricated sources and misuse | UC-B002-02, UC-B002-04 | B-021 | Detection of invalid or fabricated evidence | Evaluation report | DRAFT |
| R-017 | Secret management and masked logs | UC-B002-12 | B-009 | No secrets in logs or code | Secret scan and logging review | DRAFT |
| R-018 | Backup, observability, restore proof | UC-B002-12 | B-022 | Restore and rollback evidence | Restore + rollback evidence | DRAFT |
| R-019 | Release includes reproducible tests and owner sign-off | UC-B002-11 | B-004 | Release signoff and reproducibility evidence | Release checklist review | DRAFT |
| R-020 | External connectors disabled by default | UC-B002-06, UC-B002-07, UC-B002-08 | B-003, B-019 | Approved scope and credentials only | Security and policy review | DRAFT |
| R-021 | Human approval workflow for high-risk actions | UC-B002-08 | B-017 | Approval decision recorded and mapped to policy | Approval-flow review | DRAFT |
| R-022 | Initial governance and data handling | UC-B002-05, UC-B002-06, UC-B002-11 | B-001, B-002 | Policy model and owner-approved boundaries | Governance review | DRAFT |
| R-023 | Financial control and reporting | UC-B002-05, UC-B002-11 | B-024, B-030 | Budget and reporting boundaries | Budget review and reporting validation | DRAFT |
| R-024 | Decision and evidence transparency | UC-B002-02, UC-B002-11 | B-012, B-021 | Every result marks fact, estimate, and uncertainty | Scenario validation | DRAFT |
| R-025 | Change governance and reviewability | UC-B002-12 | B-003, B-006 | Reviewability of change requests and overrides | Audit evidence review | DRAFT |
| R-026 | Performance, privacy, and source compliance for commercial tasks | UC-B002-01, UC-B002-07, UC-B002-11 | B-019, B-020 | Compliance evidence and operational cutoff checks | Policy audit | DRAFT |

## Proposed Sales Manager requirements traceability
These items are proposal-only and remain deliberately unapproved.

| Proposed ID | Proposal summary | Related use case(s) | Proposed backlog | Status |
|---|---|---|---|---|
| SM-REQ-001 | Sales strategy governance and version history | UC-B002-01, UC-B002-03, UC-B002-05 | B-023 | PROPOSED |
| SM-REQ-002 | Marketing decision engine and channel policy | UC-B002-02, UC-B002-06, UC-B002-07 | B-024 | PROPOSED |
| SM-REQ-003 | Campaign planning lifecycle and gates | UC-B002-05, UC-B002-06 | B-025 | PROPOSED |
| SM-REQ-004 | Explainable lead prioritization | UC-B002-04 | B-026 | PROPOSED |
| SM-REQ-005 | Agent assignment under Core policy | UC-B002-12 | B-027 | PROPOSED |
| SM-REQ-006 | Result validation and escalation | UC-B002-07, UC-B002-08, UC-B002-12 | B-028 | PROPOSED |
| SM-REQ-007 | Sales operations workflow model | UC-B002-09, UC-B002-10 | B-029 | PROPOSED |
| SM-REQ-008 | Commercial budget policy | UC-B002-05 | B-030 | PROPOSED |
| SM-REQ-009 | Commercial reporting metrics and provenance | UC-B002-11 | B-031 | PROPOSED |
| SM-REQ-010 | Control Center views and gated actions | UC-B002-11, UC-B002-12 | B-032 | PROPOSED |

## Backlog dependency summary

| Backlog ID | Dependency reference | Requirement(s) |
|---|---|---|
| B-001 | Governance and repository inventory | R-022 |
| B-002 | Scope and owner decision gate | R-022 |
| B-003 | Integration policy review | R-009, R-020 |
| B-004 | Release planning and quality gates | R-019 |
| B-005 | Architecture and module boundary | R-001 |
| B-006 | Security, policy, and review model | R-001 |
| B-007 | Task lifecycle and execution budget | R-002, R-015 |
| B-008 | External side-effect approval | R-003 |
| B-009 | Secrets and credentials handling | R-013, R-017 |
| B-010 | Retention and suppression policy | R-004, R-013 |
| B-011 | CRM lifecycle and duplicates | R-005 |
| B-012 | Operator visibility | R-014 |
| B-013 | Approved research sources | R-006 |
| B-014 | Buying committee representation | R-007 |
| B-015 | Competitor analysis | R-008 |
| B-016 | Outreach drafting | R-010 |
| B-017 | Approval and override workflow | R-003, R-014, R-021 |
| B-018 | Follow-up/quiet-window policy | R-011 |
| B-019 | External marketing policy and compliance | R-009, R-020 |
| B-020 | CRM adapter resilience | R-012 |
| B-021 | Evaluation and quality checks | R-016 |
| B-022 | Recovery and restore evidence | R-018 |
| B-023–B-032 | Proposed Sales Manager governance additions | SM-REQ-001–SM-REQ-010 |

## Verification methods to be used in later implementation phases
- Architecture review
- Negative-path validation
- Data provenance review
- Policy and security audit
- Scenario tests for lead and CRM flows
- Replay and idempotency tests
- Restore/rollback evidence
- Approval-gate validation

## Requirements acceptance checklist
- [ ] Original requirements remain intact and unchanged
- [ ] Proposed Sales Manager additions are visibly labeled PROPOSED
- [ ] Each requirement maps to either a backlog item or use case
- [ ] Verification method is defined for each requirement family
- [ ] No requirement is treated as implemented without explicit owner approval
