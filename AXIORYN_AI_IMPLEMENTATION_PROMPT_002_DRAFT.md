# AXIORYN AI — First Software Implementation Prompt (Draft Only)

**Future task:** B-006 — Core Foundation Contracts and Project Skeleton  
**Execution status:** NOT AUTHORIZED / DO NOT EXECUTE YET  
**Governance version:** GOV-1.0; supersede this prompt if Phase 0 changes any architectural decision.

## Mandatory preconditions — all must be true before execution

1. The owner has explicitly approved GOV-1.0 or its successor, F0/G0 completion and this exact ticket.
2. B-001 read-only repository inventory was independently reviewed and accepted.
3. B-002 business scope/NFRs, B-003 platform and personal-data safeguards, B-004 governance structure and B-005 module contract design are accepted.
4. ADR-001 (runtime/repository), ADR-002 (identity and organization scope), ADR-003 (persistence and job infrastructure) are approved, with exact selected versions and commands.
5. The owner confirms the allowed repository, branch, permitted file paths, and local build/test execution. No external accounts, secret values, production systems or paid services are required.

**If any prerequisite is missing:** Do not code. Return `BLOCKED` under report schema `AXAI-AGENT-REPORT-1.0` with exact missing approval, evidence and dependency.

## Objective
Implement the minimum **AXIORYN AI Core** foundation so future modules, beginning with **AXIORYN AI Sales Team**, can integrate through explicit versioned contracts without copying Core logic. This is an internal foundation deliverable, not a Sales CRM, live AI assistant or external integration.

## Scope of implementation (only after authorization)

- Create or adapt a Core module structure consistent with the *approved* ADRs and observed repository conventions. No unilateral framework rewrite.
- Define typed, versioned contracts for `ModuleManifest`, `AgentDefinition`, `TaskRequest`, `TaskResult`, `ToolCapability`, `PolicyDecision`, `ApprovalRequest`, `AuditEvent`, and `OrganizationContext`. Exact schema/property names must be reconciled with approved ADRs.
- Provide a plugin/module registry and a trivial **local, deterministic mock Sales module** to demonstrate clean registration and dispatch; do not build commercial Sales Team features.
- Introduce default-deny authorization interfaces and an in-process reference policy implementation usable in tests. This is NOT a complete production authorization system.
- Add correlation IDs, a minimal structured audit-event contract and no-secret logging tests. No personal customer data or live credentials.
- Add local automated contract/unit tests, including invalid module manifests, denied capability, cross-organization context rejection, missing approval refusal, deterministic tool failure handling, and schema/version mismatch.
- Prepare a documented migration or compatibility strategy if preexisting artifacts must change; avoid destructive migrations. If a database is not yet approved, avoid selecting it ad hoc.
- Provide developer documentation: module registration sequence, trust boundary, local test commands and intentionally unimplemented production controls.

## Explicit exclusions

- No LinkedIn, CRM, email, contact harvesting, browsing/scraping, network automation or external messages.
- No LLM keys, model inference, embeddings, customer profiles or prospect data.
- No auto-approval of outbound messages or account creation; no paid infrastructure or deployment.
- No claim that a test stub, adapter contract or mock security policy is production-ready.
- No work on B-007 or later tickets except the interfaces strictly needed by this task.

## Acceptance criteria

- AC-101: Core and mock Sales module are separately named and their dependency direction is one-way: Sales → Core interfaces; Core does not import Sales business logic.
- AC-102: Denied/no-approval access fails closed and produces a sanitized, correlated audit decision without external side effects.
- AC-103: Module manifest validation and version compatibility tests cover both positive and negative paths.
- AC-104: Organization scope is explicit in contracts and cannot silently default to a global or another organization in unit tests.
- AC-105: The project's approved build/test/lint/typecheck commands are reproducibly executed; exact passed, failed, skipped counts and logs are attached. Not-run checks are clearly labeled.
- AC-106: No secrets, real personal records or unauthorized external network actions appear in code, fixtures or logs.
- AC-107: The changes remain inside the owner-authorized diff; all architectural deviations get an ADR proposal instead of a silent decision.
- AC-108: Documentation states what is intentionally unfinished, with follow-up backlog links and an honest rollback/revert plan.

## Execution sequence

1. Confirm all gates and input revisions; fail fast with `BLOCKED` if missing.
2. Create a bounded implementation plan and file-change list mapped to R-001, R-002, R-003, R-015, R-017, R-021 and R-026.
3. Implement only the smallest approved foundation increment.
4. Run and capture deterministic tests/linters, security checks and evidence, as authorized.
5. Deliver the full standardized report and sanitized diff references; mark `READY_FOR_REVIEW`, **not** `ACCEPTED` or `COMPLETE`.

## Required output

Respond in English using `AXAI-AGENT-REPORT-1.0` fields and append: requirement-to-acceptance-test matrix, file list, commands and exit codes, architecture/dependency notes, tests skipped, security findings, backwards-compatibility analysis and all remaining risks. Wait for independent governance review and owner acceptance before proceeding.
