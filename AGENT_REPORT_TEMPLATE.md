# AXIORYN AI — Coding Agent Report Template
**Protocol:** GOV-1.0

> During initialization, agents may inspect and report but must not edit implementation files.

## Required metadata
```yaml
report_id: AGENT-YYYYMMDD-NNN
timestamp_utc: YYYY-MM-DDTHH:MM:SSZ
agent:
task_id:
governance_baseline: GOV-1.0
master_state_revision_seen:
repository_url:
branch:
base_commit:
head_commit:
execution_mode: READ_ONLY # or AUTHORIZED_IMPLEMENTATION
status: COMPLETE | PARTIAL | BLOCKED | FAILED
```

## 1. Objective and authorization
Task scope, authorized paths, prohibited operations, approvals received.

## 2. Repository inventory / changes
Repository tree summary; inspected files; modified/added/deleted files; diffs and commit hashes. For READ_ONLY mode state explicitly: **No files changed**.

## 3. Requirement traceability
| Requirement ID | Evidence | Test ID | Result |
|---|---|---|---|

## 4. Tests and verification
Exact commands, environment, exit codes, test counts, failures, logs, skipped tests and reproducibility steps. Never claim tests passed without execution evidence.

## 5. Architecture and security review
Interface changes; dependency changes; secret handling; authorization; personal data; external API actions; policy and compliance concerns.

## 6. Risks, blockers and deviations
| ID | Severity | Finding | Evidence | Recommended action |
|---|---|---|---|---|

## 7. Proposed master-state patch
Suggested status transitions, newly discovered risks, decisions requiring owner approval, and next task. The coding agent does **not** independently approve its own work.

## 8. Final declaration
State what was done, what was not done, and what remains unverified. Include a machine-readable JSON report if requested.
