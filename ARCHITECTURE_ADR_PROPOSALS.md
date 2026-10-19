# AXIORYN AI — Proposed ADR Package
**Status:** PROPOSED / GOVERNANCE ONLY
**Baseline:** GOV-1.0
**Implementation authorization:** NOT GRANTED

## Purpose
This package collects decision-ready architectural proposals for future owner review. These ADRs remain proposed and are not accepted by this governance pass. They do not authorize implementation or external integration activation.

## ADR-001 — Runtime and orchestration architecture
**Status:** PROPOSED
**Decision domain:** Runtime orchestration and task execution

### Context
The system requires a shared orchestration runtime for multi-agent execution, policy enforcement, and auditability. The project must preserve the separation between Core technical execution and commercial domain decisions.

### Options considered
1. Shared single runtime with domain modules and policy checks
2. Parallel runtime for business orchestration outside Core
3. Hybrid approach with Core runtime plus delegated domain orchestrators

### Proposed decision
Option 1 is the preferred governance posture: a single technical runtime controlled by Core, with business domains such as Sales Manager consuming the runtime through approved contracts.

### Rationale
- Preserves architectural clarity
- Prevents duplicate orchestration authority
- Aligns with ADR-SM-001 accepted boundaries

### Consequences
- Requires strict contract definitions and policy boundaries
- Does not select a particular technology stack or deployment model

### Security implications
- Requires deny-by-default execution and explicit approval for side effects

### Owner approval status
PROPOSED — pending owner review

### Evidence references
- ADR-SM-001
- SYSTEM_ARCHITECTURE.md

## ADR-002 — Identity and multi-tenancy
**Status:** PROPOSED
**Decision domain:** Identity, permissions, and tenant boundary model

### Context
The first production module is a Sales domain workflow that may require multi-actor collaboration, account segregation, and approval controls.

### Options considered
1. Single-tenant with isolated per-actor scopes
2. Multi-tenant with explicit data isolation boundaries
3. Mixed model with tenant isolation only for regulated or sensitive records

### Proposed decision
Use tenant-aware identity and authorization boundaries with strict deny-by-default access. Multi-tenancy remains a future architecture decision pending owner approval.

### Rationale
- Protects commercially sensitive data
- Preserves traceability and least privilege
- Supports future module expansion

### Consequences
- Requires explicit data and account isolation rules
- Does not imply production deployment

### Security implications
- Identity boundaries, approval paths, and retention must be enforced before any data processing beyond governance review

### Owner approval status
PROPOSED — pending owner review

### Evidence references
- R-001, R-002, R-013, R-025

## ADR-003 — Persistence and task state
**Status:** PROPOSED
**Decision domain:** Data persistence and workflow durability

### Context
The platform may need durable task state, operation records, audit sequences, and recovery evidence.

### Options considered
1. Central durable task store with explicit state transitions
2. Distributed state model with event sourcing
3. File-system or local-state prototype without durable workflow history

### Proposed decision
Use durable task-state storage with explicit lifecycle records, replay-safe operations, and audit lineage; no technology selection is made in this documentation pass.

### Rationale
- Provides recoverability and operator visibility
- Supports idempotency and replay safety
- Aligns with governance evidence requirements

### Consequences
- Needs retention and deletion policy
- Requires owner-approved storage and retention thresholds

### Security implications
- Personal and account data handling requires policy review before production use

### Owner approval status
PROPOSED — pending owner review

### Evidence references
- R-014, R-015, R-018, B-007, B-022

## ADR-004 — AI model routing and cost control
**Status:** PROPOSED
**Decision domain:** Model selection and operational budget enforcement

### Context
The platform may route tasks across multiple models or providers to balance quality, cost, and capability.

### Options considered
1. Single model per task type
2. Multi-provider dynamic routing by capability and cost
3. Hybrid with approved fallback matrix

### Proposed decision
Model routing remains a policy-driven architecture decision. The system may route by capability, cost, and approval constraints, but no provider choice is approved in this package.

### Rationale
- Supports extensibility and vendor independence
- Allows future cost controls
- Keeps business policy separate from provider selection

### Consequences
- Requires cost ceilings and provider policy decisions
- Requires audit of model usage and output provenance

### Security implications
- Data residency and provider policy are unresolved and must be approved before production use

### Owner approval status
PROPOSED — pending owner review

### Evidence references
- R-017, R-019, R-026, SM-REQ-002, SM-REQ-009

## ADR-005 — External integration governance
**Status:** PROPOSED
**Decision domain:** Third-party connectors and policy-bound side effects

### Context
Plans include LinkedIn, CRM, marketing, and account-intelligence integrations. These require strict legal, platform, and technical controls.

### Options considered
1. No external connectors by default; enable only after policy approval
2. Connector gateway with allowlist and approval gate
3. Direct module connector access with limited policy checks

### Proposed decision
Only the Core-managed gateway is allowed for external access. No connector may be activated without owner-approved policy, platform authorization, and explicit approval gating.

### Rationale
- Preserves safety and auditability
- Keeps operations under addressable governance
- Aligns with R-003 and R-020

### Consequences
- Connector activation remains delayed until explicit approval
- No implementation authorization is granted by this document

### Security implications
- LinkedIn and personal-data sources require additional legal/platform review

### Owner approval status
PROPOSED — pending owner review

### Evidence references
- R-003, R-006, R-009, R-020, B-003, B-019

## ADR-006 — Deployment and operational controls
**Status:** PROPOSED
**Decision domain:** Hosting, release controls, and production safeguards

### Context
The project is still in governance/pre-implementation stage. Operational deployment controls must be defined before any future implementation.

### Options considered
1. Controlled staged deployment with explicit sign-off
2. Single environment for all work until governance completes
3. Production-like rehearsal environment prior to approval

### Proposed decision
Deployment remains out of scope until owner approval of governance baseline, ADRs, and release gates. No deployment action is approved by this package.

### Rationale
- Prevents premature production exposure
- Preserves separation of review and implementation

### Consequences
- No deployment status claim is made
- Release and quality gates remain TBD_PENDING_OWNER_APPROVAL

### Security implications
- Security baseline and auditable release evidence remain unresolved

### Owner approval status
PROPOSED — pending owner review

### Evidence references
- R-019, B-004, RELEASE_CHECKLIST.md

## ADR-SM-001 — Sales Manager authority and role boundaries
**Status:** ACCEPTED / Option 1
**Decision domain:** Sales domain architecture and commercial authority

### Context
The governance package must resolve whether commercial leadership is independent of Core runtime and whether duplicate orchestration roles are allowed.

### Decision
CAI Sales Manager owns commercial strategy, campaign planning, lead prioritization, and workflow coordination within owner-approved policy. Agent 01 is the bounded commercial leadership role inside CAI Sales Manager. Agent 09 remains a specialist. Core retains exclusive authority over technical execution, permissions, approvals, audit, and observability.

### Rationale
- Preserves one authority boundary for runtime execution
- Prevents duplicate orchestration authority
- Aligns with project governance and no-implementation rule

### Consequences
- Future implementation must preserve this separation
- No separate Executive Director or second runtime is approved

### Security implications
- Commercial decisions require approval gates and Core enforcement

### Owner approval status
ACCEPTED — Project Owner, 2026-10-19

### Evidence references
- DECISION_LOG.md
- SYSTEM_ARCHITECTURE.md
- PROJECT_STATUS.md

## Cross-ADR note
These ADR proposals are governance artifacts only and must not be treated as accepted implementations, deployment decisions, or product approvals. Any later acceptance requires explicit owner approval and a subsequent implementation authorization phase.
