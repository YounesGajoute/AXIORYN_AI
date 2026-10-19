# Local operations and production handover

This runbook covers the local AXIORYN AI application. It does not establish production readiness or authorize deployment to a live account.

## Runtime and first setup

Use Node.js 24.3 or newer. No dependency installation is needed. Start from the repository directory with `npm start` or `node server/start.mjs`, and open `http://127.0.0.1:3000`.

The first-run form accepts name, email, organization and a 12–256 character password. It creates the owner account, signs in and seeds explicitly synthetic examples. There are no default usernames or passwords. Owners can create operator and reviewer accounts through user management. A fresh database starts a fresh workspace; do not point an existing installation at a new path accidentally.

| Setting | Default | Operator guidance |
|---|---|---|
| `HOST` | `127.0.0.1` | The launcher accepts `127.0.0.1`, `localhost` and `::1` only. |
| `PORT` | `3000` | Select an available local port. |
| `AXIORYN_DB` | `data/axioryn.db` | Set explicitly when running outside the repository or managing more than one local database. |

Set variables in the launching process. The server does not automatically load `.env.example` or a `.env` file. Avoid placing passwords, tokens or customer data in shell commands or source files.

Stop the foreground server with Ctrl+C and wait for it to exit before moving its active database. Restart with the same database path to retain the workspace. Never run two independently configured servers against the same database without a reviewed concurrency plan.

## Authentication, sessions and access

Local authentication uses password hashing with scrypt, server-managed sessions, role checks and CSRF verification for authenticated mutations. Session cookies are HttpOnly and SameSite=Strict, with a 12-hour lifetime. SQLite records carry organization/tenant scope, and server-side authorization enforces that scope. These controls support local development; they are not certification of enterprise multi-tenant isolation.

Sign out when finished; logout revokes the current server-side session. Changing an operator/reviewer's role or disabled state revokes all that user's sessions. Disable the account when access should cease. The protected owner cannot be disabled or reassigned through this interface. There is no production SSO, email password-reset or complete owner-recovery workflow in this release. After an access incident, revoke affected sessions through supported account controls and inspect the audit log. Owner-wide emergency revocation/recovery must be resolved before shared production use; stopping the server alone does not prove persisted sessions were revoked.

Keep the host account and database directory restricted to authorized operating-system users. The local SQLite database and its backups are not encrypted by the application. Use appropriate OS disk encryption and access controls for any sensitive local material. Production encryption, managed keys and secret rotation remain separate work.

## Demonstration and external integration behavior

Demonstration data represents synthetic accounts, people and activity and is seeded during first setup. Keep that distinction visible when reviewing or exporting it. All eleven agent roles execute deterministic local logic by default. The optional OpenAI task adapter is disabled unless configured and explicitly confirmed per call. Live web research, LinkedIn publishing, email delivery and external CRM synchronization remain unavailable.

An approval records a human decision about a local proposal. A simulated execution records the local workflow outcome. Neither is evidence of a real external effect. Integration settings/status must keep unavailable services visible as disabled or unconfigured. Real delivery statistics remain zero unless a later authorized adapter produces verified delivery evidence.

Treat imported notes, source content and AI-like text as untrusted data. They cannot authorize tool use or override permissions. Source URLs, confidence and verification dates help review evidence; they do not by themselves verify the claim or establish a lawful processing basis.

## Optional OpenAI provider

The default application needs no API key and makes no provider calls. To make provider-backed task generation available, configure `AXIORYN_AI_ENABLED=true`, `OPENAI_API_KEY` and `OPENAI_MODEL` in the launching server process, then restart. There is no model default. The selected model must support the Responses/structured-output request used by the adapter; account access and provider compatibility require a real authorized validation. The server never automatically loads `.env` files.

Keep the API key in a secure server environment, never in browser configuration, source files, task text or documentation. Enabling configuration does not automatically run tasks or authorize spending: an authenticated owner must confirm each provider call. To disable the adapter, remove the enable flag or set it to `false` and restart the server; revoke/rotate a compromised key with the provider as appropriate.

Each confirmed call sends task brief text, selected account context and human-reviewed knowledge to OpenAI. Structured contact fields are excluded. Free-text account notes, briefs and knowledge may still contain personal, confidential or commercially sensitive material; inspect the actual inputs before confirming. Human-reviewed knowledge means the owner's flag, not independent evidence verification. Obtain the required processing permissions and provider/data-handling decisions before using real sensitive data.

Selected account context is limited to its ID, name, industry, country, source and notes; knowledge is limited to the first ten human-reviewed entries' IDs, titles and summaries. The task title/brief and agent role are also included. The adapter rejects inputs above 24 KB. Basic email-pattern redaction is not complete personal-data removal and must not replace source review.

Provider-generated results remain unverified and require human review. Structured output constrains response shape; it does not prove factual accuracy. See [official OpenAI Structured Outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses). No live/paid request was made during this release's validation; fixture-based tests cannot establish real model quality, account entitlement, latency or charges.

| Environment variable | Default / limit | Meaning |
|---|---|---|
| `AXIORYN_AI_ENABLED` | Disabled; requires exact `true` | Master opt-in for this adapter. |
| `OPENAI_API_KEY` | No default | Server-side project credential; never returned to the browser. |
| `OPENAI_MODEL` | No default | Explicit Responses/structured-output compatible model chosen by the operator. |
| `AXIORYN_AI_MAX_OUTPUT_TOKENS` | 1,500; clamped to 256–4,096 | Output-token ceiling per request. |
| `AXIORYN_AI_DAILY_REQUEST_LIMIT` | 10; clamped to 1–100 | Persistent organization request quota per UTC day. |

The quota counts reserved attempts, including failures. It is a request limit rather than a currency spending ceiling. Provider requests have a 30-second timeout and task attempts remain bounded to three. A timed-out or rejected request may still consume provider resources; do not assume a failed request is free or safe to retry without review. Token usage is recorded where returned; monetary cost remains unknown until reconciled with the provider's actual billing.

The owner action is `POST /api/tasks/:id/ai-run` with `confirmProviderUse: true`, in an authenticated CSRF-protected request. The browser provides explicit confirmation; do not use configuration enablement as blanket consent for future calls. The adapter uses the fixed official OpenAI Responses endpoint with `store: false`, no provider tools and a strict JSON response schema. It validates output/source references against the supplied record IDs, and still labels generated claims unverified. These controls constrain requests and shape; they do not independently authenticate sources or establish zero retention/legal compliance.

Source changes, loss of the owner session, task cancellation or activation of the pause control during execution cause the returned result to be discarded. After an interrupted server process, a running model task is marked failed and no automatic resend occurs. Review its state, potential provider charge and current input before an explicit retry. The request reservation still counts against the UTC-day quota.

## Validation and troubleshooting

Run the checks from the repository directory:

```text
npm run check
npm test
```

The automated suite should use isolated test data. See `docs/implementation-status.md` for the actual execution evidence from the delivery run. CI runs the same checks on Node 24 without an installation step.

| Symptom | Check and next action |
|---|---|
| Server will not start | Confirm Node is at least 24.3; inspect the reported error; check whether the port is already occupied and the database directory is writable. |
| Application looks empty | Confirm `AXIORYN_DB` and the launching directory. An alternate database creates a separate local workspace. |
| Sign-in fails | Use the account created in the first-run form; there are no default credentials. Do not delete the database to bypass access controls. |
| A task is blocked | Inspect the task and audit details, required input, permissions, approval and integration state. Do not turn blocked work into completed work manually. |
| A message is approved but not delivered | Expected for this local release: external communication adapters are disabled. |
| A record appears uncertain | Add a permitted source and verification information; do not replace unknown data with assumed facts. |
| A follow-up is held | Check suppression, rejection, account/contact policy and meeting state before changing the plan. |

## Backup

Owner-only workspace JSON export is available separately from database backup. It includes application records and settings, not a complete authentication/database snapshot. Account/contact import is transactional and bounded to 2,000 total records per request; it is not a full-workspace restore facility. Use SQLite backup for full recovery.

Run:

```text
npm run backup
```

The command uses `scripts/backup.mjs` and the configured database path to create a separate consistent online SQLite backup; the application may remain running during backup. The default destination is `backups/axioryn-TIMESTAMP.db`. To choose a new destination, use `npm run backup -- backups/pilot-snapshot.db`. Relative paths are resolved from the project directory, and existing destinations are never overwritten. Use the exact destination printed by the command and retain its integrity-verification result. A successful backup alone is not a recovery drill.

Store backups outside the active database directory when establishing a real retention plan. Limit access, encrypt sensitive backup storage and record the database version, application version, time and source path. Retention periods, off-device backup location and recovery targets require owner approval. Backup creation does not delete existing records or backups.

Before an application update, take a verified backup and preserve the currently working application version. If a backup check fails, keep the source unchanged, investigate the error and create a new verified backup after resolving it.

## Restore and recovery drill

Restore is a deliberate operator action. There is no automatic destructive restore command.

1. Confirm the intended workspace and resolve the absolute active database and backup paths. Check that the backup belongs to the intended workspace and application/schema version.
2. Stop the server and verify that it has exited. Do not copy over an active SQLite database or rely on a stale journal/WAL file.
3. Preserve the existing database and any associated SQLite files in a separate recovery location. Do not delete the only available copy.
4. Verify the backup's SQLite integrity using the backup tool's reported result or an approved SQLite inspection utility. Prefer a trial restore into a separate directory first.
5. Copy the verified backup to a new configured database path. Point `AXIORYN_DB` at that path and start the application. This avoids overwriting the current workspace during verification.
6. Check sign-in, expected account/contact counts, relationships, workflow and approval history, suppression states and audit continuity. Confirm that demonstration/real-data labels remain correct.
7. Record the outcome, elapsed recovery time, version and any discrepancy. Only after validation should the operator select the recovered database as the active workspace.

A restored database may contain sessions and access grants that existed at backup time. Revoke sessions and reconcile account/role changes made after the snapshot before resuming shared access. Recovery must not reactivate former users or reset suppression unnoticed.

Rollback requires both the compatible prior application version and a validated database snapshot. Do not assume every future schema change is backward compatible. Restore/recovery tests in a chosen production environment are required before promising an RPO or RTO.

## Incident handling

Restrict access or stop the local service if unauthorized access or data corruption is suspected. Preserve relevant logs, audit and database snapshots with limited access. Revoke affected sessions and credentials using supported controls. Investigate before restarting workflows; local approvals do not authorize external incident communications or provider actions.

Review failed/blocked workflow states rather than repeatedly retrying a denied action. A missing approval, revoked permission, opted-out contact or disabled integration is not a transient failure. Do not log passwords, session tokens, personal contact details or entire untrusted source bodies in incident notes.

## Remaining production decisions and evidence

| Area | Required before a real commercial deployment |
|---|---|
| Hosting and transport | Approved host/region/domain, HTTPS termination, network access restrictions, service lifecycle and monitored health. |
| Identity | Production SSO or hardened account recovery, session expiry/revocation policy, role/action matrix and verified tenant/membership isolation. |
| Storage and secrets | Appropriate database deployment, encryption and managed keys, scoped secret injection, rotation and data access review. |
| AI | Approved provider/model and processing terms; structured outputs, provider error handling, budgets, evaluations, fallback and evidence-grounding checks. |
| LinkedIn/email/CRM | Supported authorized APIs, scoped credentials, permitted action definitions, sandbox tests, approval payload binding, reconciliation and idempotency proof. |
| Data governance | Source permissions, lawful processing review, applicable Moroccan/international requirements, retention/deletion/export procedures, data-subject and suppression handling. |
| Commercial controls | Approved strategy/scoring factors, budgets, contact/account limits, quiet windows, override authority and report definitions. |
| Background work | Durable queue/scheduler, worker ownership, bounded retry/dead-letter handling, restart recovery and safe replay. |
| Reliability | Accepted availability/performance targets, concurrency/load evidence, RPO/RTO, tested encrypted backups, restore and rollback drills. |
| Observability | Correlated logs/metrics, meaningful alerts and named incident ownership, appropriate audit/log retention. |
| Release | Security/dependency review, accessibility and critical-journey checks, environment-specific acceptance evidence, user/admin handover and release-owner sign-off. |

The local build supplies a usable starting workflow. Real-provider operation and production assurance require the above evidence rather than a change to a readiness label.
