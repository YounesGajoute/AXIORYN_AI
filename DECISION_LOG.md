# AXIORYN AI — Engineering Decision Log
**Baseline:** GOV-1.0

| ID | Decision | Status | Rationale | Follow-up |
|---|---|---|---|---|
| DEC-001 | AXIORYN AI is a modular enterprise multi-agent platform | CONFIRMED | Enables extensibility | Define module contracts |
| DEC-002 | Sales Team is the first production module | CONFIRMED | Initial product focus | Validate MVP |
| DEC-003 | No software implementation during initialization | CONFIRMED | Prevent ungoverned changes | Complete G0 |
| DEC-004 | Repository URL is the owner-supplied GitHub remote | CONFIRMED_URL_ONLY | Reference for inventory, not proof of baseline | Verify repository contents |
| ADR-001 | Programming language and framework | OPEN | Depends on repository and requirements | Compare options |
| ADR-002 | Orchestration and task-state mechanism | OPEN | Reliability and observability | Evaluate alternatives |
| ADR-003 | Storage, tenancy and retention | OPEN | Security and compliance | Define data model |
| ADR-004 | Model/provider routing | OPEN | Cost, quality and portability | Define criteria |
| ADR-005 | CRM and LinkedIn integration mechanisms | OPEN | API and policy constraints | Verify permitted access |
| ADR-006 | Hosting, CI/CD and operations | OPEN | Availability and ownership | Review deployment targets |
| ADR-SM-001 | Four-layer architecture and CAI Sales Manager / Agent 01 / Agent 09 roles | PROPOSED_PENDING_OWNER_APPROVAL | Separate Core runtime orchestration from CAI Sales Manager commercial decision-making; avoid duplicate executive/orchestration authority | Owner to choose an option in `SYSTEM_ARCHITECTURE.md`; no implementation |

## ADR template
ID; title; date; status (PROPOSED/ACCEPTED/REJECTED/SUPERSEDED); context; options; decision; rationale; consequences; security implications; owner approval; evidence links.

Only the owner or explicitly delegated approver may move an ADR to ACCEPTED. Record supersession rather than silently editing historical decisions.

## ADR-SM-001 — Four-layer architecture and CAI Sales Manager authority proposal

- **Date:** 2026-10-19
- **Status:** PROPOSED_PENDING_OWNER_APPROVAL
- **Context:** The GOV-1.0 logical architecture separates Core and Sales domain
  concerns, while the existing engineering prompt describes Agent 01 as an
  “AI Executive Director” coordinating Sales agents. The B-001 report also
  describes Sales Manager as a Layer-3 coordinator and maps it to Agent 01 plus
  Agent 09. These labels can imply duplicate orchestration and unclear
  commercial/runtime authority.
- **Proposal:** Use four logical layers: (1) Experience/Control Center,
  (2) AXIORYN AI Core runtime, (3) business domain components with the dedicated
  CAI Sales Manager, and (4) policy-enforced connectors/data boundaries.
- **Naming:** “CAI” is the owner-provided component label; its expansion and
  formal product naming remain unspecified pending owner confirmation.
- **Authority boundary:** Core owns generic task execution, agent/tool
  invocation, identity/permissions, policy enforcement, approvals, technical
  quotas, audit and observability. CAI Sales Manager owns commercial strategy and
  domain workflow choices within owner-approved rules; it requests Core
  capabilities but cannot grant permissions or invoke external systems directly.
- **Agent relationship:** Recommended interpretation is Agent 01 as the CAI Sales
  Manager's bounded commercial orchestration role, renamed to clarify its scope.
  Agent 09 is a specialist providing follow-up/account-strategy recommendations,
  not a second manager. No separate Executive Director is introduced unless the
  owner explicitly defines one.
- **Options:** (1) align Agent 01 to CAI Sales Manager (recommended); (2) retain Agent
  01 as a distinct subordinate delegate; (3) add a separate Executive Director
  role with explicitly approved authority and hierarchy.
- **Consequences:** Preserves one shared runtime; keeps commercial policy in the
  Sales domain; requires explicit owner-approved strategy, lead-ranking,
  campaign, assignment, validation and budget rules. The design does not select
  technology, authorize external integration, or authorize implementation.
- **Security/compliance:** Core remains the enforcement boundary. All external
  side effects remain disabled absent approved capability, permission, policy
  and required human approval.
- **Owner approval:** PENDING.
- **Evidence:** B-001 correction assessment and `SYSTEM_ARCHITECTURE.md`.
