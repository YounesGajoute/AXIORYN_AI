# AXIORYN AI — B-002 Non-Functional Requirements
**Task:** B-002-DOCUMENTATION-PACKAGE  
**Status:** PROPOSED / PENDING OWNER APPROVAL  
**Governance baseline:** GOV-1.0

## Purpose
This document defines measurable, testable non-functional requirements for the proposed AXIORYN AI Sales Team and CAI Sales Manager operating model. All targets are proposed and SHALL be treated as `TBD_PENDING_OWNER_APPROVAL` unless explicitly approved by the owner in a later governance decision.

## Architecture constraint
Core remains the enforcement boundary for execution, permissions, approvals, connectors, and audit. Sales Manager remains the business decision owner within approved boundaries.

## Proposed NFR catalog

| ID | Requirement | Proposed target | Validation method | Status | Related requirements / use cases |
|---|---|---|---|---|---|
| NFR-01 | Authentication and authorization shall be deny-by-default and explicitly scoped to role, task, and capability. | `TBD_PENDING_OWNER_APPROVAL` | Policy review, deny-by-default tests, least-privilege access review | PROPOSED | R-001, R-002, R-003, UC-B002-12 |
| NFR-02 | Multi-tenant data isolation shall prevent cross-tenant view, mutation, or inference without explicit policy. | `TBD_PENDING_OWNER_APPROVAL` | Data isolation tests, access matrix review | PROPOSED | R-004, R-013, UC-B002-01, UC-B002-09 |
| NFR-03 | Security and privacy controls shall minimize personal-data exposure and protect source provenance. | `TBD_PENDING_OWNER_APPROVAL` | Privacy review, secure logging tests, data minimization audit | PROPOSED | R-013, R-017, R-020, UC-B002-07 |
| NFR-04 | Data retention and deletion controls shall support lawful retention, suppression, and deletion actions. | `TBD_PENDING_OWNER_APPROVAL` | Retention policy review, deletion test, suppression-check scenarios | PROPOSED | R-004, R-013, UC-B002-09 |
| NFR-05 | Auditability shall preserve actor, timestamp, object, decision, and correlation information for all task and approval events. | `TBD_PENDING_OWNER_APPROVAL` | Audit log integrity review, trace reconstruction tests | PROPOSED | R-014, R-015, R-018, UC-B002-12 |
| NFR-06 | Availability and recovery shall define a path to restore core services and approved workflows after interruption or partial outage. | `TBD_PENDING_OWNER_APPROVAL` | Failover review, restore drill, incident response validation | PROPOSED | R-015, R-018, UC-B002-12 |
| NFR-07 | Performance and scalability shall support expected sales-team workloads without degrading policy enforcement or approval throughput. | `TBD_PENDING_OWNER_APPROVAL` | Load test, queue-depth review, concurrency validation | PROPOSED | R-014, UC-B002-01, UC-B002-11 |
| NFR-08 | Reliability and idempotency shall prevent duplicate external writes and allow safe retry for transient failures. | `TBD_PENDING_OWNER_APPROVAL` | Retry/failure injection tests, duplicate-handling validation | PROPOSED | R-003, R-012, R-015, UC-B002-09 |
| NFR-09 | AI model routing and cost control shall retain policy-aware routing, traceable usage, and budget safeguards. | `TBD_PENDING_OWNER_APPROVAL` | Provider routing review, cost-limit tests, token/cost audit | PROPOSED | R-015, R-022, UC-B002-11 |
| NFR-10 | Observability shall provide task state, traceability, and operational health indicators across the Sales Team workflow. | `TBD_PENDING_OWNER_APPROVAL` | Logging, tracing, dashboard review, alert validation | PROPOSED | R-014, R-018, UC-B002-11, UC-B002-12 |
| NFR-11 | Human-in-the-loop approvals shall cover external side effects, sensitive content, and exception paths. | `TBD_PENDING_OWNER_APPROVAL` | Approval-flow test and negative-case validation | PROPOSED | R-003, R-009, R-011, UC-B002-07, UC-B002-08 |
| NFR-12 | Integration failure handling shall isolate outages and preserve audit state without silent data loss. | `TBD_PENDING_OWNER_APPROVAL` | Failure injection, dead-letter review, reconciliation scenarios | PROPOSED | R-012, R-015, UC-B002-09 |
| NFR-13 | Maintainability and extensibility shall keep a clear module boundary between Core and Sales Manager responsibilities. | `TBD_PENDING_OWNER_APPROVAL` | Architecture review, interface contract review, change-impact review | PROPOSED | R-001, R-014, R-015, UC-B002-12 |

## Validation expectations
Each NFR remains `PROPOSED` until owner-approved thresholds, owners, and verification criteria are accepted. The NFRs are intended to be measurable and testable, but the project must not treat any numerical or operational target as approved without explicit owner confirmation.

## Acceptance checklist for NFRs
- [ ] Each NFR has a measurable objective and verification method
- [ ] Each NFR is tied to a requirement or use case
- [ ] Proposed targets are explicitly labeled `TBD_PENDING_OWNER_APPROVAL`
- [ ] No NFR is treated as accepted implementation evidence before owner approval
- [ ] Core controls remain the policy boundary and source of truth for execution authority
