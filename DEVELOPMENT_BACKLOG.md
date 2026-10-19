# AXIORYN AI — Development Backlog
**Baseline:** GOV-1.0 | **Rule:** No implementation before G0 approval.

| ID | Task | Priority | Depends on | State | Definition of done |
|---|---|---|---|---|---|
| GOV-001 | Validate charter and product scope | P0 | Owner input | OPEN | Signed-off scope |
| GOV-002 | Read-only repository inventory | P0 | Repository access | BLOCKED | Tree, stack, tests, risks and evidence |
| GOV-003 | Reconcile master state and agent report | P0 | Source files | OPEN | Revision-consistent status |
| GOV-004 | Validate requirements and acceptance tests | P0 | GOV-001 | OPEN | Owner-approved RTM |
| GOV-005 | Review architecture and write ADRs | P0 | GOV-002, GOV-004 | BLOCKED | Approved ADRs |
| GOV-006 | Define security, privacy and compliance baseline | P0 | GOV-004 | OPEN | Threat model and policies |
| GOV-007 | Approve MVP release scope and quality gates | P0 | GOV-004, GOV-005 | BLOCKED | G0 approval |
| CORE-101 | Core interfaces and module boundaries | P0 | GOV-007 | NOT AUTHORIZED | Reviewed code and tests |
| CORE-102 | Auth, policy and audit foundation | P0 | CORE-101, GOV-006 | NOT AUTHORIZED | Security tests |
| CORE-103 | Agent workflow orchestration | P0 | CORE-101, CORE-102 | NOT AUTHORIZED | Workflow tests |
| SALES-101 | Lead discovery MVP | P0 | CORE-103 | NOT AUTHORIZED | Provenance-backed tests |
| SALES-102 | CRM integration MVP | P0 | CORE-102, GOV-006 | NOT AUTHORIZED | Contract and sync tests |
| SALES-103 | Buying committee and intelligence | P1 | SALES-101 | NOT AUTHORIZED | Scenario tests |
| SALES-104 | Outreach drafting and approval | P1 | SALES-101, CORE-102 | NOT AUTHORIZED | Approval-flow tests |
| SALES-105 | Follow-up tracking | P1 | SALES-102, SALES-104 | NOT AUTHORIZED | State transition tests |
| REL-101 | End-to-end, security and recovery verification | P0 | MVP features | NOT AUTHORIZED | Evidence pack |
| REL-102 | Production release approval | P0 | REL-101 | NOT AUTHORIZED | Signed checklist |

## Agent execution rule
One bounded task per prompt, with explicit permitted paths, prohibited changes, acceptance criteria and evidence requirements. Stop when prerequisites are absent.

## Additive CAI Sales Manager backlog proposal — not authorized

The Revision 2 master state preserves its existing 22 ticket IDs, `B-001` through
`B-022`. The rows below are proposed additions only; they do not change the
status or scope of those tickets and must not be treated as implementation
authorization. They depend on owner decisions and prerequisite governance work.

| ID | Proposed task | Priority | Depends on | State | Definition of done (future evidence; not present) |
|---|---|---|---|---|---|
| B-023 | Define CAI Sales Manager Strategy decision model and owner policy | P0 | B-002, B-004, B-005 | PROPOSED | Owner-approved objectives, constraints, decision rights, versioning and review scenarios; traced to SM-REQ-001 |
| B-024 | Define Marketing Decision Engine policy and recommendation contract | P0 | B-003, B-005, B-023 | PROPOSED | Approved channel/source permissions, recommendation criteria, approval boundaries and negative scenarios; SM-REQ-002 |
| B-025 | Define Campaign Planning lifecycle and review gates | P0 | B-023, B-024, B-030 | PROPOSED | Approved plan fields, state transitions, budget linkage and no-execution-before-approval evidence; SM-REQ-003 |
| B-026 | Define explainable Lead Prioritization policy | P0 | B-002, B-010, B-013, B-023 | PROPOSED | Owner-approved factors/thresholds, evidence requirements, uncertainty handling and evaluation set; SM-REQ-004 |
| B-027 | Define CAI Sales Manager Agent Assignment and capability-routing policy | P0 | B-005, B-007, B-008, B-023 | PROPOSED | Agent capability/permission matrix, assignment rules, denial/escalation cases and audit evidence; SM-REQ-005 |
| B-028 | Define Result Validation rubric and lifecycle | P0 | B-007, B-016, B-021 | PROPOSED | Versioned output schemas and validation criteria; pass/fail/inconclusive scenarios and evidence lineage; SM-REQ-006 |
| B-029 | Define CAI Sales Manager Operations workflow/state model | P0 | B-010, B-017, B-018, B-023, B-025, B-027, B-028 | PROPOSED | Approved workflow map, pause/cancel/suppress/escalate policies and operator acceptance cases; SM-REQ-007 |
| B-030 | Define CAI Sales Manager commercial and execution Budget Management policy | P0 | B-002, B-023 | PROPOSED | Owner-approved ceilings, period/allocation rules, thresholds, variance and stop/escalation policy; SM-REQ-008 |
| B-031 | Define Sales Reporting metric dictionary and provenance | P1 | B-004, B-023, B-026, B-028, B-030 | PROPOSED | Owner-approved metrics, formulas, source lineage, uncertainty labels and reconciliation scenarios; SM-REQ-009 |
| B-032 | Define Control Center roles, views and gated actions | P0 | B-008, B-012, B-023, B-025, B-027, B-028, B-029, B-030, B-031 | PROPOSED | Approved role/action matrix, workflow views, accessibility requirements and policy-gated action scenarios; SM-REQ-010 |

These are governance/design tasks, not software work. No task may transition to
implementation until GOV-1.0 (or successor), G0, relevant ADRs and the specific
implementation scope are explicitly authorized by the owner.
