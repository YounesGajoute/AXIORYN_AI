# AXIORYN AI — B-002 Stakeholder Use Cases
**Task:** B-002-DOCUMENTATION-PACKAGE  
**Status:** PROPOSED / READY FOR OWNER REVIEW  
**Governance baseline:** GOV-1.0  
**Scope:** Documentation only; implementation not authorized

## Architecture constraints
This package uses the accepted owner decision in ADR-SM-001 Option 1.

- AXIORYN AI Core owns technical execution, permissions, policy enforcement, approvals, connectors, and audit.
- CAI Sales Manager owns commercial decision-making within approved policy.
- Agent 01 operates within CAI Sales Manager as a bounded commercial leadership role.
- Agent 09 remains a specialist and does not hold independent managerial authority.
- No external integration or execution is authorized by this document.

## Scope boundary
The B-002 package covers governance-only requirements for Sales Team and CAI Sales Manager operating models. It does not approve software design, deployment, integration access, or production launch.

## Use case catalog

### UC-B002-01 — Industrial B2B account discovery
- Business actor: Sales representative, CAI Sales Manager, Core policy reviewer
- Trigger: New account opportunity or territory refresh
- Preconditions:
  - Account list or CRM seed data exists or is explicitly marked as missing
  - Source permissions and approved research channels are defined
  - Human review is available for sensitive or restricted sources
- Main workflow:
  1. Sales Manager defines target segment, region, industry, and account-fit criteria.
  2. Core policy validates allowed research sources and data handling rules.
  3. CAI Sales Manager requests discovery tasks from qualified research workflows.
  4. Results are ranked by evidence quality, confidence, and relevance.
  5. Human reviewer confirms account shortlist before outreach planning.
- Alternative and failure flows:
  - Missing or low-confidence data: flag as incomplete and request more evidence.
  - Restricted source denial: fallback to approved sources only.
- Required data: company identifiers, industry, geography, products, relevant signals, source provenance
- Responsible component: CAI Sales Manager, Core policy + research adapters
- Human approval requirements: Initial shortlist approval; approval required for restricted or sensitive sources
- Acceptance criteria:
  - Output includes source provenance and uncertainty labels
  - No unapproved source is used
  - Account fit is traceable to objective criteria
- Related requirement IDs: R-004, R-006, R-021, SM-REQ-001 (PROPOSED)

### UC-B002-02 — Company and competitor intelligence
- Business actor: Sales manager, analyst, customer-facing seller
- Trigger: Account planning, win-loss review, or competitive response
- Preconditions: Approved research sources and competitor taxonomy exist
- Main workflow:
  1. Sales Manager defines key competitors and strategic questions.
  2. Research workflow gathers company background, recent signals, and product positioning.
  3. Findings are normalized into a fact/estimate/unknown model.
  4. Human reviewer approves the final intelligence brief.
- Alternative and failure flows:
  - Weak evidence: mark as low confidence and suppress decision impact
  - Conflicting sources: escalate for evidence review
- Required data: company profile, market signals, recent announcements, competitor names, account context
- Responsible component: CAI Sales Manager and Core evidence handling
- Human approval requirements: Approval of final competitor brief before use in client-facing communications
- Acceptance criteria:
  - Intelligence brief distinguishes facts from inferences
  - Source lineage is preserved
  - Disallowed sources are not used
- Related requirement IDs: R-004, R-006, R-008, R-016, SM-REQ-001, SM-REQ-002 (PROPOSED)

### UC-B002-03 — Buying committee identification
- Business actor: Sales opportunity owner, account strategist, CAI Sales Manager
- Trigger: New or expanded account opportunity
- Preconditions: Account data is available and contact graph contains sufficient evidence
- Main workflow:
  1. Gather org structure, titles, buying roles, and decision evidence.
  2. Infer buying committee roles and influence strength.
  3. Rank stakeholder engagement priorities.
  4. Human reviewer validates committee map before outreach sequence begins.
- Alternative and failure flows:
  - Partial contact data: keep candidate set marked as incomplete
  - Conflicting role inference: require manual resolution
- Required data: account hierarchy, contact roles, titles, relationships, engagement history
- Responsible component: CAI Sales Manager and Core data model
- Human approval requirements: Validation of committee map and sequence priorities
- Acceptance criteria:
  - Each stakeholder has role and evidence trace
  - The committee model shows influence and confidence markers
  - Unverified identity claims are marked as such
- Related requirement IDs: R-004, R-007, R-023, SM-REQ-001, SM-REQ-004 (PROPOSED)

### UC-B002-04 — Lead qualification and prioritization
- Business actor: SDR, account executive, marketing ops, CAI Sales Manager
- Trigger: New leads, inbound form conversion, or account refresh
- Preconditions: Lead source is approved and attribution is tracked
- Main workflow:
  1. Normalize lead attributes and source metadata.
  2. Apply qualification criteria and scoring model.
  3. Rank leads by fit, urgency, and evidence confidence.
  4. Human reviewer approves exception cases or high-priority outreach.
- Alternative and failure flows:
  - Unverified contact data: hold for enrichment review
  - Duplicate records: merge with lineage and duplicates table
- Required data: lead attributes, source, fit score, personas, buying stages, recency, compliance state
- Responsible component: CAI Sales Manager + Core workflow engine
- Human approval requirements: Approved criteria and overrides for manual re-ranking
- Acceptance criteria:
  - All priority decisions are explainable
  - Uncertain or stale data is not over-weighted
  - No unauthorized outreach is sent without approval
- Related requirement IDs: R-004, R-006, R-007, R-016, SM-REQ-004 (PROPOSED)

### UC-B002-05 — Commercial strategy and account planning
- Business actor: CAI Sales Manager, account team, operator
- Trigger: New strategic account, renewals, or quarterly planning cycle
- Preconditions: Goals, segment definitions, and account constraints are approved by owner
- Main workflow:
  1. CAI Sales Manager translates strategic goals into account-level actions.
  2. Account plan includes target persona, campaign plan, and recommended sequence.
  3. Human reviewer approves account strategy before deployment.
- Alternative and failure flows:
  - Strategy conflict: escalate to owner or policy review
  - Stale account context: pause plan until validated
- Required data: account goals, segmentation, buying timeline, prior engagement, product fit, commercial constraints
- Responsible component: CAI Sales Manager
- Human approval requirements: Approval of commercial strategy, exceptions, and budget-sensitive actions
- Acceptance criteria:
  - Strategy is tied to approved objectives and constraints
  - Plans remain distinct from technical execution
  - Account plan is versioned and reviewable
- Related requirement IDs: R-004, R-021, R-022, SM-REQ-001, SM-REQ-003, SM-REQ-008 (PROPOSED)

### UC-B002-06 — Marketing campaign planning
- Business actor: Sales manager, marketing lead, operations reviewer
- Trigger: Quarterly campaign launch or account-based campaign demand generation
- Preconditions: Approved target audience, channel permissions, and campaign objectives exist
- Main workflow:
  1. Campaign objective is defined and mapped to target segments.
  2. Messaging and channel mix are proposed.
  3. Human reviewer approves content plan and sequencing.
  4. Campaign is tracked and measured after execution.
- Alternative and failure flows:
  - Channel not approved: reject or request alternate route
  - Missing audience evidence: keep campaign in draft state
- Required data: audience definitions, channel permissions, messaging themes, timings, budget range
- Responsible component: CAI Sales Manager + Core policy gate
- Human approval requirements: Approval before publishing or external channel use
- Acceptance criteria:
  - Campaign states are auditable
  - Channel use is approved and traceable
  - No direct external action is executed without policy evaluation
- Related requirement IDs: R-003, R-009, R-020, R-022, SM-REQ-002, SM-REQ-003 (PROPOSED)

### UC-B002-07 — LinkedIn content and outreach preparation
- Business actor: Sales representative, content lead, operator
- Trigger: Account-specific outreach, campaign support, or relationship building
- Preconditions: Content workflow is approved, source references are valid, and restrictions are known
- Main workflow:
  1. Intent and account context are assembled.
  2. Draft messaging uses approved evidence and citations.
  3. Human reviewer checks compliance, personalization quality, and risk.
  4. Approved draft is sent only through permitted channels and policy-enforced flow.
- Alternative and failure flows:
  - Restricted or missing source: revise or block action
  - Content fails compliance: require rewrite and resubmission
- Required data: account context, approved source links, past interactions, message templates, compliance flags
- Responsible component: CAI Sales Manager and Core policy approval layer
- Human approval requirements: Mandatory human approval before external communication or publishing
- Acceptance criteria:
  - Draft output is explicitly grounded in approved sources
  - Unknown or unverified claims are labeled
  - No direct external connector bypasses Core approval
- Related requirement IDs: R-009, R-010, R-011, R-020, SM-REQ-002, SM-REQ-006 (PROPOSED)

### UC-B002-08 — Human approval of external communications
- Business actor: Operator, sales manager, compliance reviewer
- Trigger: Draft email, LinkedIn action, or campaign message ready for dispatch
- Preconditions: Message draft exists, target audience is defined, and policy enforcement is available
- Main workflow:
  1. System produces message candidate and decision record.
  2. Human reviewer evaluates business fit, policy compliance, and risk.
  3. Approved message is sent through Core-governed path only.
- Alternative and failure flows:
  - Human rejection: block send and request edits
  - Policy violation detected: quarantine message and escalate
- Required data: content, sending destination, approval decision, policy scenarios, recipient context
- Responsible component: Core approval service and human reviewer
- Human approval requirements: Mandatory human approval for any external send
- Acceptance criteria:
  - Send action is logged with actor, time, decision, and policy reference
  - No external send bypasses approval
- Related requirement IDs: R-003, R-009, R-011, R-014, R-020, SM-REQ-006 (PROPOSED)

### UC-B002-09 — CRM synchronization
- Business actor: Sales ops, account owner, system operator
- Trigger: New lead, contact update, or status change
- Preconditions: CRM integration is approved and configured with scoped credentials and retry policy
- Main workflow:
  1. CAI Sales Manager or Core identifies CRM update.
  2. Change is validated against idempotency and duplicate rules.
  3. Sync operation is recorded and reconciled.
- Alternative and failure flows:
  - Partial failure: retry using idempotency key and quarantine unresolved objects
  - Conflict: maintain audit trail and manual resolution path
- Required data: account/contact IDs, status, lifecycle stage, source, owner, sync status
- Responsible component: Core integration gateway and CRM adapter
- Human approval requirements: Manual approval for configurable or sensitive updates
- Acceptance criteria:
  - Synchronization is reconciled without duplicate records or silent overwrites
  - Failed syncs are visible and re-triable
- Related requirement IDs: R-004, R-005, R-012, R-014, SM-REQ-007 (PROPOSED)

### UC-B002-10 — Intelligent follow-up
- Business actor: Sales manager, SDR, commercial operator
- Trigger: Prospect response, missed meeting, or account engagement signal
- Preconditions: Conversation history and contact status are available in approved systems
- Main workflow:
  1. Determine next-best action based on signal, account timeline, and engagement policy.
  2. Draft recommended follow-up with confidence and rationale.
  3. Human reviewer confirms or edits before send.
- Alternative and failure flows:
  - Suppression or no-contact period: block send and hold for review
  - Low-confidence recommendation: request additional data or escalate
- Required data: contact history, last touch, response events, suppression list, timing policies
- Responsible component: CAI Sales Manager + Core follow-up policy
- Human approval requirements: Approval for any external, high-impact, or suppressed follow-up
- Acceptance criteria:
  - Follow-up respects opt-out, quiet windows, and escalation rules
  - The recommended next action is traceable to evidence
- Related requirement IDs: R-011, R-014, R-023, SM-REQ-007 (PROPOSED)

### UC-B002-11 — Commercial reporting and analytics
- Business actor: Sales leader, operator, CAI Sales Manager
- Trigger: Weekly or monthly sales review, account health review, campaign check-in
- Preconditions: Metrics definitions and data sources are approved; report lineage is available
- Main workflow:
  1. Aggregate account, lead, activity, and campaign metrics.
  2. Compute key commercial indicators and state assumptions.
  3. Present metrics with provenance, confidence, and variance context.
  4. Human reviewer validates business implication.
- Alternative and failure flows:
  - Missing or partial data: show incomplete coverage and estimate labels
  - Data-source mismatch: escalate for reconciliation
- Required data: pipeline counts, funnel stages, conversion metrics, source attribution, campaign data
- Responsible component: CAI Sales Manager and Core observability/audit layer
- Human approval requirements: Human approval for metrics used in executive reporting or policy decisions
- Acceptance criteria:
  - Metric definitions are explicit and stable
  - Fact, estimate, and AI-summary are distinguished
  - Data provenance is retained
- Related requirement IDs: R-014, R-019, R-023, SM-REQ-009 (PROPOSED)

### UC-B002-12 — Agent supervision, audit, and exception handling
- Business actor: Operator, Core administrator, CAI Sales Manager
- Trigger: Task failure, policy violation, unusually high cost, or external action exception
- Preconditions: Task tracing, audit logs, and manual override policy exist
- Main workflow:
  1. Task or workflow signals failure or exception.
  2. Core records issue, correlation ID, and escalation path.
  3. Human operator or Sales Manager decides to retry, pause, or escalate.
  4. Final state is logged for audit and review.
- Alternative and failure flows:
  - Retry allowed: record retry count and reasons
  - Denied action: quarantine and document policy reason
  - Fatal event: require human override and incident record
- Required data: task logs, error codes, cost, policy decision, approval state, correlation IDs
- Responsible component: Core runtime and human operator
- Human approval requirements: Approval for overrides, escalations, or external effect retries
- Acceptance criteria:
  - All task states are traceable
  - Audit events preserve actor, timestamp, and decision trail
  - Exceptions do not bypass policy enforcement
- Related requirement IDs: R-003, R-014, R-015, R-016, R-018, SM-REQ-005, SM-REQ-006, SM-REQ-010 (PROPOSED)

## Use-case coverage summary
This use-case set addresses the required B-002 scope: account discovery, competitor intelligence, buying committees, lead qualification, strategy, campaign planning, content readiness, approval flows, CRM synchronization, intelligent follow-up, reporting, and supervisory controls.

## Acceptance checklist for use cases
- [ ] Each use case includes actor, trigger, preconditions, workflow, exception path, and acceptance criteria
- [ ] Each use case identifies responsible component and approval gate
- [ ] Each use case references original or proposed requirement IDs
- [ ] No use case claims implementation or external integration authorization
- [ ] All business decisions remain under Core governance and human approval as appropriate
