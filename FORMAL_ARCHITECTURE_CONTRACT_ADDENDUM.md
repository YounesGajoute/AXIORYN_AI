# AXIORYN AI — Formal Architecture Contract Addendum
**Status:** PROPOSED / GOVERNANCE ONLY
**Baseline:** GOV-1.0
**Implementation authorization:** NOT GRANTED

## Purpose
This addendum extends the architecture governance package with technology-neutral contract details that remain proposal-level only. It defines decisions that should be formalized before any implementation or integration authorization.

## 1. Versioned API payload schemas (proposed)
### 1.1 Common envelope
`version`: string
`correlation_id`: string
`tenant_id`: string
`actor_id`: string
`request_id`: string
`timestamp_utc`: ISO 8601
`source_component`: string
`target_component`: string
`policy_context`: object
`payload`: object

**Purpose**
- standardize message exchange and auditability
- enable correlation across orchestration, approvals, and execution

**Open decisions**
- exact schema versioning rules
- required fields by operation type

### 1.2 Request/response contracts
- All request/response operations must include correlation and tenant identifiers.
- Non-success responses must include policy code, error code, retryable flag, and actionability guidance.
- A payload must declare whether it is read-only, side-effecting, or approval-controlled.

## 2. Event envelope and correlation identifiers
### Proposed event envelope
`event_id`
`event_type`
`event_version`
`correlation_id`
`causation_id`
`tenant_id`
`actor_id`
`source_component`
`target_component`
`occurred_at_utc`
`severity`
`status`
`payload`

**Requirements**
- Correlation must flow across workflow steps, approvals, and retries.
- Event provenance must identify the source policy, user, or agent.
- Audit logs must be partitionable by tenant and actor.

## 3. Task lifecycle state machine (proposed)
`NEW -> QUEUED -> RUNNING -> WAITING_FOR_APPROVAL -> APPROVED -> EXECUTING -> COMPLETED`
`NEW -> QUEUED -> RUNNING -> WAITING_FOR_APPROVAL -> REJECTED -> CLOSED`
`NEW -> QUEUED -> RUNNING -> FAILED -> RETRY_SCHEDULED -> RUNNING`
`NEW -> QUEUED -> RUNNING -> BLOCKED -> REQUIRES_OWNER_DECISION`
`NEW -> QUEUED -> RUNNING -> CANCELLED -> CLOSED`

**Semantics**
- Task state transitions must be auditable.
- Approval actions must be explicit and recorded separately.
- Retry state must preserve original intent and correlation.

## 4. Retry, timeout, idempotency, and dead-letter semantics
- Retry policies are proposed and must remain owner-approved.
- Idempotency keys are required for all side-effecting requests and external writes.
- Timeouts and budgets must be enforced per task category.
- Dead-letter handling must preserve evidence and route to human review.

**Proposed policy**
- Retry on transient failure only.
- No silent duplicate side effects.
- Dead-letter on repeated failure or policy violation.

## 5. Budget and quota enforcement contracts
- Each workflow must declare a maximum execution budget.
- Model choice and token usage must be tracked by actor, tenant, and workflow.
- Quota breaches must trigger pause, escalation, or manual approval.
- Proposed values remain TBD_PENDING_OWNER_APPROVAL.

## 6. Error taxonomy
### Categories
- POLICY_BLOCKED
- AUTHORIZATION_DENIED
- VALIDATION_FAILED
- EXTERNAL_PROVIDER_FAILURE
- RETRYABLE_FAILURE
- NON_RETRYABLE_FAILURE
- RATE_LIMITED
- TIMEOUT
- HUMAN_APPROVAL_REQUIRED
- DEAD_LETTER

**Requirement**
- Errors must be machine-readable and mapped to action guidance.

## 7. Audit event contracts
Each audit event must include:
- event_id
- tenant_id
- actor_id
- component
- action
- policy_version
- result
- timestamp_utc
- correlation_id
- evidence_uri or reference

Audit events must cover:
- task creation
- policy decision
- approval grant or denial
- connector attempt
- external response
- error handling
- completion or closure

## 8. Proposed acceptance criteria for contract governance
- All tasks have correlation and tenant identifiers.
- Every approval gate is logged and tied to a policy reference.
- All external side effects are blocked unless an approved policy path exists.
- Retries do not duplicate state.
- Dead-letter and failure paths are explicit and visible to operators.

## Open architecture decisions
- Exact payload schema norms remain TBD_PENDING_OWNER_APPROVAL.
- Event retention and storage rules remain TBD_PENDING_OWNER_APPROVAL.
- Retry budgets and task dead-letter thresholds remain TBD_PENDING_OWNER_APPROVAL.
- Whether some workflows may bypass human approval under narrow conditions remains TBD_PENDING_OWNER_APPROVAL.

## Acceptance status
This formal contract addendum is PROPOSED and may be used for governance review only. It does not authorize implementation or integration activation.
