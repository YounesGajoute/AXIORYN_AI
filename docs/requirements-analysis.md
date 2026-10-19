# Requirements analysis and implementation boundary

Analysis date: 19 October 2026. This document records the engineering interpretation of the existing requirements for the user's current request to analyze the repository and build the application. It preserves every original requirement and governance document. Historical documentation-only task restrictions describe those earlier tasks; the current request authorizes local implementation. It does not supply external account credentials or authorize communications, purchases, or production publication.

## Source review

The following files were read in full for this analysis:

- `MASTER_REQUIREMENTS.md`: Core, Sales and NFR capability identifiers, plus ten proposed Sales Manager requirements.
- `DEVELOPMENT_BACKLOG.md`: historical governance gates, foundation and sales work, plus proposed B-023–B-032 design work.
- `B-002-USE-CASES.md`: twelve stakeholder workflows and their exception paths.
- `B-002-NONFUNCTIONAL-REQUIREMENTS.md`: thirteen security, privacy, reliability and operational requirement families.
- `B-002-TRACEABILITY-MATRIX.md`: R-001–R-026 and SM-REQ-001–SM-REQ-010 relationships, including the original B-001–B-022 dependency range.
- `B-002-OWNER-DECISION-REGISTER.md`: accepted ADR-SM-001 boundary and unresolved operational decisions.
- `B-002-COMPLETENESS-MATRIX.md`: evidence of documentation completeness rather than software completeness.
- `B-002-FINDINGS-REGISTER.md`: three closed documentation review findings; none proves runtime behavior.
- `B-002-AGENT-REPORT.md`: scope and review status of the historical B-002 documentation task.
- `AXIORYN _AI—MASTER_ENGINEERING&EXECUTION_PROMPT.md`: business model, agent responsibilities, target stack, entities, interface sections, engineering phases and production definition of done.

## Reconciled product intent

AXIORYN AI is a reusable platform. AXIORYN AI Sales Team is its first module, initially supporting AXIORYN Factory / SmartFactory 4.0. Future product families are Vision, Control, Embedded, Connect and Energy. Initial commercial research focuses on Tangier, northern Morocco, Kenitra and Casablanca. Fifty verified industrial accounts and five to eight publicly verifiable stakeholders per account are pilot goals, not a license to fabricate records to reach a quota.

The accepted ADR-SM-001 boundary takes precedence over the legacy engineering prompt's independent “Executive Director” label:

| Layer | Responsibility | Boundary |
|---|---|---|
| Human owner/operator | Commercial objectives, policies, reviews and approvals | An approval is attributable to an authenticated actor and a specific object version. |
| AXIORYN AI Core | Identity, tenant isolation, registry, workflow state, permissions, quotas, approvals, integrations, audit and observability | All technical execution and connector access pass through this layer. |
| CAI Sales Manager | Strategy, campaign planning, ranking, commercial assignment and validation recommendations | Recommendations cannot grant permissions or invoke external services independently. |
| Specialist agents | Bounded tasks with structured inputs, output validation and evidence | Agent 01 operates inside Sales Manager; Agent 09 remains a specialist. |

Original `R-*`, readable `CORE-*` / `SALES-*` / `NFR-*`, and supplemental `SM-REQ-*` identifiers are separate namespaces. Their descriptions are related, but the source documents do not establish a complete one-to-one crosswalk. This implementation must not silently renumber them or mark the historical records accepted merely because software now exists.

## Product workflows

| Use cases | Operator workflow | Required result and failure behavior |
|---|---|---|
| UC-B002-01, 04 | Create/import account → add permitted evidence → verify account → score/rank | Provenance, verification date, confidence and scoring explanation; missing evidence remains unknown and duplicate accounts are rejected or reconciled visibly. |
| UC-B002-02 | Maintain competitor watchlist → record sourced observations → review brief | Facts, estimates and interpretations remain distinct; conflicting evidence is flagged. |
| UC-B002-03 | Add verified professional contacts → assign buying roles → review committee | Identity evidence and buying-role confidence remain visible; incomplete committees remain incomplete. |
| UC-B002-05, 06 | Set objectives → create account strategy/campaign → estimate budget → request review | Versioned draft/approved states; planning does not imply scheduling or execution. |
| UC-B002-07, 08 | Select account/contact → prepare evidence-grounded message/content → request human approval | Rejection blocks progression; editing approved content invalidates that approval; no approval implies delivery. |
| UC-B002-09 | Maintain CRM records → stage scoped changes → reconcile optional external adapter | Local CRM remains useful with no external provider; retries do not silently duplicate writes and conflicts are visible. |
| UC-B002-10 | Review account timeline → prepare next follow-up → enforce policy → record completion | Opt-out/rejection suppression, meeting pause and contact/account communication limits are checked when action executes. |
| UC-B002-11 | Inspect pipeline, research coverage, campaign and usage reports | Counts have explicit definitions and data scope; simulated records do not appear as real revenue or delivered messages. |
| UC-B002-12 | Inspect agents/workflows → retry, pause, cancel or escalate → inspect audit | Traceable actor, timestamp, object, decision and correlation identifiers; failures and blocked dependencies stay visible. |

The first acceptance path is Company Research → Verified Company Record → Contact Research → Buying Committee → Lead Scoring → Personalized Draft → Human Approval → CRM Follow-up. Offline demonstration uses synthetic records explicitly labeled as such, including in analytics.

## Eleven-role agent registry

Every role requires an identity, explicit capabilities, structured input/output, execution status, bounded retries/timeouts, audit entries and a reviewable result. A registry card alone is not evidence of autonomous research or a connected model.

| ID | Local role | Structured work product | Permission boundary |
|---|---|---|---|
| 01 | CAI Sales Manager / commercial leadership | Strategy and bounded specialist task recommendations | No separate Executive Director runtime; cannot bypass Core policy. |
| 02 | Brand Identity & LinkedIn | Brand/product messaging and page-content proposals | Draft preparation only until a permitted publishing adapter and approval exist. |
| 03 | Global Competitor Intelligence | Source-linked competitor observations and original content recommendations | No unsourced market claims, copying, or unauthorized harvesting. |
| 04 | Industrial Company Discovery | Candidate accounts with location, industry, product fit and provenance | Missing company facts remain unknown; fixture records remain synthetic. |
| 05 | Contact Intelligence & Buying Committee | Verified professional contacts, buying roles and confidence | No invented contact identities or private email addresses. |
| 06 | Lead Qualification | Configurable 0–100 score with factors, evidence and explanation | Inferred needs remain inferences; insufficient evidence lowers confidence. |
| 07 | Marketing Content Intelligence | Original draft, audience, product family, language, CTA and evidence | Draft/scheduled/published are distinct; approval required for publication. |
| 08 | Personalized Outreach | Contact/account-specific message and personalization rationale | No external messaging without adapter permissions and human approval. |
| 09 | Follow-up & Account Strategy | Next-action recommendation, timeline and escalation | Specialist only; suppression, rejection, meetings and account overlap constrain recommendations. |
| 10 | CRM & Opportunity Management | Consistent accounts, contacts, committee, activities, opportunities, proposals and commercial stages | Deduplication and explicit field ownership; external CRM synchronization requires a configured adapter and policy. |
| 11 | Sales Analytics & Optimization | Defined research, funnel, campaign, revenue and AI cost metrics with daily/weekly/monthly reporting | Real measurements, estimates and demonstration data remain distinct; no simulated sales performance is reported as real. |

The complete master engineering prompt specifies eleven roles. Agents 10 and 11 must remain represented even when their bounded tasks use the same shared CRM/reporting services exposed by the dashboard. An agent definition alone does not establish autonomous model operation; the runtime must disclose whether execution is local deterministic, model-backed, blocked or awaiting human input.

## Requirement-to-local-flow crosswalk

This crosswalk specifies intended local coverage and its limits. The final implementation and test report establish actual delivery status.

| Requirement | Expected local behavior | Boundary or remaining proof |
|---|---|---|
| R-001 | Core registry/workflow/policy services shared by the Sales module | Module architecture review; no second Sales Manager execution runtime. |
| R-002 | Agents carry explicit capabilities, status, bounded actions and execution limits | Production role grants, spend budgets and provider quota enforcement require configuration and tests. |
| R-003 | Object-specific human approvals and retry/idempotency tracking | External adapter transactions need real replay/failure evidence. |
| R-004 | Persisted accounts/contacts, provenance, verification and suppression state | Real-source verification, retention and deletion policies require reviewed operational data. |
| R-005 | CRM accounts, contacts, activities, stages, opportunities and deduplication | External CRM ownership/conflict rules depend on selected vendor. |
| R-006 | Evidence links and source metadata stored with research results | Approved source policy and permitted live research adapters remain prerequisites. |
| R-007 | Account buying committees with stakeholder role/confidence | Verified identities, influence and relationship evidence must be supplied or researched lawfully. |
| R-008 | Competitor records/briefs retaining observations, source and confidence | Live competitor monitoring requires permitted access and evaluated inference. |
| R-009 | LinkedIn-oriented content drafting and review | Authorized publication is independent from draft approval and requires provider entitlement. |
| R-010 | Account/contact-specific outreach drafts with rationale/evidence | Evaluate personalization and unsupported-claim handling; no model output is inherently verified. |
| R-011 | Follow-up tasks, account timeline, suppression and policy checks | Production timing, quiet windows and account communication limits require approved policy. |
| R-012 | Optional CRM adapter interface/status; useful local CRM without connection | Vendor contract, scoped secrets, reconciliation and live resilience evidence remain open. |
| R-013 | Authenticated access, role checks and personal-data handling controls | Tenant isolation, export/deletion/retention lifecycle require production evidence. |
| R-014 | Inspectable control center, workflow/approval details and audit | Completeness of audit coverage and integrity must be tested. |
| R-015 | Traceable workflow steps, blocked/failed/cancelled states and bounded retry | Durable background recovery/dead-letter behavior needs deployed worker evidence. |
| R-016 | Evidence/confidence validation and unsafe-source rejection | Model hallucination/injection evaluations need a versioned representative dataset. |
| R-017 | Environment-managed secrets, masked error/log output | Production secret manager, rotation and code/dependency scanning remain required. |
| R-018 | Health, logs, local backup/restore procedures and deployment instructions | Tested deployment-specific backup/restore, monitoring and rollback prove production readiness. |
| R-019 | Reproducible setup, tests, known limitations and release report | Owner production sign-off and complete environment-specific release evidence remain separate. |
| R-020 | Disabled/unconfigured external adapters visible in integrations | Credentials do not imply action authorization; scope and approval must both pass. |
| R-021 | Human review queue with approval/rejection decisions | High-risk actions and overrides must use the same Core enforcement path. |
| R-022 | Configurable objectives/data handling and documented defaults | Historical GOV acceptance and operational policy choices are not silently rewritten. |
| R-023 | Pipeline estimates, cost/budget information and transparent reporting | Actual charges/revenue need real reconciled sources and approved fiscal policy. |
| R-024 | Explicit facts/inferences/unknowns, confidence and provenance in work products | Representative quality/evidence tests must verify the distinction survives UI/API flows. |
| R-025 | Version-aware reviewable records and audit of changes/overrides | Formal release/change approval process belongs to the production operating model. |
| R-026 | Source permissions, data minimization and truthful commercial states | Jurisdiction/platform compliance review and environment-specific load/cost cutoffs remain open. |
| SM-REQ-001 | Versioned commercial strategy/objectives and assumptions | Owner-approved strategy and review interval needed for real commercial operation. |
| SM-REQ-002 | Marketing recommendations with audience/channel rationale | Recommendations cannot activate an external channel. |
| SM-REQ-003 | Campaign objectives, content, audience, budget, schedule and review status | Draft, approved, scheduled and executed states must remain distinct. |
| SM-REQ-004 | Explainable lead scoring with configurable factors and uncertainty | Final ranking policy/evaluation set requires owner decision. |
| SM-REQ-005 | Bounded assignment to the eleven registered capabilities | Assignment cannot grant permission, replace Core policy or imply a connected model. |
| SM-REQ-006 | Structured result validation and explicit incomplete/failed/review states | Final task-specific quality rubrics and model evaluation remain required. |
| SM-REQ-007 | Shared account/campaign/follow-up lifecycle with pause/cancel/suppression | Cross-system state reconciliation requires real connected systems. |
| SM-REQ-008 | Estimates, allocations and configured budget threshold visibility | Owner-approved ceilings and live provider reconciliation needed before spending. |
| SM-REQ-009 | Metrics tied to stored records, definitions, timeframe and synthetic scope | Facts, estimates and generated summaries must remain labeled. |
| SM-REQ-010 | Unified visibility of strategy, campaigns, accounts, agents, approvals and audit | Role/action matrix, accessibility checks and real external-policy cases remain release evidence. |

## Usable acceptance scenarios

The scenarios below define meaningful checks. They are not claims that any test has already passed; the release report must cite actual results.

| Scenario | Given / when | Observable acceptance result | Traceability |
|---|---|---|---|
| Complete local sales journey | An authenticated operator selects a labeled synthetic account and runs the demonstration | Account, contacts, committee, explanation, draft, approval and follow-up are persisted and inspectable with linked workflow/audit events. No outbound delivery is recorded. | R-004–R-007, R-010, R-014; UC 01, 03, 04, 07–10 |
| Insufficient evidence | A record lacks a permitted source or verification | It remains awaiting verification or incomplete; the interface never presents it as verified and prioritization exposes the missing input. | R-006, R-016, R-024 |
| Approval bypass | A user attempts a gated action with no approval, a rejected approval, or approval for an earlier content version | Core denies it and records the reason. Approval and connector availability are evaluated independently. | R-003, R-020, R-021 |
| Unconfigured connector | An approved draft is ready but no permitted delivery provider is connected | Draft remains available for manual handling; status is blocked/manual-required and delivered count stays zero. | R-009, R-012, R-020 |
| Follow-up suppression | A contact opts out, rejects contact, or has an account-level suppression | New and previously queued actions are blocked; audit explains suppression and the timeline remains inspectable. | R-011, R-013 |
| Meeting pause/account overlap | A meeting exists or another stakeholder at the same account has a pending touch | Follow-up is paused or held under configured policy; no automatic overlapping outreach occurs. | R-011; UC 10 |
| Duplicate/retry | An account is submitted twice or the same workflow action is retried | Stable identity/idempotency policy prevents duplicated records or side effects; conflict is surfaced when reconciliation is required. | R-003, R-005, R-012, R-015 |
| Authorization/isolation | An unauthenticated user or unauthorized role accesses a protected resource; another tenant's ID is supplied | Request is denied and discloses no other tenant's object. In a single-organization local mode that boundary is documented rather than claimed as multi-tenant proof. | R-002, R-013; NFR-01, NFR-02 |
| Truthful reporting | Demo records, drafts and estimated deal values exist | Metrics label demonstration scope, drafted/approved/delivered separately, and pipeline estimates separately from booked revenue. | R-019, R-023, R-024; SM-REQ-009 |
| Failed/cancelled work | A required input is missing, an adapter fails or operator cancels | Workflow records failed/blocked/cancelled with retry/correlation information; incomplete steps never become completed silently. | R-014, R-015, R-018 |
| Untrusted input | Source text contains commands to disclose secrets, grant permissions or send messages | Source content stays data; it cannot extend tool permissions or execute connector actions. | R-016, R-017 |
| Recoverability | Local data is backed up and restored into a separate configured store | Critical record counts, relationships and approval/audit history reconcile; production recovery claims still require an environment-specific drill. | R-018; NFR-06 |

## Local implementation boundary

A usable local release includes a responsive control center; persisted accounts, contacts, buying committees and CRM pipeline; explainable qualification; campaigns and content/outreach drafts; human review; follow-up policy; agent/workflow state; source and product knowledge records; integration availability; settings; audit; and metrics based on stored data. French/English support is the initial language goal, with localization keys suitable for Arabic expansion.

The preferred long-term stack is React/TypeScript/Vite with FastAPI, SQLAlchemy/Alembic and PostgreSQL in a modular monolith. Redis, durable workers and semantic retrieval should be introduced when a real workload requires them. A simpler local store/runtime is acceptable only when setup is reproducible, data persists, limitations are explicit, and PostgreSQL/durable execution are not falsely reported as implemented.

Offline deterministic generation is useful for reproducible test journeys. It must identify itself as local/template/demonstration behavior. It does not prove live web discovery, LLM reasoning, authorized LinkedIn access, CRM synchronization or actual commercial performance. Manual evidence entry and reviewed exports are valid workflows while connectors are absent.

Local policies may provide conservative configurable defaults, but proposed NFR targets remain unapproved. The historical documents supply no accepted availability target, p95 latency, recovery objective, retention duration, model spending ceiling or legal conclusion. Record these as deployment configuration and unresolved production prerequisites.

## Production prerequisites and evidence still required

| Prerequisite | Required decision, access or evidence before real production operation |
|---|---|
| Real data pilot | Owner-approved target segments and source permissions; verified accounts/contacts with legal basis, dates, provenance and confidence; staged pilot targeting 50 accounts and 5–8 stakeholders where verifiable. |
| CRM | Vendor selection, sandbox and production endpoints, organization mapping, scoped credentials, conflict resolution and field ownership, idempotency contract, reconciliation tests and operational approval. |
| LinkedIn | Confirmed product/API entitlement and approved action scopes for each research/publishing/messaging operation; account consent and adapter tests. Unsupported actions use human handling; no credential/session harvesting or bypass automation. |
| LLM/research providers | Provider, endpoint/model availability, secret injection, data processing terms, residency, timeout/retry/fallback rules, output validation/evaluation set and owner-approved token/cost limits. |
| Identity and authorization | Production identity provider or hardened credential lifecycle, initial owner provisioning, revocation/session policy, final role/action matrix and proved organization/tenant isolation. |
| Privacy | Qualified review of applicable Moroccan and expansion-market obligations, including Law 09-08/CNDP where relevant; lawful basis, notice/consent where needed, retention/deletion/export handling and cross-border processing decisions. Technical controls alone establish no legal compliance. |
| Commercial policy | Approved score factors/thresholds, strategy objectives and decision rights, campaign budget/time period, escalation thresholds, suppression and account overlap policy, follow-up windows and review responsibilities. |
| Deployment infrastructure | Chosen host and region, domain/TLS, production database and secret manager, network controls, persistent storage, migration/rollback procedure, dependency/security review and reproducible build artifact. |
| Durable execution | Worker/queue deployment, scheduler ownership, concurrency limits, timeout and retry bounds, dead-letter/replay procedures, and restart/outage evidence for real asynchronous tasks. |
| Operations | Accepted SLOs and RPO/RTO, log/metric retention, monitoring/alerts with named ownership, encrypted backups, successful restore and rollback drills and incident response runbook. |
| Quality/release | Actual API/domain/UI/critical journey tests, permission/isolation tests, injection and suppression checks, failure/retry/idempotency checks, accessibility review, load results for the chosen environment and release-owner sign-off. |
| Honest handover | Setup and user/admin guides, limitations, provider/adapter status, evaluated model behaviors, cost reporting and release readiness report that separates implemented, tested, blocked and planned capabilities. |

The production designation is earned through the above environment-specific evidence. It is not established by a polished dashboard, a list of agent roles, documentation completeness, or successful synthetic runs alone.
