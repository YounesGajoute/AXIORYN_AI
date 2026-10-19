# Local verification record

Date: 19 October 2026. Environment: Windows, Node.js 24.3.0, npm 11.4.2. This is evidence for the local development release, not production acceptance.

## Original-source analysis

All 32 original root documents were read and inventoried. All 31 entries in the historical manifest still match their recorded byte sizes and SHA-256 hashes; the manifest itself is recorded separately. The original documents and pre-existing uncommitted changes were preserved. No commit, branch change, push or deployment was performed.

The analysis reconciles historical revision/status conflicts, requirement identifier drift, eleven agent roles, the Core/Sales authority boundary and implementation gaps. See the [source inventory](source-inventory.json), [governance analysis](governance-analysis.md), [requirements analysis](requirements-analysis.md) and [architecture analysis](architecture-analysis.md).

## Browser walkthrough

The real application was served locally and operated in the in-app browser. A disposable in-memory organization supplied fictional records and test credentials. The persistent default workspace was left without an owner account so its owner can complete first-run setup.

Observed:

- First-run setup form and separate sign-in screen rendered correctly. Owner setup/password protections also ran through automated API tests.
- A test owner signed in; the control center showed four synthetic accounts, three open opportunities and values reconciled to those records.
- Account details displayed source notes, score, buying role, confidence and synthetic labeling.
- A draft was created from a fictional account/contact, submitted for approval, approved with a review note and successfully simulated locally. The result explicitly said no external message was sent.
- A qualification task was assigned to Agent 06, run once and inspected with its source references and warnings.
- All fifteen main navigation destinations rendered their expected headings. Meeting/proposal and outreach tabs share their respective destinations.
- An injected offline AI fixture exposed the owner-only AI action. The confirmation identified destination, model, disclosed data, possible charges and request limits. Its result displayed a structured summary and unverified-output warnings. No OpenAI network request occurred.
- Desktop layout was inspected at 1440 × 1000. Phone layout was inspected at 390 × 844, including menu opening/closing, readable metric cards and no document-width overflow. Off-screen mobile navigation becomes inert when closed.
- Browser console checks returned no errors or warnings during these walkthroughs.

The saved [dashboard screenshot](../artifacts/screenshots/control-center.jpg) contains fictional demonstration data. Screenshot files are ignored by Git.

## Reproducible automated verification

Run `npm run check` and `npm test`. Final command output is saved in [source-check results](../artifacts/check-results.txt) and [test results](../artifacts/test-results.txt).

Tests cover authentication, CSRF/origin checks, tenant references, role/session revocation, transactional imports, exact-content approval/replay/expiry, suppression, frequency/quiet-window/meeting policy, task limits, concurrency races, audit failure rollback, persistence, Core module contracts, browser-output escaping, stylesheet policy and offline provider transport/lifecycle contracts. The final totals are recorded in [implementation status](implementation-status.md).

The backup regression opens a live WAL database, writes 500 fixture rows, creates a separate consistent backup and reads its restored rows and integrity result. It also verifies overwrite/same-file refusal and that a missing source creates no output. Test cleanup is confined to generated temporary paths.

## Verification limits

No paid API call, live model quality evaluation, authorized external research, LinkedIn publication, email delivery, external CRM sync, cloud deployment, hosted CI run, production load test, SSO assessment or jurisdiction-specific policy approval was performed. Offline provider fixtures verify the transport and control logic, not access to a particular real model or the factual accuracy of its output. Node 24.3 reports the built-in SQLite module as experimental.

The production prerequisites in [operations](operations.md) remain open. Historical requirements and governance decisions were not marked accepted by this local test run.
