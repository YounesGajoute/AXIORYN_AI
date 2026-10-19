# Local implementation architecture decision

Record: LOCAL-ADR-001. Date: 19 October 2026. Status: engineering choice for the requested local implementation; **not an assertion that the owner approved this exact technology stack or the historical proposed ADRs**.

## Context and selected approach

The repository began as a governance and product-specification package. The user requested a deep review followed by a complete working application. The master prompt prefers React/TypeScript/Vite, FastAPI, PostgreSQL, Redis, a durable worker and Docker. Those choices remain relevant to a production implementation, but a local release can establish the business workflows without requiring multiple runtimes, external downloads or commercial accounts.

This release selects Node.js 24.3 or newer, built-in HTTP/crypto/SQLite functionality, and buildless browser JavaScript/CSS. It has no package dependencies to install. One local server serves the interface and API and persists data in SQLite. It binds to loopback only. This is a reversible local engineering tradeoff, not a production infrastructure selection.

## Component boundaries

```text
Browser interface (public/)
  → same-origin authenticated /api requests
Local application (server/app.mjs)
  → identity, CSRF, roles, records, approvals, audit and workflow state
Core registry/policy (server/core.mjs)
  → module/agent schema, tenant and local-tool permission checks
Sales module (server/sales.mjs)
  → eleven deterministic specialist definitions and bounded local outputs
Optional provider boundary (server/providers.mjs)
  → owner-confirmed, default-disabled OpenAI task output
SQLite database
  → organization, users, hashed sessions, scoped records and configuration
```

The executable starts in `server/start.mjs`. The Sales module does not obtain live connector credentials. Its default registered tools are local reads and deterministic output preparation. Optional provider execution is a separate owner-confirmed server boundary; it does not grant agents unrestricted network tools. CAI Sales Manager supplies commercial intent through Core; Agent 01 does not become a second technical runtime, and Agent 09 does not gain managerial authority.

The current application registers the Sales module. Validating a module contract and rejecting unauthorized capabilities demonstrates an extensibility boundary; it does not establish a marketplace, dynamic code loading or production compatibility with arbitrary modules.

## Tradeoffs and migration path

| Choice | Benefit for this release | Limitation / future option |
|---|---|---|
| Node 24.3+ built-ins | Reproducible single-runtime setup with no dependency installation | Not the preferred Python/FastAPI stack; future provider/worker requirements may justify additional services or a backend migration. |
| Buildless JavaScript/CSS | Interface works directly from the checkout; no bundler/build artifact is needed | Not React/TypeScript/Tailwind; static type checking, component tooling and frontend test tooling would need a deliberate migration. |
| SQLite | Durable local records, transactions, foreign keys, online backups and simple operation | Local single-node operation; not PostgreSQL/pgvector, managed encryption or certified multi-tenant isolation. |
| Scoped generic records | Fast implementation of interrelated sales entities with application validation | Not the full normalized PostgreSQL ERD requested for production; relationship consistency depends partly on application validation. |
| Default deterministic specialist logic | Repeatable tests and useful planning summaries without provider secrets | Optional OpenAI task generation requires explicit configuration/confirmation; no autonomous research, provider fallback or validated live-model quality. |
| Explicit task runs in one process | Persisted, inspectable local task states and bounded retry controls | No durable asynchronous queue, background delivery scheduler or distributed worker recovery. |
| Local approvals/simulation | Concrete content/recipient/channel review without contacting anyone | Owner may review their own local proposal; independent approver delegation and real external transactions require production policy and implementation. |
| Local session/role model | Individual accounts, scrypt hashing, expiry, revocation and CSRF-protected mutations | No SSO, full owner recovery, enterprise session governance or internet exposure assurance. |

Keep the workflow outputs, registry contracts and acceptance scenarios stable when replacing persistence, frontend or provider infrastructure. A migration should preserve organization ownership, synthetic labels, provenance, suppression, exact-content approvals, idempotency and audit relationships rather than merely reproduce the screens.

## Storage and compatibility

SQLite uses foreign keys, WAL and a scoped records index. Current schema identity is `PRAGMA user_version = 1`. The application refuses a database with a newer unsupported schema version. Initial schema creation uses built-in SQL; this is not an Alembic migration chain or a proven upgrade/rollback framework. Future schema changes need explicit forward migrations and compatible recovery evidence.

Module manifests, agent input/output contracts and workspace JSON exports also carry schema version 1 where applicable. These identify particular data contracts. They must not be interpreted as a versioned public HTTP API.

The browser uses **unversioned `/api/...` routes**, including `/api/session`, `/api/bootstrap` and collection/action endpoints. There is no `/api/v1` prefix or general API-version negotiation. Bootstrap is an aggregate application response, not a stable external integration contract. A future public API should define versioning, compatibility and deprecation behavior before external clients depend on it. Database schema version, module schema version and HTTP API version must remain separate concepts.

## Security and external boundaries

The local launcher and request host checks restrict access to loopback names. Cookie sessions are HttpOnly and SameSite=Strict, expire after twelve hours and are checked server-side. Mutating authenticated requests require CSRF verification. Owner-managed operator/reviewer access changes revoke those users' sessions. The protected owner does not yet have a complete production account-recovery/emergency-revocation workflow.

The database and backups are not encrypted by the application. OS account permissions and disk encryption are appropriate local protections; production encryption/key management, secret management and audit integrity require separate evidence. Tenant/organization identifiers are enforced in the application, but there is no database row-level security or enterprise multi-tenant production claim.

OpenAI task generation is optional and disabled by default. It requires server environment enablement, key, explicitly selected model and owner confirmation per request. Input is minimized to the task brief, account context and human-reviewed knowledge; structured contact fields are excluded, but user-authored text may still contain sensitive information. Results remain unverified and require human review. No live paid request has been used as release evidence.

The adapter fixes the destination to OpenAI Responses, disables provider tools, requests strict JSON output with `store: false`, bounds output/time, and checks supplied source IDs. Organization quotas count reserved attempts durably, including failures. Returned token usage is distinct from unknown billed cost. These boundaries reduce unintended access and unbounded requests; they do not provide factual verification, complete PII removal, a financial hard cap or a zero-retention/compliance guarantee. See [official OpenAI Structured Outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses) for schema behavior and [operations](operations.md) for exact environment controls.

LinkedIn, email and external CRM remain disabled. Human approval is bound to a concrete local proposal; delivery is explicitly simulated and records no external delivery. Optional AI generation does not grant communication or publishing authority. Future communication connectors must re-check identity, authorization, exact approval, recipient eligibility, suppression, limits and idempotency at execution time.

## Verification and readiness

Run `npm run check` for package/assets/syntax checks and `npm test` for meaningful behavior tests. The GitHub workflow repeats these on Node 24 without dependency installation. The actual delivery evidence belongs in [implementation status](implementation-status.md); a workflow file or test description alone is not proof of a successful run.

The selected stack makes a local application operable and testable. Production still requires approved infrastructure, identity, source/connector permissions, real-model evaluations, privacy/retention policy, durable workers, accepted NFR targets, security/load checks and verified backup/restore/rollback operation. See [operations](operations.md) for the release prerequisites.
