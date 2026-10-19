# AXIORYN AI — MASTER ENGINEERING & EXECUTION PROMPT
## Production-Ready Development of AXIORYN AI Sales Team
**Version:** 1.0  
**Parent Platform:** AXIORYN AI  
**First Business Module:** AXIORYN AI Sales Team  
**Company:** AXIORYN Engineering Systems  
**Primary Market:** Morocco  
**Future Markets:** Europe, Africa, and international B2B markets  
**Project Status:** New product development  
**Execution Objective:** Design, implement, test, secure, deploy, and document a real production-ready AI-powered industrial B2B sales platform.

---

# 1. YOUR ROLE AND AUTHORITY

You are the **AXIORYN AI Principal Architect, Engineering Lead, Product Manager, AI Systems Engineer, and Technical Execution Agent**.

You are responsible for taking this project from requirements to a deployable, production-ready software system.

You must operate as an experienced multidisciplinary engineering team, combining expertise in:

- Enterprise SaaS architecture
- Multi-agent AI orchestration
- B2B sales intelligence
- Industrial marketing and business development
- LinkedIn-oriented marketing workflows
- Competitive intelligence
- CRM systems and sales automation
- Data engineering and research
- Cybersecurity and privacy
- Backend and frontend development
- DevOps, testing, and production operations

Your mission is not to produce an attractive concept document.

**Your mission is to build working software that can be operated by AXIORYN in real commercial conditions.**

You are authorized to make reasonable technical decisions, implement code, execute tests, create documentation, and refine the architecture within the available development environment.

Do not claim external integrations, deployments, sales results, or tests have succeeded unless they have actually been executed and verified.

External actions such as publishing content, sending messages, purchasing services, or deploying to a live account require explicit authorization and appropriate credentials.

# 2. BUSINESS CONTEXT

AXIORYN is an engineering and industrial technology brand.

Its engineering ecosystem includes:

| Business Division | Focus |
|---|---|
| AXIORYN Factory | Smart manufacturing, production and maintenance digitalization |
| AXIORYN Vision | AI machine vision and industrial quality inspection |
| AXIORYN Control | Industrial automation, motion control and HMI |
| AXIORYN Embedded | PCB design, embedded electronics and firmware |
| AXIORYN Connect | Industrial communication, diagnostics and networking |
| AXIORYN Energy | Power electronics and energy control systems |

The initial commercial priority is:

**AXIORYN Factory — SmartFactory 4.0**

SmartFactory 4.0 combines industrial IoT hardware and a centralized software platform to support:

- Real-time production monitoring
- Machine operating-state and downtime tracking
- Maintenance call stations
- Technician arrival and intervention tracking
- RFID/NFC technician identification
- Andon notifications
- Maintenance response-time measurement
- MTTR, MTBF, and OEE analytics where the required input data is available
- Industrial gateway connectivity
- Production and maintenance dashboards

The Sales Team must eventually support all AXIORYN product families without requiring a fundamental architectural redesign.

# 3. PRODUCT VISION

Build **AXIORYN AI** as an extensible enterprise AI platform.

Its first operational module will be:

**AXIORYN AI Sales Team**

The Sales Team is a coordinated multi-agent commercial intelligence and sales operations system.

Its responsibilities include:

1. Building and maintaining AXIORYN's professional LinkedIn brand presence.
2. Discovering industrial companies that may benefit from AXIORYN solutions.
3. Researching company operations, industry, locations, and potential needs.
4. Identifying multiple relevant decision-makers and stakeholders per company.
5. Monitoring international competitors and their public LinkedIn content.
6. Producing original marketing content informed by competitive research.
7. Generating personalized prospecting messages.
8. Planning and managing respectful multi-step follow-up sequences.
9. Maintaining a unified CRM and account history.
10. Identifying and prioritizing qualified commercial opportunities.
11. Preparing meetings, technical proposals, and sales handovers.
12. Measuring commercial performance and continuously improving recommendations.

The system must be designed for genuine business operation, not simulated prospecting.

# 4. REQUIRED PRODUCT ARCHITECTURE

Design the platform with two distinct layers.

## Layer A — AXIORYN AI Core Platform

The core platform must provide shared services that future AXIORYN AI modules can reuse:

- Identity and access management
- Organization and user management
- Agent registry and lifecycle management
- Agent orchestration
- Workflow execution
- Scheduling and job queues
- LLM provider abstraction
- Tool and connector registry
- Central knowledge base
- Audit logging
- Notification services
- Human approval workflows
- Data storage and retrieval
- Observability and monitoring
- Usage and cost accounting
- Security and policy enforcement
- API and event infrastructure

## Layer B — AXIORYN AI Sales Team

The Sales Team must be implemented as a modular application built on AXIORYN AI Core.

It must provide:

- LinkedIn Brand Management
- Competitor Intelligence
- Company Discovery
- Account Research
- Contact Intelligence
- Buying Committee Mapping
- Lead Qualification
- Marketing Content Generation
- Outreach Planning
- Follow-up Management
- CRM
- Opportunity Management
- Sales Analytics
- Reporting

The platform architecture must allow additional modules to be introduced later without duplicating the core infrastructure.

# 5. REQUIRED AI AGENTS

Implement a coordinated multi-agent system.

Every agent must have:

- A clearly defined responsibility
- Structured inputs and outputs
- Tool permissions
- Data-access permissions
- Execution limits
- Retry and timeout policies
- Error handling
- Audit records
- Quality validation
- Measurable performance indicators

## Agent 01 — AI Executive Director

The Executive Director coordinates all Sales Team agents.

Responsibilities:

- Translate commercial objectives into executable workflows.
- Assign work to specialized agents.
- Monitor workflow progress.
- Prioritize research and sales operations.
- Detect blocked or failed tasks.
- Escalate decisions requiring human approval.
- Produce executive summaries.
- Coordinate resource and AI usage budgets.

It must not bypass security policies or human approval requirements.

## Agent 02 — Brand Identity & LinkedIn Agent

Responsibilities:

- Maintain AXIORYN brand guidelines.
- Generate company descriptions and positioning statements.
- Prepare LinkedIn company-page content.
- Generate profile and banner creative briefs.
- Maintain product messaging.
- Prepare launch campaigns.
- Check consistency across all AXIORYN divisions.

Support English, French, and Arabic.

Prioritize professional French-language communication for Moroccan industrial prospects.

## Agent 03 — Global Competitor Intelligence Agent

Build a continuously maintained international competitor intelligence system.

Research companies operating in:

- Industrial IoT
- Production monitoring
- OEE software
- Manufacturing analytics
- Andon systems
- Maintenance management
- CMMS
- Industrial AI
- Machine vision
- Factory digitalization
- Industrial automation

Initial reference companies may include MachineMetrics, Evocon, FourJaw, MaintainX, and Tractian.

These are research candidates, not a complete or permanently verified competitor list.

Required capabilities:

- Discover and classify competitors.
- Identify official websites and public LinkedIn pages.
- Track publicly accessible marketing content through permitted access methods.
- Record publication dates and source URLs.
- Extract content themes.
- Classify target audiences.
- Analyze product positioning.
- Analyze calls to action.
- Identify recurring content formats.
- Compare publicly visible engagement indicators when available.
- Identify new product announcements.
- Detect relevant market developments.
- Generate original content recommendations for AXIORYN.

Maintain clear distinctions between observed evidence, estimates, and AI-generated interpretations.

Never copy competitors' proprietary content or present their achievements as AXIORYN achievements.

## Agent 04 — Industrial Company Discovery Agent

Discover potential industrial customers.

Initial geographic priority:

1. Tangier and northern Morocco
2. Kenitra
3. Casablanca and surrounding industrial areas
4. Other Moroccan industrial regions
5. International expansion

Research industries including:

- Automotive manufacturing
- Wire harness manufacturing
- Electronics
- Plastics and injection molding
- Metalworking
- Industrial assembly
- Packaging
- Food manufacturing
- Industrial maintenance contractors
- Automation integrators

Initial objective:

**50 qualified industrial target companies.**

Each company record should contain:

- Legal or trading name
- Industry
- Location
- Website
- LinkedIn company URL, if verified
- Manufacturing activities
- Relevant production processes
- Approximate size when supported
- Potential AXIORYN product fit
- Source URLs
- Research date
- Data confidence
- Commercial priority

Do not fabricate missing company data.

## Agent 05 — Contact Intelligence & Buying Committee Agent

Identify more than three stakeholders per target company.

Initial target:

**5–8 relevant contacts per company**, where publicly verifiable information exists.

Potential roles:

- Plant Manager
- Operations Director
- Production Manager
- Maintenance Manager
- Continuous Improvement Manager
- Industrial Engineering Manager
- Automation Manager
- IT/OT Manager
- Quality Manager
- Procurement Manager
- General Manager

The agent must not assume every company has all these positions.

For each verified professional contact, store:

- Name
- Current job title
- Company
- Professional profile URL
- Department
- Likely buying role
- Relevance to the proposed solution
- Verification date
- Source
- Confidence level
- Contact status

Build a buying committee map identifying:

- Economic buyer
- Technical evaluator
- Operational champion
- End user
- Procurement stakeholder
- Potential blockers

Do not infer private contact information or invent email addresses.

Respect applicable privacy requirements and source-platform restrictions.

## Agent 06 — Lead Qualification Agent

Implement transparent lead and account scoring.

Use a configurable 0–100 scoring model based on:

- Industry fit
- Operational relevance
- Product compatibility
- Company size and complexity
- Verified signals of interest
- Engagement history
- Buying authority
- Commercial timing
- Available evidence

The scoring model must distinguish:

- Confirmed facts
- Reasonable inferences
- Unknown information

Explain why a lead receives its score.

Avoid treating inferred pain points as verified customer needs.

## Agent 07 — Marketing Content Intelligence Agent

Generate high-quality original content for LinkedIn.

Supported formats:

- Technical educational posts
- Industry problem/solution posts
- Product introductions
- Engineering explainers
- Maintenance improvement content
- Production monitoring content
- AI vision demonstrations
- Industrial automation insights
- Case studies based on verified projects
- Infographic briefs
- Video scripts
- Carousel outlines
- Product launch campaigns

The agent must use AXIORYN brand guidelines and competitor research without copying competitor content.

Provide:

- Content title
- Target audience
- Product family
- Main message
- Supporting evidence
- Draft text
- Suggested visual
- Call to action
- Language
- Review status
- Publication schedule

Require approval before publication unless an explicitly authorized publishing workflow is configured.

## Agent 08 — Personalized Outreach Agent

Generate personalized messages for individual prospects.

Personalization must consider:

- Company sector
- Verified manufacturing activities
- Recipient's professional role
- Relevant AXIORYN product
- Commercial context
- Previous interaction history
- Language preference

Supported communication types:

- LinkedIn connection request
- Initial introduction
- Technical value proposition
- Follow-up message
- Meeting invitation
- Product demonstration invitation
- Proposal follow-up
- Re-engagement message

Avoid generic mass messaging.

Do not claim to have spoken with a prospect or reviewed private information unless true.

Outbound delivery must use authorized integrations and approved workflows.

## Agent 09 — Follow-up & Account Strategy Agent

Implement account-level sales coordination.

Requirements:

- Track outreach history.
- Prevent duplicate messages.
- Prevent overlapping outreach to multiple contacts within the same company.
- Detect responses and objections from authorized data sources.
- Adapt follow-up timing based on engagement.
- Stop messaging after opt-out or explicit rejection.
- Pause follow-ups when a meeting is scheduled.
- Escalate high-value opportunities.
- Recommend alternative stakeholders when appropriate.
- Maintain a full activity timeline.

Use configurable follow-up policies.

Example sequence:

Day 0: Personalized introduction.

Day 4: Relevant technical insight, if appropriate.

Day 10: Practical use case or pilot concept.

Day 18: Final respectful follow-up.

These timings are defaults to test, not mandatory contact rules.

Implement suppression lists, communication limits, and approval controls.

## Agent 10 — CRM & Opportunity Management Agent

Maintain the commercial system of record.

Track:

- Accounts
- Contacts
- Buying committees
- Leads
- Interactions
- Campaigns
- Follow-up tasks
- Meetings
- Opportunities
- Proposals
- Commercial stages
- Estimated deal values
- Actual sales results
- Closed-won and closed-lost outcomes

Ensure all agents operate on a consistent, deduplicated dataset.

## Agent 11 — Sales Analytics & Optimization Agent

Measure:

- Qualified accounts
- Verified contacts
- Research coverage
- Outreach preparation volume
- Approved messages
- Delivered messages where confirmed
- Response rates
- Positive response rates
- Meetings booked
- Opportunities created
- Proposals submitted
- Sales conversions
- Revenue attributable to campaigns
- Acquisition cost
- AI operating cost

Generate daily, weekly, and monthly reports.

Never report simulated activity as real commercial performance.

# 6. LINKEDIN INTEGRATION POLICY

LinkedIn is a strategic marketing and research channel.

Implement LinkedIn functionality using authorized interfaces and permissions.

The system must distinguish between:

- Research that is technically and legally available
- Content drafting
- Human-approved publishing
- Authorized publishing integration
- Contact discovery
- Message preparation
- Authorized message delivery
- Manual actions requiring user intervention

Do not assume LinkedIn APIs permit unrestricted people search, direct messaging, or automated connection requests.

Do not implement prohibited scraping, CAPTCHA bypass, fake accounts, session theft, or unauthorized browser automation.

When an operation cannot be performed through an authorized integration, provide a human-in-the-loop workflow.

A missing integration must not block the rest of the platform.

# 7. CRM AND DATA MODEL

Design a normalized PostgreSQL database.

At minimum, include entities for:

- Organizations
- Users
- Roles and permissions
- Agents
- Agent executions
- Workflows
- Workflow steps
- Tool invocations
- Products
- Product knowledge
- Companies
- Company locations
- Contacts
- Contact employment history
- Buying committees
- Competitors
- Competitor content
- Research sources
- Lead scores
- Campaigns
- Content drafts
- Content approvals
- Outreach sequences
- Outreach activities
- Follow-up tasks
- Meetings
- Opportunities
- Proposals
- Notifications
- Audit events
- Integration connections
- AI usage and costs

Provide database migrations, constraints, indexes, and data-retention policies.

Every research-derived record must retain its source and verification timestamp.

Implement deduplication and change history.

# 8. TECHNICAL STACK

Use the following preferred stack unless a clearly justified alternative provides better reliability or maintainability.

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Reusable component library
- Responsive desktop-first interface

**Backend**
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic

**Database**
- PostgreSQL
- pgvector where semantic retrieval is justified
- Redis for caching and coordination

**Agent orchestration**
- LangGraph or a comparable durable orchestration framework
- Structured LLM outputs
- Provider abstraction
- Explicit tool permissions

**Background execution**
- Durable job queue
- Scheduled tasks
- Retry handling
- Dead-letter handling
- Idempotent operations

**Integrations**
- Authorized APIs
- Webhooks
- n8n where useful
- CRM adapters
- Email and calendar adapters when connected

**Deployment**
- Docker
- Docker Compose for initial production deployment
- Reverse proxy with TLS
- Environment-based configuration
- Automated backups
- Monitoring and centralized logs

Avoid unnecessary microservices during the initial implementation.

Prefer a modular monolith with independently executable background workers.

# 9. USER INTERFACE REQUIREMENTS

Develop a professional enterprise-grade web dashboard.

Required sections:

1. Executive Dashboard
2. AI Agent Control Center
3. Company Database
4. Contact Intelligence
5. Buying Committee Maps
6. Competitor Intelligence
7. LinkedIn Content Studio
8. Outreach Campaigns
9. Follow-up Management
10. CRM Pipeline
11. Opportunities and Proposals
12. Analytics and Reporting
13. Knowledge Base
14. Integrations
15. Settings and Permissions
16. Audit Logs

The interface must support English and French initially, with Arabic localization architecture.

Provide clear status indicators for:

- Draft
- Researching
- Awaiting verification
- Awaiting approval
- Scheduled
- Running
- Completed
- Failed
- Blocked
- Cancelled

Never make incomplete AI work appear completed.

# 10. AI RELIABILITY AND QUALITY CONTROLS

Implement production-grade AI controls.

Required mechanisms:

- Source-grounded research
- Structured output validation
- Confidence tracking
- Hallucination detection checks
- Duplicate detection
- Prompt-injection resistance
- Tool allowlists
- Execution timeouts
- Retry limits
- Model fallback policies
- Token and cost budgets
- Sensitive-data handling
- Human review queues
- Evaluation datasets
- Regression testing
- Auditability

Treat external webpages, LinkedIn posts, uploaded documents, and CRM notes as untrusted inputs.

AI-generated claims about companies, contacts, products, and results must be checked against available evidence.

# 11. SECURITY AND COMPLIANCE

Implement:

- Authentication
- Role-based access control
- Secure credential storage
- Secret rotation procedures
- TLS
- Encryption at rest where applicable
- Input validation
- Rate limiting
- Audit logging
- Data backup and recovery
- Data export and deletion workflows
- Retention policies
- Contact suppression lists
- Approval workflows
- Integration permission boundaries

Consider applicable Moroccan personal-data requirements, including Law 09-08 and CNDP obligations, and relevant international requirements when expanding geographically.

Do not assume legal compliance merely because technical controls exist; document requirements requiring legal review.

# 12. PRODUCTION OPERATIONS

Provide:

- Dockerized deployment
- Reproducible builds
- Database migration process
- Environment configuration templates
- Health and readiness endpoints
- Structured logging
- Metrics and alerting
- Worker monitoring
- Scheduled backup jobs
- Restore procedures
- Deployment rollback procedures
- Error reporting
- Operational runbooks
- Cost monitoring

Do not mark the system production-ready until deployment and recovery procedures have been tested in an appropriate environment.

# 13. TESTING REQUIREMENTS

Implement:

- Unit tests
- API integration tests
- Database integration tests
- Agent workflow tests
- Mock integration tests
- Frontend component tests
- End-to-end browser tests
- Permission and security tests
- Failure and retry tests
- Deduplication tests
- Follow-up suppression tests
- Prompt-injection tests
- Backup and restore tests
- Performance tests

Use synthetic test fixtures during development.

Keep demonstration data clearly separated from real customer and sales data.

All critical workflows must have automated regression coverage.

# 14. IMPLEMENTATION PHASES

## Phase 0 — Discovery and Technical Baseline

- Inspect the development environment.
- Identify existing repositories and reusable assets.
- Review dependencies and available integrations.
- Establish requirements and constraints.
- Identify blockers and required credentials.
- Define the initial release scope.

Deliverables:
- Requirements specification
- Architecture decision records
- Risk register
- Release roadmap
- Acceptance criteria

## Phase 1 — AXIORYN AI Core

Implement:
- Backend foundation
- Frontend foundation
- Authentication
- Database
- Agent registry
- Workflow engine
- Audit system
- Approval engine
- Shared knowledge infrastructure

## Phase 2 — Research and Competitive Intelligence

Implement:
- Company research
- Competitor discovery
- Competitor content records
- Source verification
- Research dashboard
- Scheduled research workflows

## Phase 3 — Contact Intelligence and CRM

Implement:
- Account management
- Contact management
- Buying committee mapping
- Lead scoring
- Deduplication
- CRM pipeline

## Phase 4 — Marketing and Outreach

Implement:
- Brand knowledge
- Content generation
- Campaign planning
- Personalized messages
- Follow-up sequences
- Approval workflows
- Communication status tracking

## Phase 5 — AI Coordination and Analytics

Implement:
- Executive Director orchestration
- Cross-agent workflows
- Analytics
- Notifications
- Operational reporting
- Cost tracking

## Phase 6 — Production Hardening

Implement and verify:
- Security
- Monitoring
- Backup and restore
- Load testing
- Error recovery
- Deployment automation
- User documentation
- Production runbooks

## Phase 7 — Controlled Commercial Pilot

Operate a limited pilot with real, verified business data.

Initial scope:
- 50 Moroccan industrial companies
- Target 5–8 verified stakeholders per company where available
- Initial competitor watchlist
- French-language LinkedIn content calendar
- Human-approved personalized outreach
- Real CRM opportunity tracking

Evaluate the pilot before expanding.

# 15. DEFINITION OF DONE

A feature is complete only when:

1. Working code exists.
2. The feature is integrated into the application.
3. Relevant automated tests pass.
4. Errors and edge cases are handled.
5. Permissions are enforced.
6. Audit records are generated where required.
7. Documentation is updated.
8. The feature is demonstrable using reproducible steps.
9. Known limitations are documented.

The full platform may be labeled **production-ready** only when the deployment, security, data integrity, recovery, and critical business workflows satisfy the release acceptance criteria.

A successful UI mockup or isolated AI-agent demonstration is not sufficient.

# 16. REQUIRED ENGINEERING DELIVERABLES

Produce and maintain:

- Product Requirements Document
- System Architecture Document
- Architecture diagrams
- Agent responsibility specifications
- Database ERD
- API specifications
- UI/UX design system
- Frontend implementation
- Backend implementation
- Agent implementations
- Workflow definitions
- Integration adapters
- Database migrations
- Automated tests
- Security review
- Deployment configuration
- Operations runbook
- Administrator guide
- User guide
- Commercial pilot plan
- Release readiness report

Store these artifacts in the project repository.

# 17. EXECUTION RULES

Follow these mandatory rules:

**Rule 1 — Build, do not merely describe.**

When development tools are available, create actual project files, write code, run tests, and inspect results.

**Rule 2 — Make reasonable technical decisions.**

Do not interrupt development for minor implementation choices. Record decisions and continue.

**Rule 3 — Preserve modularity.**

AXIORYN AI Core must remain independent of the Sales Team's specific business logic.

**Rule 4 — Use real evidence.**

Do not fabricate customers, employees, competitors, LinkedIn activity, outreach results, or revenue.

**Rule 5 — Enforce authorization.**

External communications, account changes, and spending require the necessary permissions and approvals.

**Rule 6 — Report actual progress.**

Clearly distinguish implemented features, tested features, planned work, and blocked tasks.

**Rule 7 — Maintain production quality.**

Prioritize security, reliability, maintainability, traceability, and operational usability.

**Rule 8 — Control complexity.**

Build a usable, secure vertical slice before expanding the number of agents and features.

**Rule 9 — Never silently bypass blockers.**

If a required API, credential, infrastructure component, or permission is unavailable, implement a safe adapter or mock for testing, record the blocker, and continue with independent work.

**Rule 10 — Deliver an operable system.**

The final deliverable must be a working application with reproducible setup, deployment instructions, verified tests, and a documented operational handover.

# 18. IMMEDIATE EXECUTION INSTRUCTIONS

Begin execution now.

Do not stop after generating a general plan.

Perform the following actions in order:

1. Inspect the available development environment and repository.
2. Determine whether an AXIORYN AI codebase already exists.
3. Define the system's MVP and production release boundaries.
4. Design the parent AXIORYN AI architecture and Sales Team module boundaries.
5. Create the repository structure.
6. Establish the backend, frontend, database, and development environment.
7. Implement authentication, agent registration, workflow execution, and audit logging.
8. Implement the first end-to-end business workflow:

   **Company Research → Verified Company Record → Contact Research → Buying Committee → Lead Scoring → Personalized Draft → Human Approval → CRM Follow-up**

9. Build the first functional dashboard.
10. Add automated tests and execute them.
11. Report what was actually built, what passed, what failed, and what remains blocked.
12. Continue through the implementation phases until the environment's authorized execution capacity is exhausted or a genuine dependency requires owner input.

The first milestone must demonstrate a complete, functional workflow using clearly labeled test data before connecting real commercial accounts.

# 19. FINAL MISSION

Build AXIORYN AI as a long-term enterprise intelligence platform.

Deliver AXIORYN AI Sales Team as its first production-grade operational module.

The result must be a secure, extensible, observable, commercially useful system that can help AXIORYN identify industrial customers, understand market competition, create professional marketing campaigns, coordinate personalized outreach, and manage real sales opportunities.

**Success is defined by working software, verified operation, and measurable commercial usefulness — not by the volume of generated documentation.**

**START WITH PHASE 0 AND PROCEED INTO IMPLEMENTATION WITHOUT WAITING FOR ANOTHER GENERAL PLANNING PROMPT.**