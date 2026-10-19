# AXIORYN AI — Master Requirements
**Baseline:** GOV-1.0 | **Status:** Draft for owner validation

## Traceability conventions
Priority: P0 critical, P1 high, P2 medium. State: CONFIRMED_SCOPE (capability requested, details pending), PROPOSED, BLOCKED. Each item needs an acceptance test and evidence before DONE.

| ID | Requirement | Priority | State | Acceptance evidence |
|---|---|---|---|---|
| CORE-001 | Modular platform and module registration | P0 | CONFIRMED_SCOPE | Interface contract and integration tests |
| CORE-002 | Agent orchestration with bounded permissions | P0 | PROPOSED | Workflow tests and policy enforcement |
| CORE-003 | Secrets, authentication and authorization | P0 | PROPOSED | Threat review and security tests |
| CORE-004 | Audit logs, tracing and operational telemetry | P0 | PROPOSED | Sample trace and retention policy |
| CORE-005 | Provider-neutral model/integration adapters | P1 | PROPOSED | Adapter contract tests |
| SALES-001 | Industrial B2B lead discovery | P0 | CONFIRMED_SCOPE | Qualified lead examples with provenance |
| SALES-002 | Buying committee mapping | P1 | CONFIRMED_SCOPE | Role and relationship mapping tests |
| SALES-003 | CRM integration and synchronization | P0 | CONFIRMED_SCOPE | Conflict, retry and idempotency tests |
| SALES-004 | Competitor intelligence | P1 | CONFIRMED_SCOPE | Sourced competitor briefs |
| SALES-005 | LinkedIn marketing workflow | P1 | CONFIRMED_SCOPE | Compliant workflow review |
| SALES-006 | Personalized outreach drafting | P1 | CONFIRMED_SCOPE | Human-approved sample messages |
| SALES-007 | Follow-up planning and tracking | P1 | CONFIRMED_SCOPE | State transition tests |
| NFR-001 | Privacy, consent and data minimization | P0 | PROPOSED | DPIA/legal review where applicable |
| NFR-002 | Reliability, recovery and safe retries | P0 | PROPOSED | Failure-injection results |
| NFR-003 | Performance and cost budgets | P1 | PROPOSED | Owner-approved SLOs and load results |
| NFR-004 | Test coverage and CI quality gates | P0 | PROPOSED | CI artifacts and test report |
| NFR-005 | Human approval before external side effects | P0 | PROPOSED | Approval gate tests |

## Open questions
Target users and languages; CRM provider; LinkedIn permitted integration method; jurisdictions and legal basis; model/provider selection; hosting; data retention; roles and permissions; service-level objectives; budget; initial MVP boundaries.

## Completion rule
No requirement becomes ACCEPTED without linked implementation commit, test result, reviewer approval and updated project state.

## Additive CAI Sales Manager requirements proposal — GOV-1.0 Revision 3 candidate

This section proposes new IDs only. It does not renumber or replace the 26
existing requirements (`R-001`–`R-026`) in the Revision 2 master state.
All additions are `PROPOSED`, pending owner review; no acceptance evidence exists
yet. These proposals describe business capabilities of the dedicated CAI Sales
Manager, not new Core runtime authorities. The `SM-REQ-*` namespace is
supplemental to, and does not overwrite, the
existing `CORE-*`, `SALES-*` or `NFR-*` identifiers in this document. Those
readable capability identifiers are not asserted to be a one-to-one mapping to
the master state's `R-*` records; retain both sets until the owner approves a
single canonical RTM and explicit crosswalk.

### Sales Manager capability gap analysis

The existing Revision 2 `R-001`–`R-026` set establishes platform controls and
Sales capabilities but does not explicitly specify the following Sales Manager
commercial decision functions. Related existing requirements are references for
traceability, not proof that these functions are fully covered or approved.

| Capability | Related existing coverage | Remaining requirement gap | Proposed ID |
|---|---|---|---|
| Sales Strategy | R-004–R-010, R-022, R-023 | Owner-approved commercial objectives, constraints, decision rights, provenance, versioning and review | SM-REQ-001 |
| Marketing Decision Engine | R-003, R-006, R-009, R-020 | Commercial selection/recommendation criteria and explicit separation from policy enforcement and execution | SM-REQ-002 |
| Campaign Planning | R-003, R-009–R-011, R-022 | Campaign proposal structure, lifecycle, dependencies, risk and budget linkage before execution | SM-REQ-003 |
| Lead Prioritization | R-004, R-006–R-008, R-016 | Owner-approved ranking factors/thresholds and explainable, evidence-linked uncertainty handling | SM-REQ-004 |
| Agent Assignment | R-001, R-002, R-015 | Sales-domain routing and eligibility decisions, separately constrained by Core permissions | SM-REQ-005 |
| Result Validation | R-003, R-016, R-019, R-023 | Sales-task acceptance rubric and incomplete/inconclusive/escalation outcomes | SM-REQ-006 |
| Sales Operations | R-003, R-005, R-011, R-014, R-015 | Cross-workflow commercial lifecycle coordination, including pause, cancellation and escalation | SM-REQ-007 |
| Budget Management | R-002, R-022 | Commercial allocations, forecasts, owner-set limits, variance thresholds and stop/escalation decisions | SM-REQ-008 |
| Reporting | R-004, R-014, R-019, R-023 | Sales metrics and reports with definitions, source lineage, timeframe and fact/estimate/AI-summary distinctions | SM-REQ-009 |
| Control Center | R-003, R-014, R-019, R-023 | Role-authorized unified visibility across Sales Manager decisions and gated controls, beyond generic operator inspection | SM-REQ-010 |

| ID | Requirement proposal | Priority | State | Related master-state requirements | Acceptance evidence to be defined and gathered | Proposed backlog |
|---|---|---|---|---|---|---|
| SM-REQ-001 | CAI Sales Manager SHALL translate owner-approved commercial objectives and constraints into a versioned Sales Strategy, retaining provenance, assumptions, review date and approval state; it SHALL not change owner-approved goals autonomously. | P0 | PROPOSED | R-004, R-005, R-006, R-008, R-009, R-010, R-022, R-023 | Owner-approved strategy scenarios; policy-boundary and version-history review | B-023 |
| SM-REQ-002 | The Marketing Decision Engine SHALL recommend whether, where and when to conduct marketing activity using approved objectives, channel permissions, audience constraints, evidence and explicit human-approval gates; it SHALL not initiate external activity. | P0 | PROPOSED | R-003, R-006, R-009, R-020 | Recommendation scenarios; denied/approval-required cases; channel-permission review | B-024 |
| SM-REQ-003 | Campaign Planning SHALL create reviewable campaign proposals with objective, audience, channel, content plan, schedule, dependencies, budget estimate, risks and approval state; planned work SHALL remain distinct from scheduled or executed work. | P0 | PROPOSED | R-003, R-009, R-010, R-011, R-022 | Plan schema and lifecycle scenarios; boundary tests for draft/approved/scheduled/executed states | B-025 |
| SM-REQ-004 | Lead Prioritization SHALL produce explainable, evidence-linked recommendations using owner-approved factors and thresholds; missing, stale or uncertain evidence SHALL be surfaced and SHALL NOT be represented as verified fact. | P0 | PROPOSED | R-004, R-006, R-007, R-008, R-016 | Owner-approved scoring policy, explanation and uncertainty scenarios, bias/quality review | B-026 |
| SM-REQ-005 | CAI Sales Manager Agent Assignment SHALL route bounded work to eligible specialist agents by capability, permission, workload and task policy; assignment SHALL be auditable and SHALL NOT grant permissions or bypass Core authorization. | P0 | PROPOSED | R-001, R-002, R-015 | Assignment/denial cases, policy separation evidence, audit review | B-027 |
| SM-REQ-006 | Result Validation SHALL assess agent outputs against versioned task-specific schemas, evidence/provenance requirements, quality criteria and safety policy; failed or inconclusive validation SHALL remain non-complete and require retry, escalation or human review. | P0 | PROPOSED | R-003, R-016, R-019, R-023 | Approved validation rubric and positive, negative, inconclusive and escalation scenarios | B-028 |
| SM-REQ-007 | CAI Sales Manager Sales Operations SHALL coordinate approved sales workflows and lifecycle state across research, accounts, campaigns, follow-up and opportunities while enforcing suppression, pause, cancellation and escalation rules through Core policy controls. | P0 | PROPOSED | R-003, R-005, R-011, R-014, R-015 | State-transition scenarios, suppression/cancellation evidence, operator review | B-029 |
| SM-REQ-008 | CAI Sales Manager Budget Management SHALL maintain owner-approved commercial and execution limits, estimates, actuals and forecasts by campaign/task/period; it SHALL enforce configured stop/escalation thresholds and shall not authorize spend or external commitments. | P0 | PROPOSED | R-002, R-022 | Owner-signed limits and reconciliation/threshold scenarios; no thresholds are set in this proposal | B-030 |
| SM-REQ-009 | Reporting SHALL distinguish measured facts, model-generated summaries, estimates and unknowns; each metric SHALL identify its definition, source, time range and applicable approval state. | P1 | PROPOSED | R-004, R-014, R-019, R-023 | Owner-approved metric dictionary, source lineage and report reconciliation | B-031 |
| SM-REQ-010 | The Control Center SHALL provide role-authorized visibility into strategy, campaigns, leads, assignments, workflow state, validation, budgets, approvals and audit references; actions with external effects SHALL invoke Core policy and approval gates. | P0 | PROPOSED | R-003, R-014, R-019, R-023 | Owner-approved role/action matrix, accessibility review, read-only and gated-action scenarios | B-032 |

### Traceability and governance notes

- The additions are candidates for a versioned requirements revision after owner
  approval; their proposed IDs are stable labels for review, not acceptance.
- Existing requirements remain unchanged. In particular, Core authorization and
  execution controls continue to be governed by existing requirements such as
  `R-001`–`R-003`, `R-014`–`R-020`; these new requirements add Sales Manager
  business decision responsibilities rather than duplicate Core runtime
  responsibilities.
- Proposed backlog links `B-023`–`B-032` are additive candidates after the
  existing Revision 2 range `B-001`–`B-022`. They are not present in the
  published Revision 1 repository state and are not authorized implementation
  tickets.
