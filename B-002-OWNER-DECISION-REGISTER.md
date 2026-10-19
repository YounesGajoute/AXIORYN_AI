# AXIORYN AI — B-002 Owner Decision Register
**Task:** B-002-DOCUMENTATION-PACKAGE  
**Status:** PROPOSED / PENDING OWNER REVIEW  
**Governance baseline:** GOV-1.0

## Purpose
This register captures the decisions, assumptions, and approval gates needed to progress the B-002 requirements package without treating any proposal as an accepted implementation requirement.

## Confirmed governance constraints
- `main` is canonical project branch.
- `v1` is the preparation and review branch.
- No implementation, branch switching, commit, push, merge, or reset is authorized by this task.
- B-001 remains a review item and is not accepted by this package.
- GOV-1.0 remains pending owner approval.
- ADR-SM-001 Option 1 remains the governing architecture decision for role boundaries.

## Architecture decision summary
**ADR-SM-001 — ACCEPTED**  
Agent 01 is the bounded commercial leadership role within CAI Sales Manager. Agent 09 remains a specialist. AXIORYN AI Core retains exclusive authority over technical orchestration, execution, permissions, approvals, integration access, quotas, audit, and observability. CAI Sales Manager owns commercial strategy and domain coordination within owner-approved policy. No separate Executive Director is approved.

## Scope boundaries and exclusions
### In scope
- Business and governance use cases for AXIORYN AI Sales Team
- Commercial workflow definitions for CAI Sales Manager
- Non-functional requirements and traceability
- Owner decisions and approval gates required before implementation

### Out of scope
- Application code implementation
- Database migrations or schema creation
- External integration activation
- Commercial service provisioning or purchasing
- Unapproved automation or production deployment
- Ownership, legal, or platform approvals outside the documented governance process

## Open owner decisions and assumptions
| Decision item | Status | Notes |
|---|---|---|
| Final product scope for AXIORYN AI Sales Team | PROPOSED | Requires owner confirmation |
| Approved channels and external-platform policies | PROPOSED | LinkedIn, CRM, and vendor access remain unapproved |
| CRM vendor and data residency constraints | PROPOSED | No selection or activation implied |
| Data retention, privacy, and deletion thresholds | PROPOSED | Must be approved before production usage |
| Role naming and expansion of “CAI” | UNKNOWN | The owner-provided label is used without expanding it |
| B-002 use-case approval | PROPOSED | Governance-only package for review |
| Sales Manager requirement additions | PROPOSED | Not accepted, not implementation-authorized |
| Integration credential model and sandbox rules | PROPOSED | Requires future platform/legal approval |
| Budget and escalation thresholds | PROPOSED | No specific operational limits are yet approved |
| Release quality gates and sign-off criteria | PROPOSED | To be defined in a later authorization step |

## Requirements acceptance checklist
- [ ] Original `R-001` through `R-026` remain preserved and unmodified
- [ ] Original `B-001` through `B-022` remain preserved and unmodified
- [ ] Proposed Sales Manager requirements remain labelled `PROPOSED`
- [ ] Proposed backlog additions remain labelled `PROPOSED`
- [ ] No acceptance claim is made for production implementation
- [ ] No integration or deployment action is implied by this package
- [ ] All new requirements state `TBD_PENDING_OWNER_APPROVAL` where targets are proposed
- [ ] Architecture aligns with ADR-SM-001 Option 1

## Assumptions retained for this package
- CAI Sales Manager is the commercial decision layer, not a duplicate execution runtime
- Core remains the single technical orchestration and policy boundary
- Agent 01 remains bounded within Sales Manager and cannot bypass Core controls
- Users, operators, and owners are expected to be human actors subject to approval policies
- This package is a governance deliverable only and is not evidence of implementation readiness

## Owner authorization statement
This B-002 package is prepared for owner review only. It does not approve GOV-1.0, B-001 acceptance, or implementation. Any subsequent phase requires explicit owner authorization.
