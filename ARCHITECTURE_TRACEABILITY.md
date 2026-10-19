# AXIORYN AI — Architecture Traceability
**Status:** PROPOSED / GOVERNANCE ONLY
**Baseline:** GOV-1.0
**Implementation authorization:** NOT GRANTED

## Scope
This matrix links the architecture governance package to the original requirements, proposed Sales Manager additions, B-002 use cases, NFRs, and backlog dependencies without claiming implementation status.

## Architecture contract traceability

| Architecture contract | Related requirement IDs | Related Sales Manager proposal IDs | Related use cases | Related NFRs | Backlog dependencies | Status |
|---|---|---|---|---|---|---|
| Core runtime | R-001, R-002, R-003, R-014, R-015, R-017, R-018, R-020, R-021, R-025 | SM-REQ-005, SM-REQ-006, SM-REQ-010 | UC-B002-08, UC-B002-11, UC-B002-12 | NFR-01, NFR-02, NFR-03, NFR-05, NFR-07, NFR-10, NFR-12, NFR-13 | B-005, B-006, B-007, B-008, B-009, B-017 | PROPOSED |
| CAI Sales Manager | R-004, R-005, R-006, R-007, R-008, R-009, R-010, R-011, R-023, R-024 | SM-REQ-001–SM-REQ-010 | UC-B002-01, UC-B002-02, UC-B002-03, UC-B002-04, UC-B002-05, UC-B002-06, UC-B002-07, UC-B002-10, UC-B002-11 | NFR-03, NFR-04, NFR-06, NFR-09, NFR-10, NFR-11, NFR-12 | B-002, B-003, B-004, B-023–B-032 | PROPOSED |
| Agent 01 leadership | R-001, R-021, R-024 | SM-REQ-001, SM-REQ-005, SM-REQ-007, SM-REQ-010 | UC-B002-05, UC-B002-11, UC-B002-12 | NFR-10, NFR-11, NFR-12 | B-023, B-025, B-029, B-032 | PROPOSED |
| Agent 09 specialist | R-004, R-011, R-016, R-024 | SM-REQ-006, SM-REQ-007 | UC-B002-04, UC-B002-10, UC-B002-12 | NFR-04, NFR-06, NFR-11 | B-014, B-018, B-026 | PROPOSED |
| Specialist task execution | R-002, R-015, R-021 | SM-REQ-005, SM-REQ-006 | UC-B002-12 | NFR-01, NFR-05, NFR-07 | B-007, B-017 | PROPOSED |
| Human approval and policy enforcement | R-003, R-021, R-025 | SM-REQ-006, SM-REQ-010 | UC-B002-06, UC-B002-07, UC-B002-08 | NFR-03, NFR-10, NFR-11 | B-008, B-017 | PROPOSED |
| Tool gateway and integration boundary | R-003, R-006, R-009, R-013, R-017, R-020 | SM-REQ-002, SM-REQ-005 | UC-B002-06, UC-B002-07, UC-B002-09 | NFR-02, NFR-03, NFR-08, NFR-13 | B-003, B-009, B-019, B-020 | PROPOSED |
| Audit and observability | R-014, R-015, R-018, R-019, R-025 | SM-REQ-009, SM-REQ-010 | UC-B002-11, UC-B002-12 | NFR-05, NFR-07, NFR-12 | B-004, B-012, B-017, B-022 | PROPOSED |
| CRM synchronization | R-004, R-005, R-012, R-013 | SM-REQ-007, SM-REQ-009 | UC-B002-09 | NFR-02, NFR-04, NFR-07 | B-010, B-011, B-020 | PROPOSED |
| Commercial campaign orchestration | R-023, R-024 | SM-REQ-002, SM-REQ-003, SM-REQ-008, SM-REQ-010 | UC-B002-05, UC-B002-06, UC-B002-07 | NFR-09, NFR-10, NFR-11, NFR-12 | B-023, B-024, B-025, B-030, B-032 | PROPOSED |

## Requirement-to-architecture alignment

| Requirement ID | Architecture contract(s) | Acceptance evidence concept | Verification method | Status |
|---|---|---|---|---|
| R-001 | Core runtime, Agent 01 leadership | Interface contract and ownership map | Architecture review | DRAFT |
| R-002 | Core runtime, specialist task execution | Permission-deny tests and budget enforcement | Security review | DRAFT |
| R-003 | Core runtime, human approval, tool gateway | Approval log and replay-safe side effects | Negative-path tests | DRAFT |
| R-004 | CAI Sales Manager, CRM synchronization | Provenance record and retention state | Data model validation | DRAFT |
| R-005 | CAI Sales Manager, CRM synchronization | Lifecycle and duplicate detection checks | Scenario tests | DRAFT |
| R-006 | CAI Sales Manager, tool gateway | Approved-source validation | Policy validation | DRAFT |
| R-007 | CAI Sales Manager | Buying committee role mapping | Scenario tests | DRAFT |
| R-008 | CAI Sales Manager | Competitor evidence labeling | Evaluation review | DRAFT |
| R-009 | CAI Sales Manager, tool gateway | Policy-compliant messaging path | Platform review | DRAFT |
| R-010 | CAI Sales Manager | Evidence-linked drafting check | Prompt and output validation | DRAFT |
| R-011 | CAI Sales Manager, Agent 09 specialist | Quiet-window and suppression policy | Policy tests | DRAFT |
| R-012 | CRM synchronization | Retry and conflict reconciliation | Contract tests | DRAFT |
| R-013 | Tool gateway, CRM synchronization | Secret and deletion policy review | Security audit | DRAFT |
| R-014 | Core runtime, audit and observability | Operator-visible trace records | UI and audit review | DRAFT |
| R-015 | Core runtime, specialist task execution | Trace ID and task lifecycle review | Fault injection tests | DRAFT |
| R-016 | Agent 09 specialist | Source integrity checks | Evaluation report | DRAFT |
| R-017 | Core runtime, tool gateway | Secret masking review | Secret scan | DRAFT |
| R-018 | Core runtime, audit and observability | Recovery and rollback evidence | Restore validation | DRAFT |
| R-019 | Audit and observability | Release checklist review | Release signoff | DRAFT |
| R-020 | Core runtime, tool gateway | Allowlist and gate validation | Security policy review | DRAFT |
| R-021 | Core runtime, human approval | Approval trace records | Approval-flow validation | DRAFT |
| R-022 | CAI Sales Manager, Core runtime | Governance boundary review | Governance review | DRAFT |
| R-023 | CAI Sales Manager, campaign orchestration | Budget policy and reporting boundary | Budget validation | DRAFT |
| R-024 | CAI Sales Manager, campaign orchestration | Evidence transparency review | Scenario validation | DRAFT |
| R-025 | Core runtime, audit and observability | Change governance evidence | Audit review | DRAFT |
| R-026 | CAI Sales Manager, tool gateway | Compliance and privacy checks | Policy audit | DRAFT |

## Proposed Sales Manager requirement traceability

| Proposed requirement ID | Related architecture contract(s) | Related use cases | Related NFRs | Backlog references | Status |
|---|---|---|---|---|---|
| SM-REQ-001 | CAI Sales Manager, Agent 01 leadership | UC-B002-01, UC-B002-03, UC-B002-05 | NFR-09, NFR-10, NFR-12 | B-023 | PROPOSED |
| SM-REQ-002 | CAI Sales Manager, campaign orchestration, tool gateway | UC-B002-02, UC-B002-06, UC-B002-07 | NFR-09, NFR-11 | B-024 | PROPOSED |
| SM-REQ-003 | Campaign orchestration | UC-B002-05, UC-B002-06 | NFR-09, NFR-10 | B-025 | PROPOSED |
| SM-REQ-004 | CAI Sales Manager | UC-B002-04 | NFR-06, NFR-09 | B-026 | PROPOSED |
| SM-REQ-005 | Agent 01 leadership, specialist execution, tool gateway | UC-B002-12 | NFR-01, NFR-07, NFR-12 | B-027 | PROPOSED |
| SM-REQ-006 | Agent 09 specialist, human approval | UC-B002-07, UC-B002-08, UC-B002-12 | NFR-10, NFR-11 | B-028 | PROPOSED |
| SM-REQ-007 | CAI Sales Manager, Agent 09 specialist | UC-B002-09, UC-B002-10 | NFR-04, NFR-11 | B-029 | PROPOSED |
| SM-REQ-008 | Campaign orchestration | UC-B002-05 | NFR-10, NFR-11 | B-030 | PROPOSED |
| SM-REQ-009 | Audit and observability, CRM synchronization | UC-B002-11 | NFR-05, NFR-12 | B-031 | PROPOSED |
| SM-REQ-010 | Core runtime, audit and observability, Agent 01 leadership | UC-B002-11, UC-B002-12 | NFR-05, NFR-12 | B-032 | PROPOSED |

## NFR mapping

| NFR ID | Architecture contract relationship | Notes |
|---|---|---|
| NFR-01 | Core runtime, specialist task execution | Identity and permission controls |
| NFR-02 | Core runtime, tool gateway | Isolation and enforcement |
| NFR-03 | Human approval, tool gateway | Policy and side-effects |
| NFR-04 | CAI Sales Manager, CRM synchronization | Data quality and correctness |
| NFR-05 | Audit and observability | Traceability and reviewability |
| NFR-06 | CAI Sales Manager, Agent 09 specialist | Decision quality and evidence |
| NFR-07 | Core runtime, specialist execution | Performance, resilience, and retry |
| NFR-08 | Tool gateway | External source governance |
| NFR-09 | CAI Sales Manager, campaign orchestration | Commercial strategy and operations |
| NFR-10 | Human approval, campaign orchestration | Human-in-the-loop approvals |
| NFR-11 | CAI Sales Manager, human approval | Business exception handling |
| NFR-12 | Audit and observability, Agent 01 leadership | Operational oversight and exceptions |
| NFR-13 | Tool gateway, Core runtime | Security/privacy and access control |

## Traceability to open architecture decisions
| Decision ID | Related requirement IDs | Related NFRs | Related architecture contracts | Related backlog items | Status |
|---|---|---|---|---|---|
| D-001 | R-001, R-002, R-014, R-015, R-021 | NFR-01, NFR-02, NFR-05, NFR-13 | Core runtime, audit and observability | B-005, B-006, B-007, B-017 | PROPOSED |
| D-002 | R-001, R-004, R-014, R-026 | NFR-02, NFR-04, NFR-13 | Core runtime, CAI Sales Manager, tool gateway | B-003, B-004, B-005 | PROPOSED |
| D-003 | R-001, R-002, R-003, R-021 | NFR-01, NFR-02, NFR-03, NFR-13 | Core runtime, human approval and policy enforcement | B-006, B-007, B-008 | PROPOSED |
| D-004 | R-003, R-021, R-025 | NFR-03, NFR-10, NFR-11, NFR-12 | Human approval and policy enforcement, audit and observability | B-008, B-017 | PROPOSED |
| D-005 | R-014, R-018, R-025 | NFR-05, NFR-12 | Audit and observability, Core runtime | B-004, B-012, B-017 | PROPOSED |
| D-006 | R-003, R-006, R-009, R-013, R-020 | NFR-02, NFR-03, NFR-08, NFR-13 | Tool gateway and integration boundary | B-003, B-009, B-019, B-020 | PROPOSED |
| D-007 | R-006, R-009, R-026 | NFR-08, NFR-09, NFR-13 | Tool gateway and integration boundary, CAI Sales Manager | B-003, B-019 | PROPOSED |
| D-008 | R-004, R-005, R-012, R-013 | NFR-02, NFR-04, NFR-07 | CRM synchronization, tool gateway | B-010, B-011, B-020 | PROPOSED |
| D-009 | R-004, R-013, R-026 | NFR-04, NFR-05, NFR-13 | CAI Sales Manager, tool gateway, audit and observability | B-003, B-004, B-020 | PROPOSED |
| D-010 | R-013, R-017, R-020 | NFR-02, NFR-05, NFR-13 | Tool gateway, Core runtime, audit and observability | B-003, B-009, B-020 | PROPOSED |
| D-011 | R-001, R-002, R-003, R-012, R-015, R-021 | NFR-01, NFR-03, NFR-05, NFR-07 | Core runtime, audit and observability, tool gateway | B-005, B-006, B-007, B-017 | PROPOSED |
| D-012 | R-023, R-024, R-025 | NFR-09, NFR-10, NFR-12 | Commercial campaign orchestration, audit and observability | B-023, B-024, B-025, B-030, B-032 | PROPOSED |

## Backlog dependency alignment

| Backlog ID | Related contract(s) | Related requirement(s) | Status |
|---|---|---|---|
| B-005 | Core runtime, CAI Sales Manager | R-001 | OPEN |
| B-006 | Core runtime | R-001 | OPEN |
| B-007 | Core runtime, specialist execution | R-002, R-015 | OPEN |
| B-008 | Human approval, tool gateway | R-003 | OPEN |
| B-009 | Tool gateway | R-013, R-017 | OPEN |
| B-010 | CAI Sales Manager, CRM synchronization | R-004, R-013 | OPEN |
| B-011 | CRM synchronization | R-005 | OPEN |
| B-012 | Audit and observability | R-014 | OPEN |
| B-013 | Tool gateway | R-006 | OPEN |
| B-014 | CAI Sales Manager, Agent 09 specialist | R-007 | OPEN |
| B-015 | CAI Sales Manager | R-008 | OPEN |
| B-016 | CAI Sales Manager | R-010 | OPEN |
| B-017 | Human approval, audit | R-003, R-014, R-021 | OPEN |
| B-018 | Agent 09 specialist | R-011 | OPEN |
| B-019 | Tool gateway | R-009, R-020 | OPEN |
| B-020 | CRM synchronization | R-012 | OPEN |
| B-021 | Agent 09 specialist | R-016 | OPEN |
| B-022 | Core runtime, audit | R-018 | OPEN |
| B-023–B-032 | Sales Manager contracts and campaigns | SM-REQ-001–SM-REQ-010 | PROPOSED |

## Gaps and unresolved architecture issues
- No approved technology stack or runtime implementation exists.
- No owner-approved external connector policy exists for LinkedIn or CRM activation.
- No final retention and deletion threshold is approved.
- No final cost ceiling or model-selection policy is approved.
- No explicit deployment environment or operational control baseline is approved.

## Acceptance statement
This traceability package is a documentation-only governance artifact. It does not approve implementation, external integrations, or proposed requirements.
