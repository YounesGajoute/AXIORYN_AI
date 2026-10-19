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
| ADR-SM-001 | Four-layer architecture and CAI Sales Manager / Agent 01 / Agent 09 roles | ACCEPTED — Option 1 | Project Owner approved 2026-10-19; Core retains exclusive runtime and control authority; Agent 01 is bounded commercial leadership within CAI Sales Manager; Agent 09 remains a specialist | Recorded in master-state Revision 5; no implementation authorization |
| BRANCH-POLICY-A | main canonical branch and v1 governance review branch | CONFIRMED | main is canonical; v1 is the governance preparation branch; no commit, push, merge, reset, or branch switching is authorized without explicit owner review | Maintain separate governance review branch |
| B-001-DOC-ACCEPTED | B-001 accepted as documentation-only deliverable | ACCEPTED_DOCUMENTATION_ONLY | Owner accepted the B-001 deliverable for governance review only; implementation remains prohibited | Preserve acceptance evidence and no-code status |
| B-002-DOC-ACCEPTED | B-002 accepted as documentation-only deliverable | ACCEPTED_DOCUMENTATION_ONLY | Owner accepted the B-002 package for governance review only; proposed requirements and NFR targets remain unapproved, and implementation remains prohibited | Preserve scope boundaries and owner approvals |

## ADR template
ID; title; date; status (PROPOSED/ACCEPTED/REJECTED/SUPERSEDED); context; options; decision; rationale; consequences; security implications; owner approval; evidence links.

Only the owner or explicitly delegated approver may move an ADR to ACCEPTED. Record supersession rather than silently editing historical decisions.

## ADR-SM-001 — Four-layer architecture and CAI Sales Manager authority

- **Date:** 2026-10-19
- **Status:** ACCEPTED
- **Approved option:** Option 1
- **Approval authority:** Project Owner
- **Approval date:** 2026-10-19
- **Context:** The GOV-1.0 logical architecture separates Core and Sales domain
  concerns, while the existing engineering prompt describes Agent 01 as an
  “AI Executive Director” coordinating Sales agents. The B-001 report also
  describes Sales Manager as a Layer-3 coordinator and maps it to Agent 01 plus
  Agent 09. These labels can imply duplicate orchestration and unclear
  commercial/runtime authority.
- **Decision:** Use four logical layers: (1) Experience/Control Center,
  (2) AXIORYN AI Core runtime, (3) business domain components with the dedicated
  CAI Sales Manager, and (4) policy-enforced connectors/data boundaries.
- **Naming:** “CAI” is the owner-provided component label; its expansion and
  formal product naming remain unspecified pending owner confirmation.
- **Authority boundary:** Core owns generic task execution, agent/tool
  invocation, identity/permissions, policy enforcement, approvals, technical
  quotas, audit and observability. CAI Sales Manager owns commercial strategy and
  domain workflow choices within owner-approved rules; it requests Core
  capabilities but cannot grant permissions or invoke external systems directly.
- **Selected option:** Option 1. Agent 01 serves as the bounded commercial
  leadership and coordination role within CAI Sales Manager. It is not an
  independent Executive Director or a second technical orchestration runtime.
  Agent 09 remains a specialist providing account-strategy and follow-up
  recommendations without independent managerial authority. No separate
  Executive Director component is approved.
- **Consequences:** Preserves one shared runtime; keeps commercial policy in the
  Sales domain; requires explicit owner-approved strategy, lead-ranking,
  campaign, assignment, validation and budget rules. The design does not select
  technology, authorize external integration, or authorize implementation.
- **Security/compliance:** Core remains the enforcement boundary. All external
  side effects remain disabled absent approved capability, permission, policy
  and required human approval.
- **Owner approval:** Project Owner, ACCEPTED, 2026-10-19, Option 1.
- **Evidence:** B-001 correction assessment and `SYSTEM_ARCHITECTURE.md`.

### ADR identifier mapping

`ADR-SM-001` is the Sales Manager architecture decision identifier. It is
distinct from the existing `ADR-001` through `ADR-007` entries in the master
state, which cover runtime/repository strategy, identity, persistence, model
provider, deployment, external sources and CRM/email. No existing ADR identifier
is renamed or reused. The accepted decision resolves only the Sales Manager
authority and four-layer responsibility boundary; the other ADRs remain
proposed/open.

The earlier PROPOSED assessment and the owner's decision notification are
retained in the governance history. This accepted record supersedes the prior
proposal status without rewriting the historical B-001 report or changing its
review disposition.
