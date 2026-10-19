# AXIORYN AI — Engineering Governance Master Baseline

**Baseline:** GOV-1.0 | **Date:** 2026-10-19 | **Status:** Proposed governance baseline; owner approval pending  
**Project:** AXIORYN AI | **First business module:** AXIORYN AI Sales Team | **Owner:** AXIORYN Engineering Systems

> **Language convention:** Owner-facing decisions and summaries in Arabic; technical specifications and agent-facing instructions in English. No software implementation is authorized by this document.

## A. ملخص للمالك / Owner Executive Summary

- **المؤكد:** الاسم والملكية، قابلية التوسع، النواة المشتركة، الوحدة الأولى، نطاق وظائف المبيعات الصناعية، دور الإشراف والمراجعة، ضرورة الأدلة قبل إعلان الاكتمال.
- **المقترح:** حدود الوحدات، اختيار بنية modular monolith كبداية، تصميم طبقة الحوكمة الأمنية، معايير القبول، الأولويات وترتيب المراحل.
- **المجهول:** وجود المستودع وحالته، المكدس البرمجي، نماذج الاستضافة، الأسواق واللغات، مصادر البيانات وتراخيصها، صلاحيات LinkedIn/CRM/email، قواعد الامتثال، الميزانية، حدود الأداء، المسؤولون التنفيذيون.
- **الحالة:** Governance baseline prepared; no source code, runtime tests, repository inventory, production integration, or deployment has been verified in this exercise.
- **قرار مطلوب:** approve or amend governance baseline, confirm repository and technical inputs, authorize the initial agent task only after Phase 0 gate.

## 1. Consolidated Project Charter

| Field | Baseline |
|---|---|
| Project ID | AXAI |
| Product | AXIORYN AI |
| Ownership | AXIORYN Engineering Systems — CONFIRMED |
| Vision | Enterprise-grade, extensible multi-agent AI platform — CONFIRMED |
| Shared foundation | AXIORYN AI Core; must remain modular and reusable — CONFIRMED |
| First module | AXIORYN AI Sales Team — CONFIRMED |
| Business focus | Industrial B2B prospecting and sales operations — CONFIRMED |
| Functional scope | LinkedIn marketing, competitor intelligence, lead discovery, buying-committee mapping, CRM, personalized outreach, intelligent follow-up — CONFIRMED as goals; integrations and automation levels NOT confirmed |
| Engineering mission | Govern development lifecycle, challenge agent claims, prevent drift, maintain milestones and evidence — CONFIRMED |
| Delivery model | Controlled iterative releases, owner-controlled go/no-go gates — PROPOSED |
| Initial architecture | Modular monolith with explicit internal module interfaces and asynchronous workers — PROPOSED, not selected |
| Intended users | Owner/admin, sales operators, reviewers, system/integration identities — PROPOSED |
| Initial customer / tenant model | Single organization initially; future tenant isolation supported by boundary design — PROPOSED |
| Hard exclusions before authorization | Unapproved LinkedIn scraping/automated profile enrichment, automated unsolicited sending, live connectors, deployment, spending, importing personal data — GOVERNANCE GUARDRAIL |

### In scope / Out of scope

**In scope for engineering planning:** architecture and API contracts, data model, policy and approval gates, domain workflows, AI quality evaluation, auditable execution, secure integrations where authorized, testability, production operations.  
**Not approved for MVP by this baseline:** autonomous mass outreach, unlicensed data collection, unsupported Social/Sales Navigator APIs, multi-tenant billing, industry-agnostic expansion, agentic actions without deterministic guardrails, third-party access before legal/product approval.

### Success metrics (proposed; no observed baselines)

| Category | Proposed success measure | Validation point |
|---|---|---|
| Governance | 100% accepted stories linked to requirement, tests and release evidence | Every acceptance |
| Safety | 0 external actions without explicit authorization and valid policy | Integration and release gates |
| Traceability | 100% AI-derived sales claims carry provenance or explicit “unverified” | Feature acceptance |
| Reliability | No known unmitigated critical or high severity vulnerabilities | Release |
| Operations | Restore drill, alert delivery, incident and rollback drill performed | Production gate |
| Value | Owner-defined business KPIs (lead quality, useful research, time saved) measured on approved pilot | Before scale-up |

## 2. Requirements Traceability Matrix (RTM)

**Legend:** C = confirmed capability-level scope; P = proposed engineering requirement; Status `DRAFT` means not formally approved; priority P0/P1/P2, 0 highest. Evidence below is a *required future artifact*, not a statement that tests have passed.

| ID | Requirement / acceptance contract | Basis | Pri | Phase | Backlog | Required evidence |
|---|---|---|---|---|---|---|
| R-001 | Core SHALL expose versioned module boundaries; Sales Team SHALL not own shared identity, audit or policy services. | C + P design | P0 | F1 | B-005,B-006 | architecture test + interface map |
| R-002 | Core SHALL isolate agent identity, tool permissions, inputs, outputs and execution budgets. | P | P0 | F1 | B-007 | deny-by-default tests |
| R-003 | All external write actions SHALL require policy evaluation, auditable owner/operator approval and idempotency. | P | P0 | F1/F4 | B-008,B-017 | negative/approval/replay tests |
| R-004 | System SHALL manage accounts and contacts with source/provenance, purpose, retention and suppression state. | C + P design | P0 | F2 | B-010 | entity/integration tests |
| R-005 | Sales Team SHALL support CRM lifecycle with configurable status and duplicate detection. | C | P1 | F2 | B-011 | scenario tests |
| R-006 | Sales Team SHALL support industry-specific lead research from approved sources, without assuming any source-access entitlement. | C | P1 | F3 | B-013 | provenance + policy validation |
| R-007 | Sales Team SHALL represent a buying committee with roles and evidence/confidence attributes. | C | P1 | F3 | B-014 | schema + scenario tests |
| R-008 | Sales Team SHALL provide competitor analysis with dates, source links and uncertainty labels. | C | P1 | F3 | B-015 | research evaluation set |
| R-009 | Sales Team SHALL support LinkedIn marketing only through explicitly approved product capabilities, permissions and flows. | C with external constraint | P0 | F0/F5 | B-003,B-019 | platform terms review + auth tests |
| R-010 | Sales Team SHALL draft personalized outreach grounded in approved sources and show citations/uncertainty before approval. | C + P controls | P1 | F4 | B-016 | evaluation + prompt injection tests |
| R-011 | Follow-up workflows SHALL respect opt-out, frequency caps, quiet windows and human-reviewed external sending. | C + P controls | P0 | F4 | B-018 | policy + opt-out tests |
| R-012 | A CRM sync adapter SHALL be optional, scoped and resilient to partial failure; vendor not yet chosen. | P | P1 | F5 | B-020 | contract/sync reconciliation tests |
| R-013 | Personal data SHALL use least privilege, retention/deletion policy and export/access logs. | P | P0 | F1/F2 | B-009,B-010 | security and deletion tests |
| R-014 | Operators SHALL inspect task state, decisions, approval requests and audit records. | P | P1 | F4 | B-012,B-017 | UI acceptance test |
| R-015 | Agent execution SHALL have trace IDs, capped retries, timeout, cancellation and dead-letter handling. | P | P0 | F1 | B-007 | fault-injection tests |
| R-016 | Evaluation SHALL detect fabricated sources, tool misuse, prompt injection and invalid structured output. | P | P0 | F3/F4 | B-021 | versioned evaluation report |
| R-017 | Secrets SHALL be managed separately from code; logs SHALL mask sensitive content. | P | P0 | F1 | B-009 | secret-scan + logging tests |
| R-018 | Backups, observability, rollback, incident response and restore proof SHALL precede release. | P | P0 | F6 | B-022 | restore + rollback evidence |
| R-019 | Each release SHALL include reproducible tests and explicit owner acceptance. | C governance mission + P process | P0 | All | B-004 | release sign-off |
| R-020 | External connectors SHALL be disabled by default and operable only with approved scope and credentials. | P | P0 | F5 | B-019,B-020 | permission matrix + sandbox tests |
| R-021 | AI models SHALL be replaceable via provider abstraction and prompts SHALL be version controlled. | P | P1 | F1/F3 | B-006,B-021 | contract tests |
| R-022 | System SHALL meet owner-approved performance, recovery and cost guardrails before GA; numerical targets unresolved. | P | P0 | F0/F6 | B-002,B-022 | signed NFR baseline + load tests |
| R-023 | Human decisions, model outputs and source evidence SHALL be distinguishable in UI and audit trail. | P | P1 | F3/F4 | B-012,B-021 | UX/evaluation test |
| R-024 | Import/export of authorized records SHALL use validated schemas and per-record authorization. | P | P1 | F2/F5 | B-011,B-020 | contract/privacy tests |
| R-025 | Retention and data residency SHALL be approved against applicable jurisdictions before live data collection. | P | P0 | F0 | B-003 | compliance decision record |
| R-026 | Versioned API and database migration contracts SHALL preserve downgrade/rollback or documented recovery. | P | P0 | F1/F6 | B-006,B-022 | migration/rollback test |

**RTM rule:** Each requirement must move `DRAFT -> APPROVED -> IMPLEMENTED -> VERIFIED -> ACCEPTED`; every transition records evidence, reviewer, date, and links to backlog/commits. No requirement is currently `IMPLEMENTED`, `VERIFIED` or `ACCEPTED` on reviewed evidence.

## 3. Proposed Architecture Governance Framework

### 3.1 Logical architecture (PROPOSED; no stack chosen)

```text
Operator / Owner UI
  -> BFF / Versioned API / Authentication
  -> AXIORYN AI Core
       Identity + RBAC/ABAC + Tenant/Org context
       Policy and approvals + audit/event log
       Agent registry and prompt/model registry
       Durable task orchestrator + tool gateway
       Secrets reference + observability + event/outbox
  -> Sales Team Domain Module
       Accounts/Contacts + CRM + Buying Committee
       Intelligence/Research + Competitive Analysis
       Campaigns + Drafts + Follow-up + Suppression
  -> Approved Connectors via policy-enforced gateway
       CRM / Email / LinkedIn approved products / Licensed sources
  -> Stores: transactional data, append-only audit, approved document/index store
```

Architecture options, **not decisions**: (a) modular monolith + background jobs for initial controlled deployment; (b) separated services later based on observed throughput/fault domains. Candidate runtime Python/TypeScript, relational DB PostgreSQL, queue/worker, web UI, containers. Technology selection requires ADR and proof of repository compatibility. **Do not equate an LLM with an authorization engine.**

### 3.2 Bounded contexts and rules

| Boundary | Owns | Must not own |
|---|---|---|
| Core Identity & Policy | identities, roles, permissions, approval decisions, policy evaluation | Sales lead scoring logic |
| Core Agent Runtime | tasks, agents, tools, model routing, retry, evaluation hooks | privileged writes without policy |
| Core Audit / Operations | append-only action history, event correlation, telemetry, incident events | sales domain records as a second source of truth |
| Sales CRM | accounts, contacts, opportunity records, consent/suppression references | secrets, global authorization |
| Sales Intelligence | source records, evidence, competitor signals, committee hypotheses | unchecked member-data extraction |
| Sales Engagement | drafts, approval state, campaigns and follow-up schedules | direct unreviewed sending |
| Connectors | partner API-specific translation, rate limits, OAuth token references | business logic or policy bypass |

### 3.3 Non-negotiable controls

1. **Permission first:** human or service principal, organization scope, explicit tool capability and purpose must be authorized before invocation. Default deny.
2. **Human-in-the-loop:** externally visible posts, messages, record mutations in third-party systems, and contact list imports are blocked pending owner-approved policy; approvals bound to exact content, recipients, channel and expiry.
3. **Data provenance:** mark owner-provided, publicly available, licensed, AI-derived, or unverified data. Enforce permissible uses and source-specific retention/export constraints.
4. **Prompt-injection resilience:** web pages, emails and tool outputs are untrusted; never grant them authority over policy, secret access or tools.
5. **Auditability:** append-only correlation IDs, immutable decisions, restricted access, redact personal data where feasible; no secrets in logs.
6. **Isolation:** no cross-organization leakage, including embeddings, logs, jobs, caches or retrieval. Multi-tenancy design is proposed but not yet required for initial deployment.
7. **Safe execution:** deterministic validation before and after LLM calls; typed schemas, bounded retries/cost, rate limiting, dead-letter queue and kill switch.
8. **Legal/platform gate:** LinkedIn uses only approved products and scopes; no unsupported scraping, automated connection requests or profile-to-CRM enrichment without explicit authorization and verified legal/platform basis.
9. **Security baseline:** threat model, dependency scan, secret scan, identity controls and tested backup/restore before production.

### 3.4 Decision control / ADR

- Every nontrivial architectural choice requires `ADR-XXX`: context, alternatives, tradeoffs, security/compliance, consequences, decision owner, date, status.
- Default ADR states: PROPOSED, APPROVED, SUPERSEDED, REJECTED.
- Required pending ADRs: ADR-001 repo/runtime strategy; ADR-002 tenancy/auth; ADR-003 persistence/queue; ADR-004 model vendor/data processing; ADR-005 deployment/data residency; ADR-006 external data and LinkedIn integration; ADR-007 CRM/email provider.
- Interfaces are reviewed for versioning and backward compatibility. Breaking changes require migration notes and owner approval.

### 3.5 Roles / approval authority (proposed RACI)

| Activity | Owner | Engineering governance lead (this assistant) | Coding agent | Independent reviewer / tester |
|---|---|---|---|---|
| Scope, budget, legal-risk acceptance | A | C | I | C |
| Architecture proposals and ADR analysis | A for irreversible choices | R | C | C |
| Implementation within authorized ticket | I | C/R for review | R | C |
| Verification of code and tests | A for release | R | R for evidence | R when assigned |
| Credentials / account permissions | A/R | I | No uncontrolled access | C |
| Production go/no-go | A | Recommends | I | C |

*A=accountable, R=responsible, C=consulted, I=informed. Role assignments pending owner confirmation.*

## 4. Phased Development Roadmap

| Phase / Gate | Outcome | Prerequisites | Exit evidence | Status |
|---|---|---|---|---|
| F0 — Discovery, G0 | Baseline inputs, inventory, use cases, constraints, approved RTM/ADRs | Repository/access information from owner | signed charter, NFR, architecture option record, source licensing matrix | IN PROGRESS (governance only) |
| F1 — Core Foundation, G1 | Reusable module contracts, identity, policy, audit, job orchestration | G0 + authorized coding | contract tests, deny-by-default suite, local reproducible build | NOT STARTED |
| F2 — Sales Data & CRM, G2 | Domain data model, lifecycle, suppression, import/export | G1 | data/permission tests, retention behavior, migration proof | NOT STARTED |
| F3 — Research & Intelligence, G3 | Authorized discovery, competitor analysis, committee evidence | G2 + source licensing | provenance checks, evaluation dataset, policy negative tests | NOT STARTED |
| F4 — Drafts & Approval Workflow, G4 | Grounded drafting, review UI, explicit approvals, safe follow-up engine | G3 + approved communication policy | approval, opt-out, duplicate-prevention, injection tests | NOT STARTED |
| F5 — External Integrations & Pilot, G5 | Approved CRM/email/LinkedIn flows in sandbox then limited pilot | G4 + live API entitlements and owner approval | reconciliation tests, audit trail, scope/limit tests | NOT STARTED |
| F6 — Security, Ops, Release, G6 | Production deployment decision | G5 + signed NFR / legal review | security, recovery, load, logging, rollback & owner sign-off | NOT STARTED |

**Scheduling policy:** No calendar dates or velocity are committed before team capacity, budget, repository and approvals are established. Phase completion requires objective gate evidence, not an agent narrative.

## 5. Development Backlog

**States:** NOT_STARTED, IN_PROGRESS, BLOCKED, READY_FOR_REVIEW, ACCEPTED, REJECTED, DEFERRED.  
**Priorities:** P0=blocking foundation/safety; P1=MVP core value; P2=expansion/optimization. Dependencies name backlog IDs, and gate permission remains mandatory even for unblocked tickets.

| ID | Pri | Task | Dependencies | Completion artifact / acceptance |
|---|---|---|---|---|
| B-001 | P0 | Repository and existing-code inventory (read only) | Owner provides repo | inventory + gaps, no edits |
| B-002 | P0 | Stakeholder use cases, scope and NFR baselines | B-001 | signed product/NFR register |
| B-003 | P0 | Legal, platform, source-permission & retention assessment | B-002 | permitted-use matrix and blockers |
| B-004 | P0 | RTM, quality gates and governance repo structure | B-001,B-002 | reviewed traceability/ADR templates |
| B-005 | P0 | Core vs Sales bounded-context contracts | B-002,B-004 | reviewed diagrams + contract tests |
| B-006 | P0 | Authorized foundation project structure, API schemas and migration strategy | B-005,ADR-001..003 approved | build + test artifacts |
| B-007 | P0 | Agent/tool execution gateway & durable task lifecycle | B-006 | deny, retry, timeout, cancellation tests |
| B-008 | P0 | Deterministic policy/approval service | B-006,B-007 | policy evaluation and replay tests |
| B-009 | P0 | Authentication, least privilege, secret hygiene, redacted audit | B-006,B-008 | auth, access, secret scan tests |
| B-010 | P0 | Account/contact source, purpose, retention, opt-out model | B-005,B-009,B-003 | data privacy & lifecycle tests |
| B-011 | P1 | CRM CRUD/state transition/duplicate resolution | B-010 | accepted scenarios + migration tests |
| B-012 | P1 | Owner/operator review and audit UI | B-008,B-009 | UI acceptance and accessibility checks |
| B-013 | P1 | Licensed-source research ingestion & provenance | B-003,B-007,B-010 | licensed source adapter and source tests |
| B-014 | P1 | Buying committee schema and evidence workflows | B-011,B-013 | role/confidence scenario tests |
| B-015 | P1 | Competitor intelligence and time-stamped evidence | B-013 | validated intelligence report tests |
| B-016 | P1 | Personalized draft generation; grounded citations and warnings | B-013,B-014,B-021 | golden-set/evaluation results |
| B-017 | P0 | Exact-message/recipient/channel human approval gate | B-008,B-012,B-016 | allow/deny and approval-expiry tests |
| B-018 | P0 | Follow-up scheduler, suppression and kill switch | B-010,B-017 | opt-out, quiet-window, dedup tests |
| B-019 | P0 | External permission readiness and approved LinkedIn adapter design | B-003,B-009 | permission / platform compliance proof |
| B-020 | P1 | Optional CRM/email sandbox connector with reconciliations | B-011,B-017,B-019 | sandbox contract + failure-retry tests |
| B-021 | P0 | Agent quality, injection, misuse and prompt/model version evaluation harness | B-007,B-013 | labeled evaluation suite and failing-case report |
| B-022 | P0 | Production runbooks, security, observability, backup and release proof | B-009,B-018,B-020,B-021 | signed release package and restore drill |

**Critical path:** B-001 → B-002/B-003/B-004 → B-005/B-006 → B-007/B-008/B-009 → B-010 → B-011/B-013 → B-014/B-021/B-016 → B-017/B-018 → B-020/B-022.  
**Note:** Some P0 items occur in late phases because they are release blockers, not authorization to implement them early.

## 6. Coding-Agent Reporting Protocol

Every coding-agent response MUST begin with:

```yaml
report_schema: AXAI-AGENT-REPORT-1.0
task_id: B-XXX
report_id: AGENT-YYYYMMDD-NNN
repository_url_or_identifier: <provided by owner>
base_commit: <40-hex or explicitly unavailable>
head_commit: <40-hex or explicitly unavailable>
branch: <branch or unavailable>
execution_scope: read_only | docs_only | authorized_code
requested_status: READY_FOR_REVIEW | BLOCKED | IN_PROGRESS
summary: <what changed; no unsupported claims>
requirements: [R-XXX]
files_added: []
files_changed: []
files_deleted: []
commands_executed:
  - command: <exact command>
    result: PASS | FAIL | NOT_RUN
    exit_code: <number or null>
    evidence_location: <log/path or unavailable>
tests:
  - name: <test suite>
    total: <integer or null>
    passed: <integer or null>
    failed: <integer or null>
    skipped: <integer or null>
    environment: <system/runtime>
    evidence_location: <path or unavailable>
security_checks: <names, outcomes, evidence; never paste secrets>
architecture_changes: <ADR IDs or none>
database_migrations: <IDs/rollback or none>
external_actions: <none or individually enumerated authorized actions>
known_defects: []
risks: []
blockers: []
assumptions: []
owner_approvals_needed: []
next_recommended_task: <one ID and rationale>
```

Required supplementary sections: summary of diff, requirement-to-test mapping, reproducible local commands, change impact, tests NOT run with reasons, edge/negative cases, open questions, rollback considerations. Attach sanitized logs or CI links. **Never** report `COMPLETED` or `PRODUCTION_READY` by assertion alone. Report claimed status `READY_FOR_REVIEW`, then governance review determines `ACCEPTED` or `REJECTED`.

## 7. Technical Review and Acceptance Procedure

1. **Scope check:** task authorization and dependency gate, requested vs actual changes, undeclared third-party effects.
2. **Evidence provenance:** repository pointer, base/head SHAs, complete diff, logs/CI artifacts; no claims without observation.
3. **Functional check:** map requirement ID → acceptance criterion → deterministic test → observed result.
4. **Architecture check:** bounded contexts, contract stability, migrations, ADR alignment and future module extensibility.
5. **Security and compliance:** authZ, external API permissions, source rights, data minimization, sensitive logging, secret scans, prompt/tool injection and opt-out behavior.
6. **Quality and reliability:** static analysis, repeatable build, unit/contract/integration tests, fault/retry/idempotency, concurrency and performance where applicable.
7. **Human approval UX:** exact-content approvals, expiration, revocation, audit trail, no silent external write.
8. **Operational review:** metrics/logging, rollback, recovery, support runbook for relevant changes.
9. **Disposition:** ACCEPTED / CHANGES_REQUIRED / REJECTED / BLOCKED with severity, citations to evidence and owner decision where needed.
10. **State update:** only after recorded approval, update RTM, backlog, ADR, test evidence, release register and master state revision.

### Release-blocking policy (proposed)

- A critical security issue, unauthorized data collection/write action, missing approvals, failed must-pass tests, cross-org exposure or unknown production credentials → **automatic BLOCK**.
- High-severity defects → block release unless owner explicitly signs a documented residual-risk exception supported by security review; legal/platform prohibitions cannot be waived by owner.
- Evidence gaps are **NOT VERIFIED**, not PASS. Tests never executed must be marked `NOT_RUN`.
- Only the owner can authorize deployments, spending, accounts, external writes or scope expansion. Governance review recommendation alone is not such authorization.

## 8. Production Readiness Checklist (unverified until evidenced)

- [ ] Product scope, target users, geography and regulatory assessment formally approved.
- [ ] All release-scope requirements `ACCEPTED` with linked tests.
- [ ] Selected stack, deployment and data residency captured in approved ADRs.
- [ ] Critical dependencies / SBOM, security scan and threat model reviewed.
- [ ] Identity, role permissions and organization isolation tested.
- [ ] No secrets in code, CI logs, snapshots or test fixtures.
- [ ] Legal basis/source rights, privacy notice, retention, deletion and suppression proven.
- [ ] LinkedIn/CRM/email scopes and permitted usage verified with actual account entitlements.
- [ ] Outbound posting/messaging requires signed content-specific human approval.
- [ ] Prompt injection, hallucination/provenance and tool misuse evaluation passed to approved thresholds.
- [ ] Idempotency, retries, rate limits, dead-letter queue, kill switch and fallback exercised.
- [ ] Schema migrations tested including failure/rollback or recovery procedure.
- [ ] Health checks, logs, traces, alerts, redaction and audit retention tested.
- [ ] SLO, load tests and budget thresholds signed and met; no targets silently invented.
- [ ] Encrypted backups and tested recovery; RTO/RPO signed and drilled.
- [ ] Staging validation and owner-approved pilot completed.
- [ ] Incident response roles, escalation, rollback and on-call coverage accepted.
- [ ] Penetration/security review and operational runbooks completed as risk requires.
- [ ] Owner signs G6 go/no-go with explicit version and evidence links.

**Current checklist status:** 0 verified by reviewed project implementation evidence; items have not been individually audited against a provided repository or deployment.

## 9. Risk and Blocker Register

Score = likelihood (L, 1-5) × impact (I, 1-5); proposed estimates only, not validated. Owner names represent responsible *roles* until assigned.

| ID | L×I | Risk / trigger | Mitigation and gate | Owner role | Status |
|---|---|---|---|---|---|
| RK-01 | 5×5 | LinkedIn capability/API or data-use restriction | R-009; verify entitlements and permissible uses; approved alternatives only | Owner + legal/integrations | OPEN/BLOCKER for LinkedIn connector |
| RK-02 | 4×5 | Privacy and unlawful contact processing | purpose/source register, minimization, deletion, suppression, jurisdiction review | Owner + privacy | OPEN/BLOCKER for live personal data |
| RK-03 | 4×5 | Unapproved external outreach/spam | deterministic approval and suppression, disabled-by-default connectors | Engineering | OPEN |
| RK-04 | 4×5 | LLM hallucinated facts, buying committee roles | source provenance, quality set, unverified flags, human review | AI lead | OPEN |
| RK-05 | 4×5 | Prompt injection causes tool abuse | untrusted source isolation, typed tool gateway, capability allowlist | Security lead | OPEN |
| RK-06 | 4×4 | Architecture coupling between Core/Sales | context boundaries, ADRs, contract tests | Architecture lead | OPEN |
| RK-07 | 4×4 | Missing repository baseline / legacy behavior | read-only inventory; no assumptions about existing code | Owner + agent | ACTIVE BLOCKER |
| RK-08 | 3×5 | Credential leak or access escalation | managed secrets, short-lived tokens, RBAC, scans | Security lead | OPEN |
| RK-09 | 4×4 | Unreliable source data / licensing | approved-source catalog, source contracts and quality review | Sales product owner | OPEN |
| RK-10 | 3×4 | CRM corruption / duplicate writes | transactional outbox, idempotency, reconciliation, dry-run | Engineering | OPEN |
| RK-11 | 3×5 | Multi-org information leakage | tenant boundary verification, isolated retrieval/logging | Security lead | OPEN |
| RK-12 | 3×4 | Budget/performance overrun | task quotas, token caps, metering and budget sign-off | Owner + engineering | OPEN |
| RK-13 | 3×5 | Deployment outage / unrecoverable migration | staging, rollback, encrypted backups and restore drill | Operations | OPEN |
| RK-14 | 4×4 | Unverified agent self-reported completion | mandatory evidence and independent acceptance | Governance lead | OPEN |

### Blocking unknowns / decision requests

| ID | Required owner input | Blocks |
|---|---|---|
| BL-01 | Repository URL or archive, branch and codebase access | B-001 and all coding tasks |
| BL-02 | Confirm first users, primary industries/geographies and MVP priority | B-002 onward |
| BL-03 | Authorize applicable regulations, legal review owner and permissible data-source list | B-003; live data/integrations |
| BL-04 | Verify LinkedIn products and actual developer/SNAP access; confirm acceptable manual alternative | LinkedIn connector |
| BL-05 | Decide infrastructure, model-provider/data-usage policy, spending ceilings | stack selection, live AI, deployment |
| BL-06 | Identify CRM/email systems and any available sanctioned sandbox credentials | integration implementation |
| BL-07 | Define measurable NFRs: SLO, latency, data volume, RTO, RPO, security/audit retention | final architecture, load/release gates |
| BL-08 | Name approver(s) for scope, code acceptance, data use and production | gate authorization |

## 10. First External Coding-Agent Implementation Prompt

See `AXIORYN_AI_CODING_AGENT_PROMPT_001.md` for the **complete agent-ready prompt**. Baseline task **B-001: Repository Inventory and Implementation Readiness** is intentionally **READ-ONLY** to respect the current instruction not to begin software implementation. This first controlled execution produces evidence and precise recommendations for B-002/B-004; it may not create code or alter systems. After Phase 0 and written authorization, an independent implementation prompt will be issued for B-006 or another owner-approved task.

## 11. Master State Maintenance Protocol

- Canonical machine-readable seed: `AXIORYN_AI_MASTER_STATE_v1.0.json`.
- Treat this seed as a **proposed baseline**, not a live database and not evidence of a deployed system.
- For each new report: verify repo and evidence; append an immutable report reference, update only evidenced statuses, synchronize RTM/backlog, record review disposition and decision IDs; create a new version (`v1.1`, etc.) and changelog.
- Source of truth should eventually be a version-controlled `governance/` directory in the *owner-confirmed* repository. Until then, these delivered files are only downloadable artifacts of this conversation; they have **not** been uploaded to any project repository or shared storage.
- Never overwrite established confirmed decisions based on a single coding-agent narrative. Resolve inconsistencies with evidence and owner decision.
- Never claim ChatGPT can automatically see future coding-agent reports or update files unless those reports are provided in this Project or connected through an authorized repository tool.

### Initial change log

| Revision | Date | Change | Approval |
|---|---|---|---|
| GOV-1.0 | 2026-10-19 | Initial consolidated baseline, RTM, phased plan, backlog, report/review protocols, readiness, risks and first prompt | Prepared — OWNER APPROVAL PENDING |

## 12. External Policy Notes (reviewed 2026-10-19)

These links are regulatory/platform due-diligence inputs, **not** proof of platform authorization or a complete legal opinion:

- LinkedIn API access and Sales Navigator partner approval: https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access
- LinkedIn Marketing API restricted member-data use: https://learn.microsoft.com/en-us/linkedin/marketing/restricted-use-cases
- LinkedIn Marketing access levels and permissions: https://learn.microsoft.com/en-us/linkedin/marketing/increasing-access
- European Commission on lawful bases and direct-marketing processing: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data_en

**End of baseline.**
