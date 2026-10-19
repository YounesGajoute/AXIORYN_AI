# AXIORYN AI — External Integration Governance Proposal
**Status:** PROPOSED / GOVERNANCE ONLY
**Baseline:** GOV-1.0
**Implementation authorization:** NOT GRANTED

## Purpose
This proposal addresses the review findings related to external integration governance, including LinkedIn, CRM, developer/provider and connector access, rate limits, and human approval enforcement. This document is governance-only and does not authorize external access, data sharing, or tool activation.

## Governance principles
- Core is the only technical boundary for connector invocation.
- Sales Manager may request connector usage but cannot bypass Core controls.
- No external system is authorized until platform/legal approvals are explicitly granted.
- All outbound or side-effecting operations require human approval under policy.
- All connector use must be audited with traceable evidence.

## Proposed external integration policy

### 1. LinkedIn access and platform restrictions
**Policy**
- LinkedIn access is NOT approved by this package.
- Any LinkedIn connector or user-facing automation requires explicit platform permission, legal review, and owner approval.
- LinkedIn data processing is restricted to approved use cases only and must not be used for unapproved personal-data collection or non-compliant marketing activity.

**Required decisions**
- Whether LinkedIn access is allowed for account research, outreach, or content generation.
- Whether stakeholder approval is required per campaign or per workflow.
- Which data elements are permitted for ingestion and storage.

**Risks**
- Platform policy violations
- Personal-data misuse
- Unapproved profiling or outreach automation

### 2. CRM integration authorization
**Policy**
- CRM sync remains PROPOSED and not authorized.
- No CRM credential or connector may be created or activated without formal policy approval.
- CRM writes require explicit approval, correlation, and audit evidence.

**Required decisions**
- Which CRM provider and data model are permitted.
- Whether the system can read/write contacts, opportunities, or campaign metadata.
- Whether duplicate resolution logic is owner-approved.

**Risks**
- Data inconsistency and sync conflicts
- Accidental contact or opportunity mutations
- Unapproved vendor dependency

### 3. Connector allowlists
**Policy**
- An allowlist defines connector capabilities and targets.
- No connector is active by default.
- New connector capabilities require owner approval, policy review, and audit design.

**Required decisions**
- Which providers and domains are allowed.
- Which actions are permitted per provider and per tenant.
- Whether some operations are read-only only.

### 4. OAuth and credential scoping
**Policy**
- OAuth or other delegated credentials must be scoped to minimum necessary permissions.
- Credentials must be stored in a policy-controlled secret store and rotated under owner-approved policy.
- Tokens must be scoped by tenant, workflow, and purpose.

**Required decisions**
- Who owns credential management.
- Which expiry, rotation, and revocation schedule is required.
- Whether tokens can be shared across tenants or modules.

### 5. Rate limits and provider quotas
**Policy**
- Every connector must have configured rate-limit controls and per-tenant quotas.
- Retry and backoff must be deterministic and policy-aware.
- Quota thresholds must generate alert, pause, or approval actions.

**Required decisions**
- Whether quota limits are per account, per tenant, or per workflow type.
- Whether quota overages require human approval or automatic throttling.

### 6. Human approval of outbound actions
**Policy**
- Outbound communications, external writes, content publishing, CRM update, and campaign triggers require human approval.
- Approval decision log must include approver identity, reason, timestamp, and correlation ID.
- Policy exceptions require explicit owner or delegated approval and remain auditable.

**Required decisions**
- Who can approve outbound sends and CRM writes.
- Which actions require 2-person control or escalation.
- Whether some actions are automatically blocked entirely.

### 7. Revocation, incident response, and audit evidence
**Policy**
- Connector permissions can be revoked immediately when policy or incident response requires it.
- Every failed or blocked external call must leave an audit record with reason and policy version.
- Incident response must define escalations, evidence retention, and legal review routes.

**Required decisions**
- Which incident thresholds trigger connector suspension.
- Whether evidence must be retained for a fixed window or owner-defined period.

## Security and privacy controls
- Secrets are not embedded in code, prompts, logs, or configuration files.
- External data ingestion must be subject to source provenance and retention controls.
- Personal-data processing requires owner approval, lawful basis review, and data-minimization rules.
- Shared connector capabilities must remain disabled unless explicitly enabled per tenant and workflow.

## Open owner decisions and blockers
- Whether any external platform access is permitted for marketing or CRM at all.
- Whether the project can process LinkedIn personal data or commercial relationship data.
- Whether data residency rules require certain geographic or jurisdictional constraints.
- Whether campaign outbound sends are human-approved only or allow limited operational automation.

## Acceptance status
This governance proposal is PROPOSED and pending owner approval. It does not grant platform authorization or external system access.
