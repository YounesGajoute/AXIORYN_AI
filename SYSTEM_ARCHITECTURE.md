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

## Validation
No claim of repository conformance until a read-only inventory maps existing code to the proposed components. Do not begin implementation at this stage.

## Four-layer reconciliation proposal — ADR-SM-001

**Status:** PROPOSED_PENDING_OWNER_APPROVAL. This is a logical architecture
proposal, not an observed implementation and not a decision.

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

### Agent and role reconciliation proposal

- **CAI Sales Manager:** the dedicated business component and owner of Sales
  domain strategy and coordination decisions; not synonymous with one
  model/agent invocation. “CAI” is used as supplied by the owner; its expansion
  is not established in this proposal.
- **Agent 01 — AI Executive Director (existing prompt name):** recommend
  aligning this role with CAI Sales Manager's bounded commercial orchestration
  function and renaming it **Agent 01 — CAI Sales Manager / Commercial Orchestrator**.
  It may propose/coordinate decisions but cannot grant permissions, bypass
  approvals, or claim human executive authority. This rename requires owner
  approval.
- **Agent 09 — Follow-up & Account Strategy Agent:** a specialist under the
  CAI Sales Manager workflow. It supplies account-history, timing, suppression,
  follow-up and escalation recommendations. It does not own overall sales
  strategy, assign unrelated agents, or act as an independent orchestrator.
- **Executive Director:** do not add a second component by implication. The
  original Agent 01 label already calls it “AI Executive Director”; the
  proposal is to treat that as a legacy name for the CAI Sales Manager
  coordination role. If the owner intends a separate executive role, its decision authority,
  human oversight, hierarchy and relation to Sales Manager must be explicitly
  decided before architecture approval. It must not be implemented as a second
  Core runtime.

### Owner decision options

1. **Recommended:** approve the four layers above, align Agent 01 with CAI Sales
   Manager, and retain Agent 09 as a subordinate specialist; no separate
   Executive Director component.
2. Keep Agent 01 as a distinct CAI Sales Manager delegate, with the CAI Sales
   Manager component retaining explicit policy and decision ownership.
3. Establish a separate Executive Director business role only after defining
   authority, reporting hierarchy and limits; this is a materially different
   governance choice.

No option is selected until the owner records an explicit decision in the
decision log. These diagrams and responsibilities are proposals, not repository
facts.
