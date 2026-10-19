# Feature coverage and limits

Recorded: 19 October 2026. This is a scope crosswalk for the local release, not a production acceptance statement. “Local” means working application behavior is in scope; “Partial” means the source capability extends beyond the local behavior; “Missing” identifies an unimplemented production capability. Actual executed checks are recorded separately in [implementation status](implementation-status.md).

## Master interface sections

The master prompt names sixteen sections. The local interface groups some into shared pages, dialogs and record collections; a different navigation label does not imply a capability is absent or complete.

| Master section | Local surface / behavior | Coverage and boundary |
|---|---|---|
| 1. Executive Dashboard | Control center with stored account, pipeline, task and approval totals | **Local.** Operational totals include labeled fixtures; not verified commercial results or AI forecasts. |
| 2. AI Agent Control Center | Eleven role cards; create/run/inspect/retry/cancel local tasks; optional owner-confirmed OpenAI task generation | **Partial.** Provider disabled by default and untested against a live model; no durable asynchronous orchestration. |
| 3. Company Database | Accounts directory, details and CRUD/import/export | **Partial.** User-supplied source/evidence and synthetic fixtures; no autonomous verified discovery or 50-company real pilot. |
| 4. Contact Intelligence | Contacts, titles, confidence, professional context and suppression | **Partial.** Manually entered information; no live contact enrichment, identity verification or generated private details. |
| 5. Buying Committee Maps | Contacts grouped by account with buying roles/confidence | **Partial.** Reviewable role list, not a verified influence/relationship graph. |
| 6. Competitor Intelligence | Market intelligence observations, source context and local summaries | **Partial.** No live monitoring/crawling, change feed or verified competitor market dataset. |
| 7. LinkedIn Content Studio | Content draft records, audience/product/evidence/visual brief/CTA/language and review state | **Partial.** Content is human-editable preparation; scheduling is a planning date, not a publisher or executing scheduler. |
| 8. Outreach Campaigns | Commercial campaign plans and account/contact outreach drafts with human approval | **Partial.** Exact-content approvals and local simulation; no external send/publish. |
| 9. Follow-up Management | Follow-up reminders, status and notes; policy checks during simulation; linked meeting records | **Partial.** No background communications or automatic inbox/calendar ingestion. |
| 10. CRM Pipeline | Opportunity stages, estimates and account/contact relationships | **Local.** Unified local records; external CRM adapter and field reconciliation are disabled. |
| 11. Opportunities and Proposals | Opportunity records and proposal scope/value/state/notes | **Partial.** Internal commercial records; no signed proposal delivery, document generation or contracting platform. |
| 12. Analytics and Reporting | Defined current-record totals, pipeline, budget and task/approval metrics | **Partial.** No real attribution, provider cost feed, scheduled daily/weekly/monthly reports or verified revenue reconciliation. |
| 13. Knowledge Base | Product/brand/guideline records with summary/source URL and owner-set human-review flag | **Partial.** The flag records the owner's assertion; it is not independent verification, semantic retrieval or an ingestion pipeline. |
| 14. Integrations | Visible disabled LinkedIn/email/CRM and optional OpenAI provider availability | **Partial.** OpenAI task adapter requires server environment configuration and per-call owner consent; no live/paid validation performed. |
| 15. Settings and Permissions | Owner/operator/reviewer accounts, disabled state, planning budget, quiet hours, timezone and pause control | **Partial.** No SSO, full owner recovery, deployment encryption, configurable permission designer or enterprise tenancy. |
| 16. Audit Logs | Actor/action/object/time history and task/approval inspection | **Local.** Application-maintained SQLite history; not an externally immutable audit archive. |

## Local entities and semantics

| Entity/service | What the local records represent | Scope limit |
|---|---|---|
| Organizations, users, sessions | One local workspace with authenticated roles and scoped access | Organization-aware storage is not proof of production multi-tenancy. |
| Accounts, contacts | Commercial records with source notes, confidence/score where available, timestamps and synthetic labels | Creation/update time is not necessarily the time a real-world claim was independently verified. |
| Opportunities | Account-linked stage and estimated value | Won stage is a recorded state, not a booked-revenue or payment record. |
| Campaigns and strategy | Objective, target audience, budget and internal review/planning | Allocations are estimates; no spending or channel activation occurs. |
| Intelligence | Reviewable market/competitor observation and source context | Statements still require human review and permitted evidence. |
| Drafts, approvals, simulations | Exact proposed content, recipient/channel and human decision; local execution log | Approved and simulated states never mean delivered; revisions invalidate approval. |
| Follow-ups | Contact-related planning reminders and status | No automatic sending, queue worker or inbox response detection. |
| Meetings | Account/contact, title, scheduled time, notes and planned/completed/cancelled state; planned meetings block account outreach simulation | A manually recorded meeting is not confirmation from a connected calendar. |
| Proposals | Account/opportunity, title, scope, value and internal draft/reviewed/accepted/declined state | A state update is not a digital signature, signed contract or delivered proposal. |
| Content | Title, audience, product family, body, evidence, visual brief, CTA, language, draft/reviewed state and planned date | No publication connector; a future planned date schedules no job. |
| Knowledge | Product/brand/guideline title, summary, source URL and owner-set human-review flag | No source crawler, independent verification or vector index. |
| Agents and tasks | All eleven roles, bounded local attempts/outputs and optional owner-confirmed OpenAI output | No provider calls by default, autonomous research or provider tools; generated output is unverified and reviewed. |
| AI request records | Persistent per-organization request reservations, outcomes and returned token usage | Failed attempts consume the request quota; billed currency cost remains unknown rather than zero. |
| Audit and settings | Local action history and configurable operating bounds | No legal retention guarantee or immutable hosted telemetry service. |
| Backup/export/import | Verified SQLite backup; owner JSON export; atomic account/contact import | JSON import is not a complete workspace/authentication restore; sensitive backups require access controls. |

## Production capabilities still missing

- **Live AI assurance and research:** an optional OpenAI task-generation adapter exists, but live credentials/model access, evaluation, source acquisition/verification, provider fallback, charge reconciliation and approved budgets remain prerequisites. It is disabled by default and tested with fixtures.
- **External operations:** authorized LinkedIn/email/CRM/calendar adapters, provider entitlements, scoped secrets, webhook validation, conflict/reconciliation and external idempotency evidence.
- **Enterprise identity/data:** SSO and owner recovery, full session governance, reviewed tenant isolation, managed encryption/keys and retention/deletion/export automation.
- **Durable operations:** production database/migrations, worker queue/scheduler, bounded asynchronous retry/dead-letter handling, observability/alerts and tested recovery/rollback.
- **Release assurance:** accepted performance/availability/RPO/RTO targets, representative security/load/accessibility checks, applicable legal/source-platform review, real pilot evidence and production-owner sign-off.

The interface is initially English. Content-language fields support recording the intended language; they are not a fully translated French interface or Arabic/RTL localization. Full English/French interface coverage and Arabic localization architecture remain follow-on work.

See the [requirement crosswalk](requirements-analysis.md), [local stack decision](LOCAL_ARCHITECTURE.md) and [operations runbook](operations.md) for the corresponding boundaries and acceptance evidence.
