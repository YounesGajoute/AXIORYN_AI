# Architecture analysis and implementation contract

Analysis date: 2026-10-19. This document translates the existing architecture package into implementable behavior for the full application requested by the owner. The source documents describe a historical documentation-only phase; the current request authorizes application implementation. It does not supply production hosting, identity-provider configuration, model-provider credentials, CRM credentials, or permission for live outreach. Original governance records remain unchanged.

This is a design analysis, not a claim that every item below has been implemented or production-certified. Implementation and test evidence must identify the concrete files and checks that satisfy each contract.

## Source coverage

All ten assigned architecture documents were read in full:

- [System architecture](../SYSTEM_ARCHITECTURE.md)
- [Ten component contracts](../ARCHITECTURE_CONTRACTS_PROPOSED.md)
- [Formal contract addendum](../FORMAL_ARCHITECTURE_CONTRACT_ADDENDUM.md)
- [Identity and tenant isolation](../IDENTITY_TENANT_ISOLATION_PROPOSAL.md)
- [Data governance](../DATA_GOVERNANCE_PROPOSAL.md)
- [External integration governance](../EXTERNAL_INTEGRATION_GOVERNANCE_PROPOSAL.md)
- [ADR proposals](../ARCHITECTURE_ADR_PROPOSALS.md)
- [Decision-readiness matrix](../ARCHITECTURE_DECISION_READINESS_MATRIX.md)
- [Architecture traceability](../ARCHITECTURE_TRACEABILITY.md)
- [Historical architecture governance report](../ARCHITECTURE_GOVERNANCE_AGENT_REPORT.md)

## Responsibility model

The architecture has four logical layers, not four required services:

| Layer | Owns | Required boundary |
|---|---|---|
| Experience and Control Center | Operator views, review queue, configuration, reports | UI requests go through an authenticated application boundary; hiding a button is not authorization. |
| AXIORYN AI Core | Identity, authorization, task lifecycle, execution, routing, approval enforcement, connectors, audit, telemetry, technical quotas | One shared technical authority; every execution and data operation carries actor and tenant scope. |
| CAI Sales Manager | Commercial strategy, lead priorities, campaigns, acceptance of specialist outputs, commercial budgets | Produces commercial intent and work requests; cannot grant capabilities or perform external calls directly. |
| Connectors and data boundaries | Provider-specific translation, persistence, authorized external capabilities | All provider access passes through Core policy; domain modules never hold unrestricted provider clients. |

Agent 01 is the bounded leadership role within CAI Sales Manager. Its historical “AI Executive Director” prompt title does not create an executive authority or second runtime. Agent 09 supplies follow-up and account-strategy recommendations, not overall managerial authority. Other specialists execute scoped work through Core.

The implementation may be a modular monolith. Splitting into independently deployed services is neither required nor justified by the available documents. Preserve the logical boundaries so that infrastructure can change later.

## Implementable component contracts

| Contract | Input and output | Behavior required in the application |
|---|---|---|
| Core runtime | Task intent, actor, tenant, capabilities, budget → authorized execution, state, trace, errors | Validate capability and scope; persist lifecycle; enforce quotas; audit allow and deny decisions. |
| Sales Manager | Goals, account evidence, policy → strategy, priorities, campaign plan | Explain recommendations with evidence; submit work through Core; keep commercial budget separate from execution cost. |
| Agent 01 | Strategy context → leadership recommendations and specialist work packages | Cannot self-grant tools, approve its own high-risk work, or call providers directly. |
| Agent 09 | Account history, suppression and timing → follow-up recommendation | Respect suppression and quiet windows; surface contradictory or missing evidence. |
| Specialist routing | Required capability and scoped assignment → result, evidence, usage, errors | Route by capability registry; constrain tools, tenant, deadline and budget; expose unresolved work. |
| Approval service | Concrete action and policy context → recorded approval/rejection | Bind the decision to the actual immutable action; reject unauthorized, stale or self-issued high-risk approval. |
| Tool gateway | Capability, target, operation, payload → authorized result or denial | Deny by default; use allowlists, scoped secrets, rate limits, idempotency and audit. |
| Audit and telemetry | Task, policy, approval, connector events → trace and operator evidence | Append-only application writes; tenant filtering; redact sensitive data; never let domain updates rewrite history. |
| CRM synchronization | Provenanced records and mappings → sync result or conflict | Preview changes; detect duplicates; require approval for writes; preserve external IDs; surface conflicts. |
| Campaign workflow | Goal, audience, content, channels, budget → plan, review, follow-up | Tie every step to goal and evidence; approval before external send or budget commitment; support pause and resume. |

For local use, seeded example accounts and deterministic specialist outputs can make the complete workflow demonstrable. Label those outputs as demonstrations. Configuring a model later must not silently replace fabricated evidence with apparently verified claims.

## Shared schemas

Every durable entity should have a stable ID, tenant ID, creation/update timestamps and, where it participates in a workflow, a correlation ID. Tenant context comes from authenticated server context rather than a trusted client-supplied ID.

| Schema | Minimum fields |
|---|---|
| Actor | actor_id, tenant_id, actor_type (human/service/agent), roles, active state |
| CoreTask | task_id, tenant_id, actor_id, module, objective, inputs, allowed_tools, approval_requirements, budget, deadline, state, correlation_id |
| TaskResult | task_id, output, evidence references, model/provider metadata, cost/usage, errors, trace_id, approval state |
| API envelope | version, request_id, correlation_id, tenant_id, actor_id, timestamp_utc, source_component, target_component, policy_context, payload |
| Event envelope | event_id, event_type, event_version, correlation_id, causation_id, tenant_id, actor_id, source_component, occurred_at_utc, severity, status, payload |
| Approval | request_id, tenant_id, action type, immutable action/payload reference or hash, requester, policy version, risk, state, approver, reason, timestamp |
| Connector operation | tenant_id, workflow/task, connector, capability, target, action classification, payload reference, approval reference, idempotency key, result |
| Audit event | event_id, tenant_id, actor_id, component, action, policy_version, result, timestamp_utc, correlation_id, subject/evidence reference |
| Account/contact | tenant_id, normalized identity, lifecycle, provenance, confidence, classification, purpose, suppression, retention metadata |

The approval payload binding is an implementation refinement needed to make the source requirement meaningful: an approval of one draft must not authorize an edited draft or a different recipient. Changes to recipient, content, budget, destination or policy-sensitive input invalidate that approval.

All state-changing APIs validate structured input, reject unknown or forbidden enum values, return machine-readable errors and audit authorization failures. Avoid returning raw provider exceptions or credential-bearing request bodies.

## State machines and reliability

The formal addendum proposes these task paths:

```text
NEW → QUEUED → RUNNING → WAITING_FOR_APPROVAL → APPROVED → EXECUTING → COMPLETED
NEW → QUEUED → RUNNING → WAITING_FOR_APPROVAL → REJECTED → CLOSED
NEW → QUEUED → RUNNING → FAILED → RETRY_SCHEDULED → RUNNING
NEW → QUEUED → RUNNING → BLOCKED → REQUIRES_OWNER_DECISION
NEW → QUEUED → RUNNING → CANCELLED → CLOSED
```

Use an explicit transition map rather than arbitrary status assignment. Read-only internal tasks can complete from RUNNING after validated output without a fictional approval. That completion edge is a necessary implementation clarification to the proposed diagram. Terminal tasks cannot restart through ordinary updates. Cancellation and worker execution must coordinate so cancelled work cannot subsequently produce an external effect.

Approval records have a separate lifecycle: PENDING → APPROVED / REJECTED / EXPIRED / CANCELLED. A decision and its actor remain part of history even when a later policy change prevents execution. Re-check policy, scope, connector availability, suppression and budget at execution time; approval is one condition, not a universal permission.

Campaign state can use DRAFT → IN_REVIEW → APPROVED → ACTIVE → PAUSED / COMPLETED / CANCELLED. This is an implementation proposal, not an accepted source enum. A campaign being ACTIVE cannot itself authorize each outbound action. Content, recipient and connector checks still apply.

CRM sync should expose PENDING, APPROVAL_REQUIRED, RUNNING, SUCCEEDED, CONFLICT, FAILED and BLOCKED outcomes or equivalent documented states. A conflict requires an explicit resolution; an automatic last-writer-wins update would violate the intended human control.

Reliability rules:

- Persist work and its intended state before execution; record transitions with actor and correlation.
- Retry transient failures only, with bounded backoff, timeout, maximum attempts and total execution budget.
- A policy denial, validation error, missing approval or revoked credential is not a transient retry candidate.
- Scope idempotency keys by tenant and operation; store a payload fingerprint and result. Reuse with a different payload is an error.
- Where a side effect might have completed before a timeout, reconcile provider status before resending. An in-memory key is insufficient across process restarts.
- Exhausted retries enter a visible dead-letter/review path that preserves error and evidence. Never silently drop the work.
- Record model and token usage by tenant, actor, task and workflow. Unknown spend is surfaced rather than assumed zero.

Required error categories from the addendum are POLICY_BLOCKED, AUTHORIZATION_DENIED, VALIDATION_FAILED, EXTERNAL_PROVIDER_FAILURE, RETRYABLE_FAILURE, NON_RETRYABLE_FAILURE, RATE_LIMITED, TIMEOUT, HUMAN_APPROVAL_REQUIRED and DEAD_LETTER. Error responses also need a human-readable explanation, retryable flag and next action.

## Identity and authorization

A sensible initial deployment is one local organization with tenant-aware storage and authorization. That does not claim certified multi-tenant isolation. Never build a tenant switcher that accepts an arbitrary tenant identifier without a membership check.

Core should own the following controls:

- Distinct human, service and agent identities; agents and services cannot acquire human approval authority by setting a role field.
- Server-enforced roles/capabilities for reading, creating, operating, approving and configuring. The exact role names are an implementation choice.
- Tenant ownership checks on every list, lookup, mutation, export, background task and audit query, including IDs nested in request payloads.
- Deny-by-default capability selection and no self-granted permissions.
- Separate initiation and approval of high-risk actions unless a specific owner policy explicitly permits an exception. A local demo may show the workflow, but must not imply independent real approvers exist when they do not.
- Authentication secrets stored using appropriate password hashing; session integrity, expiry, logout and brute-force protection appropriate to the chosen deployment.
- Browser-origin protections and session handling appropriate to cookie or bearer authentication; no authentication assumptions based on the frontend alone.

Single-process local persistence, local passwords and append-only application methods are useful development controls. They are not equivalent to enterprise identity, database-enforced tenant isolation, encrypted production storage or tamper-proof audit storage.

## Data governance

| Class | Source examples | Operational implication |
|---|---|---|
| A: public | Public references, service metadata | Still preserve provenance and approved purpose. |
| B: internal | Account summaries, internal campaign notes | Restrict to assigned operators/workflows; audit access as appropriate. |
| C: sensitive commercial | Contact details, targeted account research, relationship data | Tenant scope, export approval, provenance and strict access. |
| D: personal/regulated | Personal identifiers, employment/contact details, data-subject records | Document processing purpose and applicable review before live use; support deletion and suppression. |

The source categories overlap: contact details appear in both C and D. Resolve overlap to the stricter applicable class; do not downgrade personal data because it is commercially useful.

Each imported or manually entered record needs source, collection time, purpose, confidence, classification and suppression status. Unknown evidence is explicitly marked unknown. A confidence score is not proof of accuracy or a lawful processing basis.

Retention periods and residency restrictions remain undecided. Do not invent a legal retention period or claim compliance. The local app can expose configurable retention settings and deletion/suppression workflows. Audit evidence should preserve minimal identifiers and decision facts without retaining deleted personal content indefinitely. Avoid logging full prompts, contact details, tokens or provider payloads by default.

Secrets belong in a runtime environment or approved secret facility, never source files, browser bundles, prompts, audit logs or committed configuration. Store only whether an integration is configured in user-visible state. Sensitive production data requires approved encryption and key management beyond a plaintext local development database.

## External integration boundary

No connector is active by default in the source design. The current app request does not identify a CRM provider, provide credentials, authorize LinkedIn access or ask for outreach to real people. Implement complete local previews and approval handling with explicit disabled/unconfigured connector status.

Enabling a live capability requires all applicable conditions: authenticated actor, tenant membership, allowed capability and target, configured scoped credentials, approved data purpose, current approval for a concrete write, available quota, valid suppression state and an auditable operation. Provider connection and action approval are separate decisions.

LinkedIn access needs a supported authorized channel and the relevant platform permissions. Do not replace unavailable integration with scraping or browser outreach. CRM capabilities must specify object types, mapping and read/write scope. Provider adapters should support immediate revocation, rate limits, bounded retries and conflict reconciliation.

A local approval must not claim a message was sent or a CRM record was updated when the live connector is disabled. Record “approved, awaiting connector” or an equivalent accurate state.

## Traceability and acceptance evidence

Use the actual requirement descriptions in MASTER_REQUIREMENTS.md and the master-state JSON as the canonical identifiers. The architecture traceability tables drift from those descriptions, particularly R-021–R-026. The following groups identify meaningful implementation evidence without inheriting that drift:

| Scope | Requirement / backlog references | Evidence to obtain |
|---|---|---|
| Core authority, routing and lifecycle | R-001, R-002, R-015; B-005–B-007, B-017 | Scoped task creation; allowed transitions; capability denial; durable history and correlated results. |
| Approvals and gateway | R-003, R-020; B-008, B-009, B-017, B-019 | Unauthorized action denied; approve/reject history; edited-payload invalidation; disabled connector blocks execution. |
| Leads, accounts and evidence | R-004–R-008, R-016; B-010, B-011, B-013–B-015, B-021 | Provenance; duplicate detection; lifecycle; buying committees; competitor facts separated from inference. |
| Drafting and follow-up | R-009–R-011; B-016, B-018, B-019 | Evidence-linked drafts; suppression and quiet-window checks; explicit external send approval. |
| CRM, secrets and privacy | R-012, R-013, R-017; B-009, B-020 | Idempotency, conflict handling, masked logs, deletion/suppression and no secret exposure. |
| Visibility and recovery | R-014, R-018, R-019, R-026; B-012, B-022 | Operator trace views; append-only history; migration/recovery evidence; honest release limitations. |
| Model contracts and AI evidence | R-016, R-021, R-023; B-006, B-021 | Replaceable model adapters, versioned prompts, invalid-output rejection and visible distinction among human decisions, model output and source evidence. |
| Import/export, retention and residency | R-024, R-025; B-003, B-011, B-020 | Validated records with per-record authorization, configured retention/suppression, export audit and documented residency decisions. |
| Operational thresholds | R-022; B-002, B-022 | Owner-defined performance, recovery and cost guardrails; observed measurements rather than invented signed targets. |
| Commercial strategy and campaigns | SM-REQ-001–SM-REQ-010; B-023–B-032 | Goals and evidence-linked plans; specialist packages; budgets; campaign review and reporting. |
| Governance boundary | R-001; ADR-SM-001 | Core performs technical execution; Sales Manager makes bounded commercial decisions; no second runtime. |

Prioritize meaningful tests: cross-tenant reads and writes, forbidden role actions, approval self-decision, approval payload changes, duplicate side effects, invalid transitions, revoked connectors, suppression, transaction failure and restart durability. UI smoke checks should demonstrate that the operator can create and qualify a lead, request specialist work, draft outreach, review a campaign, approve or reject a concrete action and inspect its audit trail.

## Decision gaps and consistency observations

The decision registry contains circular dependencies: D-001 references D-002 and vice versa; D-004 references D-006 and vice versa; D-005 and D-009 also form a dependency loop. Treat these as grouped policy decisions, not an impossible serial blocker to local implementation. Document chosen development defaults without silently marking historical proposals accepted.

The historical no-implementation statements are dated governance context. The owner's current request supersedes that restriction for application work. It does not resolve every production or external-platform decision. Keep the accepted ADR-SM-001 role boundaries while making pragmatic, reversible local technology choices.

Decisions still needed for production are identity source, tenant ownership and isolation level, real approver delegation, audit retention, personal-data purpose and residency, secrets/key management, model provider and budget, CRM provider/scope, LinkedIn permissions, hosting, incident response and operational release controls. These should become explicit configuration and release notes rather than fabricated defaults or claims of readiness.
