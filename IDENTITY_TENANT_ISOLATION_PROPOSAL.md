# AXIORYN AI — Identity and Tenant Isolation Decision Proposal
**Status:** PROPOSED / GOVERNANCE ONLY
**Baseline:** GOV-1.0
**Implementation authorization:** NOT GRANTED

## Purpose
This decision proposal addresses the identity, permissions, and tenant-isolation findings from the architecture technical review. It is a governance artifact only and does not authorize implementation, external connectivity, or production deployment.

## Decision context
The project includes a shared Core runtime and a first business module, CAI Sales Manager. The architecture requires a single technical control plane with strict separation from commercial decision-making. Future implementation must preserve:

- single technical runtime authority in Core
- bounded commercial decision authority in CAI Sales Manager
- Agent 01 as bounded leadership inside Sales Manager
- Agent 09 as specialist only
- no second orchestration runtime

## Proposed decision
### Recommended option
Option A — Shared Core identity and authorization plane with tenant-aware isolation and role-scoped policy.

This option keeps Core as the single policy, identity, permission, and audit boundary while allowing Sales Manager to operate within assigned domains and scopes. Tenant boundaries are enforced by policy, not by a separate business-layer runtime.

## Decision options

### Option A — Shared Core identity and authorization plane with tenant-aware scopes
**Summary**
- Core owns identity, authentication context, RBAC, policy authorizer, approval service, and audit source of truth.
- Business domains receive scoped identities, not autonomous identity authority.
- Each tenant, account set, and workflow has an explicit trust boundary.
- Policy decisions are enforced centrally and logged immutably.

**Advantages**
- Single authority boundary reduces drift and privilege sprawl.
- Easier to audit and reason about cross-tenant prevention.
- Strong alignment with ADR-SM-001 and Core runtime authority.

**Tradeoffs**
- Requires more centralized work to provision permission flows.
- May add coordination overhead between Sales Manager and Core.
- Requires formal identity schema and tenant registration policy.

**Security risks**
- Centralized authorization service becomes a high-value target.
- Mis-scoped tenant IDs could enable cross-tenant leakage if policy is misconfigured.

**Required owner decision points**
- Whether the initial deployment is single-tenant or multi-tenant.
- Whether tenant separation is by customer, organization, or working data domain.
- Who can approve identity and policy exceptions.

### Option B — Domain-owned identity with Core supervision
**Summary**
- CAI Sales Manager optionally maintains domain-specific identities and permission metadata.
- Core retains supervision but not full control over every identity decision.

**Advantages**
- More local business flexibility in the Sales domain.
- Potentially simpler for isolated business workflows.

**Tradeoffs**
- Increases risk of duplicated identity authority.
- Makes cross-tenant enforcement harder to prove.
- Violates the governance boundary unless explicitly approved.

**Security risks**
- Greater probability of privilege drift and policy bypass.
- Harder to enforce complete audit and operator traceability.

**Required owner decision points**
- Whether any domain-level identity independence is approved.
- Whether business modules may issue identities without central Policy approval.

### Option C — No tenant-aware model; single logical environment only
**Summary**
- One shared environment for all workflows and identities.

**Advantages**
- Simpler initial design.
- Lower governance overhead for early design stage.

**Tradeoffs**
- Weak privacy and cross-domain isolation.
- Not suitable for production where personal-data or multi-customer operations apply.

**Security risks**
- High risk of privacy and confidentiality exposure.
- Hard to demonstrate separation of duties.

**Required owner decision points**
- Whether the governed system is allowed to operate in a single shared environment at all.

## Recommended control model
### Identity model
- User identities: human operator identities with role-based mapping and approval context.
- Service identities: machine identities for internal system tasks; no human-equivalent access.
- Agent identities: distinct agent or workflow identities scoped to a capability bundle and tenant boundary.

### Authorization model
- Deny-by-default for all tool, connector, and data access.
- Policy evaluation is centralized in Core.
- Permissions are derived from actor, tenant, role, and specific task context.
- Service and agent identities must not be able to self-grant or extend privileges.

### Least-privilege requirements
- Every task receives the minimum necessary privileges.
- Role assignment is explicit and reviewed.
- Temporary privilege elevation requires approval and logging.

### Separation of duties
- Commercial decision and approval authority are separated from policy enforcement.
- No same actor can both initiate and approve a high-risk action without explicit policy exception.
- No tenant-scoped business decision may bypass Core policy checks.

### Tenant-scoped audit trails
- Every action records actor, tenant, task ID, policy ID, correlation ID, approval record, and timestamp.
- Audit trails are append-only and cannot be overwritten by business modules.
- Audit evidence remains under Core authority.

### Cross-tenant prevention
- Every data access is evaluated against tenant scope and task context.
- Shared identifiers are prohibited across tenant boundaries without explicit mapping and approval.
- Inbound and outbound connectors are constrained by tenant allowlists.

## Security and privacy implications
- If the system processes personal data, identity and tenant isolation must be treated as a policy requirement before use.
- Any shared or overlapping identity namespace must be explicitly approved.
- Logging must avoid recording raw secrets or credentials.

## Open owner decisions and unresolved thresholds
- Tenant model: single-tenant, multi-tenant, or hybrid
- Identity source of truth: enterprise IdP, local auth, or delegated identity provider
- Approval delegation model for operators and domain owners
- Audit retention thresholds and access review schedule
- Whether CAI Sales Manager may maintain tenant-local policy rules beyond Core enforcement

## Decision registry cross-reference
This proposal is tied to the open decision registry in [ARCHITECTURE_DECISION_READINESS_MATRIX.md](./ARCHITECTURE_DECISION_READINESS_MATRIX.md):
- D-001 resolves the identity source of truth and actor model.
- D-002 resolves tenant boundaries and data separation.
- D-003 resolves RBAC and separation-of-duties policy.
- D-004 resolves approval delegation and external action controls.
- D-005 resolves audit retention and review schedule.

The dependencies are sequential and governance-critical:
1. Identity source and tenant model must be resolved before RBAC and tenant-scoped audit policy are enforceable.
2. RBAC must be resolved before approval delegation and separation-of-duties policy can be validated.
3. Audit retention and approval policy must be resolved before any external connector or personal-data workflow can be considered for authorization.
4. The recommendation in this document remains a proposal only; it is not an approved architecture decision.

## Acceptance status
This section is PROPOSED and is not an implementation authorization. It remains pending owner approval.
