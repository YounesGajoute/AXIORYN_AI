# AXIORYN AI — System Architecture
**Baseline:** GOV-1.0 | **Status:** PROPOSED, not approved

## Architecture principles
Modular Core with independently deployable or replaceable domain modules; least privilege; human control of external actions; observable, testable workflows; provider-neutral integration boundaries.

## Proposed logical components
```text
User / Admin Interface
        |
API / Identity / Authorization
        |
Workflow & Agent Orchestrator ---- Policy / Human Approval
        |
+-------+------------------+
| AXIORYN AI Core Services |
| Model adapters           |
| Tool / connector gateway |
| Audit / telemetry        |
| State / job management   |
+-------+------------------+
        |
Sales Team Module
  Lead discovery | Competitor intelligence
  Buying committees | CRM sync
  Outreach drafting | Follow-up tracking
        |
Approved External APIs / Data Stores
```

## Core contracts (proposed)
- AgentTask: id, actor, purpose, inputs, permitted tools, policy context, deadline.
- AgentResult: task id, outputs, evidence, costs, errors, approval status.
- Connector: capability discovery, scoped credentials, rate limits, idempotent operations.
- AuditEvent: actor, timestamp, operation, object reference, decision and correlation ID.

## Data and security
Use explicit tenant isolation if multi-tenancy is approved. Encrypt in transit and at rest; segregate secrets; minimize personal data; audit external operations. Define retention, deletion and access policies before production.

## Reliability
Durable jobs, retry/backoff, idempotency keys, dead-letter handling, timeouts and circuit breakers. External writes require policy checks and, where applicable, human approval.

## Architecture decision gates
ADR approval required for language/framework, storage, orchestration, model providers, CRM and LinkedIn integration, hosting, identity, tenancy and data residency.

## Branch policy (owner-approved)
`main` is the canonical project branch. `v1` is reserved for governance preparation and review. No implementation, commit, push, merge, reset, or branch switching is authorized by this instruction.

## Validation
No claim of repository conformance until a read-only inventory maps existing code to the proposed components. Do not begin implementation at this stage.

## Four-layer architecture decision — ADR-SM-001

**Status:** ACCEPTED by Project Owner, Option 1, 2026-10-19. This is an
architecture decision for logical responsibility boundaries, not an observed
implementation or authorization to implement.

```text
Layer 1 — Experience and Control Center
  Owner/operator views, review queues, reporting, configuration
                         |
Layer 2 — AXIORYN AI Core runtime
  Identity/context, task lifecycle, agent execution, tool gateway,
  policy/approval enforcement, audit, telemetry, quotas and shared services
                         |
Layer 3 — Sales domain and CAI Sales Manager
  Commercial strategy, marketing decisions, campaign plans, lead prioritization,
  task assignment intent, result acceptance criteria, sales operations,
  commercial budget policy and domain reporting
                         |
Layer 4 — Policy-enforced connectors and data boundaries
  Approved CRM/marketing/research capabilities, stores and external systems;
  connectors translate capabilities and cannot bypass Core policy
```

The layers describe responsibility boundaries, not deployment units or a
prescribed technology stack. Core services may be invoked by other business
modules; CAI Sales Manager is the dedicated first business orchestration
component and is implemented as domain logic using Core contracts. CAI Sales
Manager must not host a second agent runtime, identity system, authorization
engine, audit source of truth, or direct connector path.

### Core runtime versus commercial decisions

| Concern | AXIORYN AI Core runtime | CAI Sales Manager |
|---|---|---|
| Orchestration | Generic task dispatch, lifecycle, retries, cancellation, execution budgets and telemetry | Chooses commercial objective, workflow, sequence, priorities and domain-specific next action within approved policy |
| Agents/tools | Registry, capability boundary, invocation, permissions and execution context | Requests eligible specialist work; cannot grant its own tools or permissions |
| Policy | Enforces identity, permission, approvals, quotas and external-effect constraints | Supplies domain policy inputs and decisions; cannot bypass or redefine Core controls |
| Results | Records task output, evidence, cost, errors and trace | Defines domain acceptance criteria, interprets validated output and decides whether commercial follow-up is warranted |
| Budget | Enforces technical quotas and approved ceilings | Proposes/allocates commercial campaign and opportunity budgets within owner-approved limits |
| Side effects | Mediates and blocks unauthorized connector calls | Proposes external actions; never directly sends, publishes, commits spend or mutates a third-party system |

Core therefore performs **runtime orchestration and control enforcement**, not
sales strategy or commercial judgment. CAI Sales Manager performs **commercial
decision-making and domain workflow coordination**, not privileged runtime
execution.

### Agent and role decision

- **CAI Sales Manager:** the dedicated business component and owner of Sales
  domain strategy and coordination decisions; not synonymous with one
  model/agent invocation. “CAI” is used as supplied by the owner; its expansion
  is not established in this proposal.
- **Agent 01 — AI Executive Director (existing prompt name):** SHALL serve as
  the bounded commercial leadership and coordination role within CAI Sales
  Manager. It is not an independent Executive Director or a second technical
  orchestration runtime. The owner decision does not require a title rename.
  Agent 01 cannot grant permissions or bypass approvals.
- **Agent 09 — Follow-up & Account Strategy Agent:** a specialist under the
  CAI Sales Manager workflow. It supplies account-history, timing, suppression,
  follow-up and escalation recommendations. It does not own overall sales
  strategy, assign unrelated agents, or act as an independent orchestrator.
- **Executive Director:** no separate Executive Director component is approved.
  The legacy Agent 01 label does not confer human executive authority or define
  a second role. A future proposal for a separate executive role requires a new
  owner decision and must not create a second Core runtime.

### Owner decision options

**Selected: Option 1 — ACCEPTED 2026-10-19 by Project Owner.** Agent 01 serves
as the bounded commercial leadership and coordination role within CAI Sales
Manager. Agent 01 is not an independent Executive Director or second technical
orchestration runtime. AXIORYN AI Core retains exclusive authority over shared
agent execution, identity, permissions, policy and approval enforcement,
integration access, technical quotas, audit and observability. CAI Sales Manager
owns commercial strategy, campaign planning, lead prioritization, specialist
task planning, result evaluation and commercial performance decisions within
approved policies. Agent 09 remains a specialist providing account-strategy and
follow-up recommendations without independent managerial authority.

No separate Executive Director component is approved by this decision.
Changing that role structure requires a new owner-approved decision.

This decision does not approve GOV-1.0, accept B-001, authorize implementation,
or authorize external integrations. The architecture is a governance decision,
not evidence of repository implementation.
