# AXIORYN AI

A local workspace for industrial B2B sales: research evidence, accounts and contacts, buying committees, qualification, campaign and outreach preparation, approvals, follow-up, CRM, and reporting. AXIORYN AI Core owns authentication, permissions, workflow state and audit; CAI Sales Manager coordinates commercial work through that boundary.

This release is a local application. Its eleven agents use deterministic logic by default. An optional OpenAI task-generation adapter is disabled until the owner configures it and explicitly confirms each provider call. LinkedIn, email and external CRM connections remain disabled. Approval and delivery previews are local simulations; they never publish, send messages, synchronize a real CRM, or represent a message as delivered. Example records are explicitly synthetic.

## Run locally

Install **Node.js 24.3 or newer**. There are no package dependencies to install.

From the project directory:

```text
npm start
```

On Windows, you can also double-click `Start-AXIORYN.cmd` and leave its window open while using the app.

You can also run `node server/start.mjs` directly. Open [http://127.0.0.1:3000](http://127.0.0.1:3000). On first use, enter your name, email, organization and a password of 12–256 characters in the setup form. This creates the owner account and clearly labeled synthetic examples. There are no default credentials. Keep this account's password safe; other users and roles are managed from the application.

The server listens on `127.0.0.1` by default. The SQLite database persists at `data/axioryn.db`. Configuration comes from environment variables; `.env.example` documents the available names but is **not loaded automatically**.

| Variable | Default | Purpose |
|---|---|---|
| `HOST` | `127.0.0.1` | Loopback address: `127.0.0.1`, `localhost` or `::1`. |
| `PORT` | `3000` | HTTP port. |
| `AXIORYN_DB` | `data/axioryn.db` | SQLite database path. |

For example, in PowerShell:

```powershell
$env:PORT = '3001'
$env:AXIORYN_DB = 'data/pilot.db'
npm start
```

Use `npm run dev` for local development with server file watching. This launcher accepts loopback addresses only. A shared or internet deployment requires a separate reviewed configuration and the identity, HTTPS, storage, operations and release controls described in [operations](docs/operations.md).

## Explore the workspace

Create the owner account and inspect the synthetic examples provided at setup. The example journey is:

1. Review a company and its evidence, then add or verify account information.
2. Review contacts and buying roles; qualify the account with an explained score.
3. Run bounded agent tasks and inspect workflow results.
4. Prepare a content or outreach draft and submit it for human review.
5. Approve or reject the local proposal, then inspect follow-up and CRM records.
6. Review audit history and analytics. Simulated activity remains labeled and external delivery remains unavailable.

The application covers an executive dashboard; agent/workflow controls; company and contact management; buying committees; competitor intelligence; a content studio; campaign/outreach preparation; approvals; follow-up and meeting records; CRM opportunities and internal proposals; analytics; product/brand knowledge records; integration status; user/settings controls; and audit history. Content dates are planning records rather than publishing jobs. Knowledge verification is an owner-set human-review flag rather than independent source verification. Owners can export workspace records; account/contact imports are transactional. A registered agent does not imply a live model or data-source connection.

## Validate and back up

```text
npm run check
npm test
npm run backup
```

The check command validates application sources. The test command runs the repository's automated tests. The backup command creates a verified SQLite copy and prints its destination. See [operations](docs/operations.md) before restoring or moving data. Validation results and remaining limitations are tracked in the [implementation status](docs/implementation-status.md); do not infer a passing test count from this README.

## Optional OpenAI task generation

The application works without an API key. To enable provider-backed task output, set all three variables in the **server process environment** and restart:

| Variable | Required value |
|---|---|
| `AXIORYN_AI_ENABLED` | `true` |
| `OPENAI_API_KEY` | Your authorized project API key, supplied securely through the environment. |
| `OPENAI_MODEL` | An explicitly selected model compatible with Responses structured outputs. There is no default model. |

The server does not load a `.env` file automatically. Never place the key in browser code, imported records, task briefs or committed files. Only the owner can request a provider run, and each call requires an explicit confirmation. It may incur API charges.

Provider input includes the task brief, selected account context and human-reviewed knowledge. Structured contact details are excluded, but free-text briefs, account notes and knowledge may contain sensitive information: review them before confirming transmission to OpenAI. Generated output remains unverified and requires human review. No paid/live provider call was made to validate this release; provider tests use fixtures. See [operations](docs/operations.md) for limits and behavior, and [official OpenAI Structured Outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses) for the response-format mechanism.

## Documentation and scope

- [Requirements analysis and requirement crosswalk](docs/requirements-analysis.md)
- [Architecture analysis and implementation contracts](docs/architecture-analysis.md)
- [Local architecture decision and stack tradeoffs](docs/LOCAL_ARCHITECTURE.md)
- [Feature coverage and remaining capability gaps](docs/feature-coverage.md)
- [Operations, backup and recovery](docs/operations.md)
- [Implementation status and remaining production work](docs/implementation-status.md)

The original governance documents are retained as historical source material. The current build request authorizes local software implementation; it does not silently accept every proposed policy, activate external accounts or certify production readiness. Live provider credentials/model access and evaluation, permitted source integrations, production SSO, operational policy and deployment/recovery evidence remain separate prerequisites.
