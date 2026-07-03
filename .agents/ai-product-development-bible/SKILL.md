---
name: ai-product-development-bible
version: 1.0
description: End-to-end AI-assisted product development operating system for building robust SaaS apps, web apps, AI products, internal tools, portals, dashboards, workflow platforms, and enterprise-grade applications. Use this skill to guide agents from idea validation through planning, design, architecture, implementation, testing, security, release, support, analytics, and continuous improvement.
---

# AI Product Development Bible - Agent Skill

## Purpose

Use this skill whenever you are asked to plan, design, build, review, improve, test, deploy, or production-harden a software product. This includes SaaS applications, web apps, AI-powered products, agentic workflows, enterprise dashboards, client portals, workflow platforms, internal tools, MVPs, pilots, and production-grade releases.

The goal is not only to make an application work. The goal is to make it useful, usable, secure, reliable, maintainable, measurable, supportable, operable, and commercially meaningful.

## Core Operating Principle

AI can accelerate product development, but it must not replace product ownership, product judgment, engineering discipline, security discipline, usability review, QA/QC, launch discipline, customer support, or commercial readiness.

A working app is not always a real product. A real product is something users can trust, adopt, and continue using without the builder sitting beside them.

## Non-Negotiable Rules

1. No documents, no code.
2. Build only the requested scope.
3. Do not over-engineer early versions.
4. Do not remove existing functionality unless explicitly instructed.
5. Use approved documents as the source of truth.
6. Never invent requirements that conflict with approved documents.
7. Never hardcode secrets, API keys, tokens, passwords, or credentials.
8. Every major requirement must be traceable to implementation and test evidence.
9. Every user-facing workflow must include loading, empty, error, and success states.
10. Every role-sensitive workflow must enforce server-side authorization.
11. Every tenant-specific query must be tenant-scoped.
12. AI-generated code must be reviewed, tested, and quality-gated.
13. AI features must be tested against misuse, not only normal use.
14. A product must not launch if any critical go/no-go item is marked No.

## Product Readiness Levels

| Level | Name | Meaning |
|---|---|---|
| 0 | Idea | Problem and user are not fully validated. |
| 1 | Prototype | Visual or basic working concept. |
| 2 | MVP | Core workflow works for limited users. |
| 3 | Pilot | Real users test in a controlled environment. |
| 4 | Production | Secure, stable, monitored, and supportable. |
| 5 | Enterprise Grade | Scalable, compliant, audited, and commercially ready. |

Do not assume the goal is always Level 5 immediately. Identify the current maturity level and define what is required to move to the next level.

## Builder Mindset

Replace consumer thinking with builder thinking:

| Consumer Thinking | Builder Thinking |
|---|---|
| Would this be nice to have? | Who is this for? |
| Can AI build this quickly? | What pain does this solve? |
| Does this look interesting? | What is the fastest useful version? |
| Can we add more features? | How can this fail or be abused? |

## Builder Readiness Checklist

Before building, confirm:

- Product idea is written in one sentence.
- Target user is clear.
- Core problem is clear.
- First useful version is defined.
- Out-of-scope items are listed.
- Initial success measure is defined.

## Opportunity Validation

Before creating code, validate whether the product is worth building.

Answer:

- Is the problem painful enough?
- Is the problem frequent enough?
- How do users solve it today?
- Would users pay for a better solution?
- Can the first version be validated with 5 to 10 users?
- Are alternatives weak, expensive, slow, or manual?

Output an Opportunity Validation Note containing:

- Target user
- Pain severity
- Current workaround
- Alternatives
- Willingness to pay
- Adoption risk
- Build / no-build recommendation

## Scope and Release Strategy

Classify every feature into one of these categories:

- Required for MVP
- Required for Pilot
- Required for Production
- Required for Enterprise
- Future Scale Feature

Use the following release definitions:

| Release Type | Purpose |
|---|---|
| Prototype | Prove the idea visually. |
| MVP | Prove the core workflow. |
| Pilot | Test with real users. |
| Beta | Controlled external release. |
| V1 | Stable production release. |
| V2+ | Scale, automation, monetization, and enterprise features. |

Anti-overengineering rule: do not implement every enterprise capability on day one.

## Required Pre-Code Documents

Before code generation begins, create or request approval for these six documents:

| No. | Document | Purpose |
|---|---|---|
| 01 | PRD - Product Requirements Document | Defines what is being built, for whom, and why. |
| 02 | TRD - Technical Requirements Document | Defines technology, tools, APIs, and constraints. |
| 03 | App Flow | Maps pages, clicks, navigation, redirects, and user journeys. |
| 04 | UI/UX Design Brief | Defines product look, feel, and interaction direction. |
| 05 | Backend Schema | Defines data, tables, relationships, auth, and permissions. |
| 06 | Implementation Plan | Defines the step-by-step build sequence. |

Source of truth rule: once approved, the six documents must be pasted into the coding-agent context and treated as the source of truth. The agent must not make decisions that conflict with them.

## PRD Minimum Template

Include:

- App name
- Tagline
- Problem
- Target user
- Core value proposition
- Must-have features
- Nice-to-have features
- Out of scope
- User stories
- Success metrics

User story format:

```text
As a [user], I want to [action] so that [outcome].
```

## TRD Minimum Template

Include:

- Frontend framework and UI stack
- Backend runtime, API framework, or serverless approach
- Database type and provider
- Authentication provider and login methods
- Hosting / deployment platform
- Third-party APIs, purpose, and tier
- Approved libraries
- Environment variable names only, never secret values
- Constraints: performance, free tier, platform, compliance, mobile, or browser constraints

## App Flow Minimum Template

Define:

- Pages, routes, and screens
- Sidebar, top navigation, mobile navigation, back buttons
- Auth flow: signup -> verify -> onboarding -> dashboard
- Core journeys step by step
- Admin journeys
- Empty states
- Error states
- Redirects after actions

## Implementation Plan Baseline

Use these phases unless the product requires a different sequence:

1. Project setup: dependencies, environment variables, folder structure, layout, routing.
2. Database: schema, migrations, seed data, indexes, security rules.
3. Authentication: signup, login, logout, session handling, protected routes, password reset, roles.
4. Core Feature 1: first major workflow.
5. Core Feature 2: second major workflow.
6. Dashboard and reporting: metrics, filters, exports.
7. UI polish: responsive design, loading, empty, error, and success states.
8. Testing: workflows, roles, edge cases, errors.
9. Deployment: production setup, rollback, release notes.

## Requirements Traceability Matrix

Track every major requirement from source to implementation and test evidence.

| Requirement | Source | Feature | Code Area | Test Case | Status |
|---|---|---|---|---|---|
| User can invite team members | PRD | Team invite | /team, /api/invite | TC-014 | Passed |
| Admin can export audit logs | PRD | Audit export | /admin/audit | TC-022 | Pending |
| Client users see only assigned organization data | Backend Schema | Tenant isolation | Queries, RLS, APIs | TC-031 | Required |

Traceability rule: no requirement should be marked complete unless it has been implemented and tested.

## UX and Product Experience Standards

The product must be:

- Clear
- Fast
- Minimal where possible
- Role-specific
- Easy to navigate
- Forgiving of mistakes
- Helpful during errors
- Consistent
- Accessible
- Trustworthy

## Role-Based Experience

| Role | Experience |
|---|---|
| Super Admin | Full system control. |
| Admin | User, configuration, and reporting controls. |
| Manager | Team workflows and metrics. |
| End User | Assigned actions and personal workflow. |
| Guest | Limited public or invited access. |

UX rule: do not show all features to all users. Use progressive disclosure to keep the product powerful without overwhelming users.

## Core UX Patterns

Use consistent patterns for:

- Smart defaults
- Onboarding
- Empty states
- Error states
- Success states
- Navigation
- Global search when needed
- Breadcrumbs when needed
- Recently viewed items when useful
- Quick actions where needed

Empty states must explain what is missing and show the primary action.

Error states must explain what happened, whether data is safe, and what the user should do next.

## Design System Governance

Create reusable components for:

- Buttons
- Inputs and selects
- Forms
- Tables
- Cards
- Modals and drawers
- Toasts and alerts
- Dashboard widgets
- Charts
- Empty states
- Error states
- Loading skeletons

Design system rule: no new UI pattern should be created if an existing reusable component can handle it.

## Product Vocabulary and Microcopy

Maintain consistent vocabulary.

Example:

| Term | Meaning | Use Everywhere As | Do Not Use |
|---|---|---|---|
| Request | User-submitted item | Request | Ticket, Case |
| Admin | Internal operator | Admin | Superuser |
| Client Admin | Customer-side admin | Client Admin | Customer Owner |

Microcopy examples:

| Weak Copy | Better Copy |
|---|---|
| Submit | Submit request for review |
| Error occurred | We could not save this request. Please try again. |
| No data found | No projects yet. Create your first project to start tracking delivery. |

## Browser, Device, and Accessibility Standards

Support:

- Chrome, Edge, and Safari on desktop.
- Key workflows on mobile.
- Basic tablet responsiveness.
- 1366px, 1440px, 1920px, and mobile screen sizes.
- WCAG-style baseline checks.
- Core flows usable without a mouse.

Accessibility checklist:

- Keyboard navigation
- Visible focus states
- Strong color contrast
- Clear labels
- Screen-reader-friendly forms
- Error messages linked to fields
- No color-only meaning
- Responsive text sizes
- Alt text for meaningful visuals

## Backend, Data Model, and Multi-Tenancy

Answer these core data questions:

- What are the main entities?
- Who owns each record?
- Which fields are required?
- Which fields are sensitive?
- What relationships exist?
- What should be indexed?
- What data needs audit history?
- What data can be deleted?
- What data must be retained?

Answer these multi-tenancy questions:

- Is the product single-user, team-based, company-based, or multi-tenant?
- Can one user belong to multiple organizations?
- Can one organization have multiple admins?
- Are roles global or tenant-specific?
- Does every tenant-specific table include organization_id or equivalent tenant key?
- Are all queries tenant-scoped?
- Can one company ever see another company's data?

Common SaaS tables:

- organizations
- users
- organization_members
- roles
- permissions
- invitations
- subscriptions
- audit_logs
- usage_events
- feature_flags

Tenant isolation rule: every tenant-specific API and database query must be scoped by organization, company, workspace, account, or equivalent tenant boundary.

## Data Governance and Lifecycle

Define:

- Ownership
- Classification
- Retention
- Deletion
- Export / import
- Archival
- Masking
- Encryption at rest and in transit
- Residency
- Lineage
- Auditability

Example sensitivity model:

| Data Type | Sensitivity | Control |
|---|---|---|
| Name and email | Personal | Protect |
| Password | Critical | Never store plain text |
| Payment data | Critical | Use payment provider |
| AI prompts | Sensitive | Review before storing |
| Business reports | Confidential | Role-based access |

## Migration and Version Upgrade Planning

Before changing a database or workflow model, check:

- Is this change backward compatible?
- Will existing records break?
- Is a migration script needed?
- Is rollback possible?
- Are null values handled?
- Are old statuses still supported?
- Does seed data need to change?
- Does reporting logic need to change?
- Has the migration been tested on staging?

Migration rule: never change the database or workflow model without checking impact on existing data.

## API Contract and Technical Architecture

Use an API contract table:

| Endpoint | Method | Purpose | Access |
|---|---|---|---|
| /api/items | GET | List records | Authenticated |
| /api/items/:id | GET | View record | Owner/Admin |
| /api/items | POST | Create record | Authenticated |
| /api/admin/users | GET | Manage users | Admin only |

Architecture documentation must include:

- Frontend structure
- Backend structure
- Database structure
- Authentication approach
- Authorization model
- API layer
- File storage
- AI service integration if applicable
- Queue / background jobs if applicable
- Logging approach
- Deployment model
- Environments
- Security controls
- Scaling approach
- Failure handling

## AI-Assisted Development Rules

The coding agent must:

1. Receive clear context.
2. Work phase by phase.
3. Avoid rebuilding unrelated parts.
4. Avoid removing existing functionality unless instructed.
5. Respect the approved architecture.
6. Respect the approved design system.
7. Include validation and error handling.
8. Avoid hardcoded secrets.
9. Produce code that can be reviewed.
10. Ensure every AI-built slice is tested.

## Standard AI Build Prompt

Use this prompt when instructing a coding agent:

```text
Act as a senior full-stack product engineer.

We are building [product name]. Use the approved documents as the source of truth:
1. PRD
2. TRD
3. App Flow
4. UI/UX Design Brief
5. Backend Schema
6. Implementation Plan

Now implement [phase or slice name].

Rules:
- Build only the requested scope.
- Do not remove existing functionality.
- Follow the approved tech stack and design system.
- Enforce validation, authorization, and error handling.
- Include loading, empty, error, and success states.
- Do not expose secrets.

After implementation, provide:
- Files changed
- What was implemented
- Manual test steps
- Known limitations
- Next step
```

## Development QA/QC Layer

AI-generated code must never be accepted only because it works once. It must be clean, maintainable, testable, secure, and safe to extend.

Watch for these AI-generated code risks:

- Duplicated logic
- Oversized files
- Architecture drift
- Unnecessary dependencies
- Hardcoded values
- Skipped validation or authorization
- Inconsistent naming
- Fake APIs or unused functions
- Regression of existing flows
- Dead code
- Insecure defaults

Code quality standards:

- Clear folder structure
- Consistent naming conventions
- Small and focused functions
- Reusable components
- No duplicated business logic
- No dead code
- No unnecessary dependencies
- No hardcoded secrets
- Clear separation of frontend, backend, data, and business logic
- Consistent error handling
- Type safety where applicable

## Build Quality Checklist

Confirm:

- Clean install works.
- .env.example exists with variable names only.
- Build command passes.
- Lint command passes.
- Type check passes if applicable.
- Tests pass.
- Database migrations run.
- Seed data loads.
- No missing imports.
- No broken routes.
- App works after fresh clone.

## Quality Gates

| Gate | Purpose |
|---|---|
| Linting | Catch style, syntax, and common issues. |
| Formatting | Keep code consistent. |
| Type checking | Catch type and contract mistakes. |
| Unit tests | Validate isolated logic. |
| Integration tests | Validate API and database behavior. |
| E2E tests | Validate full user journeys. |
| Dependency scan | Detect vulnerable packages. |
| Secret scan | Detect exposed credentials. |
| Build check | Confirm production build succeeds. |

## Development Definition of Done

A development item is done only when:

- Requirement is implemented and traceable.
- Code follows the approved architecture.
- Validation and authorization are implemented where needed.
- Error handling is implemented.
- Tests are added or updated.
- Lint, type check, build, and existing tests pass.
- No secrets, console logs, or debug code remain.
- Manual test steps and known limitations are documented.

## AI Feature Governance

Before adding AI features, answer:

- Why is AI needed?
- Can simple logic solve this instead?
- What value does AI add?
- What risk does AI introduce?
- Can users verify the output?
- Is human review required?

AI output rules:

- Editable
- Explainable
- Reviewable
- Regenerable
- Acceptable or rejectable
- Marked as AI-generated where needed

Human-in-the-loop is required for:

- Legal decisions
- HR decisions
- Financial decisions
- Compliance decisions
- Security decisions
- Customer-impacting decisions

## Prompt Versioning

Track AI prompts with:

- Prompt name
- Prompt version
- Purpose
- Inputs
- Expected output
- Known limitations
- Last updated owner and date

## AI Red Teaming and Evaluation

Test AI features against:

- Prompt injection
- Data exfiltration attempts
- Malicious file content
- Jailbreak attempts
- Cross-tenant leakage
- Hallucinated recommendations
- Overconfident output
- Model failure fallback

AI testing rule: AI features must be tested against misuse, not only normal use.

## Testing and Validation Strategy

Use these test types:

- Unit tests
- Integration tests
- Component tests
- End-to-end tests
- Role-based tests
- Regression tests
- Security tests
- Performance tests

Required E2E flows:

- Signup
- Login
- Logout
- Password reset
- Main user workflow
- Admin workflow
- Unauthorized access
- Empty state
- Error state
- Create / edit / delete records
- Export / report if applicable
- Payment flow if applicable

Test data categories:

- Empty data
- Normal data
- Large-volume data
- Invalid data
- Duplicate data
- Edge-case data
- Multi-role data
- Multi-tenant data
- Security abuse data
- Historical data
- Deleted / restored data

## Security and Authentication Checklist

| Control | Requirement |
|---|---|
| Input validation | Validate on server. |
| Sanitization | Strip or escape unsafe input. |
| Password storage | Use bcrypt, Argon2id, or trusted auth provider. |
| Rate limiting | Protect login, signup, reset, AI, and upload APIs. |
| Account lockout | Lock after repeated failed attempts. |
| Error messages | Do not reveal account existence. |
| Sessions | Use secure expiry and logout. |
| Secrets | Never expose API keys or tokens. |
| Admin access | Server-side checks required. |
| Audit logs | Track sensitive actions. |

Safe authentication messages:

| Use | Do Not Use |
|---|---|
| Incorrect email or password. | Email does not exist. |
| If that email is registered, you will receive a reset link. | Wrong password. |
| We could not complete registration with the provided details. | Email already registered. |

## Threat Modeling

Use STRIDE-style review:

| Threat | Question |
|---|---|
| Spoofing | Can someone pretend to be another user? |
| Tampering | Can someone modify data they should not? |
| Repudiation | Can users deny actions because logs are missing? |
| Information Disclosure | Can sensitive data leak? |
| Denial of Service | Can the system be overloaded? |
| Elevation of Privilege | Can a user become admin improperly? |

## Vendor and Third-Party Risk

Every critical external dependency needs a failure plan.

| Vendor | Purpose | Risk | Backup Plan |
|---|---|---|---|
| Auth provider | Authentication | Login dependency | Emergency admin access |
| Payment provider | Billing | Billing outage | Manual invoice process |
| AI provider | AI features | AI outage | Manual fallback |
| Email provider | Notifications | Delivery failure | Retry queue |

## Production Readiness Review

Check:

- Authorization: can users access data that does not belong to them?
- Rate limiting: can attackers spam APIs?
- Secrets management: are secrets exposed anywhere?
- Access control: can users manipulate requests to gain access?
- Token security: what happens if a token is stolen?
- Resilience: can one endpoint bring down the system?

## Reliability Targets and SLOs

| Area | Target |
|---|---|
| App uptime | 99.5%+ for early production. |
| Login success rate | 99%+. |
| Dashboard load time | Under 3 seconds. |
| Common API response | Under 500ms to 1s. |
| Critical error rate | Under 1%. |
| Failed background jobs | Monitored and retried. |
| Recovery time objective | Defined before launch. |

## Performance and Scalability

Ensure:

- Large lists are paginated.
- Search queries are indexed.
- Dashboard metrics are optimized.
- Expensive reports are asynchronous.
- Images are optimized.
- Files have size limits.
- API calls are not duplicated unnecessarily.
- AI calls are not repeated unnecessarily.
- Caching is used where appropriate.
- Database queries avoid unnecessary full-table scans.

Performance targets:

| Area | Target |
|---|---|
| Dashboard load | Under 3 seconds. |
| Common API response | Under 500ms to 1s. |
| Search response | Under 1 second. |
| Page interaction | No visible lag. |
| Large reports | Async or background job. |

## Observability and Monitoring

Required monitoring:

- Error tracking
- API logs
- Auth logs
- Payment logs
- AI logs if applicable
- Database logs
- Uptime monitoring
- Background job monitoring

Monitor unhandled exceptions, user-facing failures, latency, failed requests, rate limit hits, login failures, permission failures, payment failures, AI failures, slow queries, availability, failed jobs, and retries.

## Operational Runbooks

Create runbooks for:

- Login outage
- Database outage
- Payment failure
- Email failure
- AI provider failure
- Slow dashboard
- Failed deployment
- Failed migration
- Data restore
- Security incident
- High error rate
- Background job failure

Runbook template:

| Item | Description |
|---|---|
| Problem | What happened. |
| Detection | How we know. |
| Severity | Critical / High / Medium / Low. |
| First action | Immediate response. |
| Owner | Responsible person. |
| Fix steps | Recovery process. |
| Communication | Who to inform. |
| Postmortem | What to improve. |

## Backup, Recovery, and Disaster Planning

Confirm:

- Database is backed up.
- Backup frequency is defined.
- Restore process is documented.
- Restore owner is assigned.
- Point-in-time recovery is available if needed.
- Deleted records are recoverable where required.
- Rollback plan exists.
- Restore has been tested.

Backup rule: a backup is not real until restore has been tested.

## CI/CD and Release Management

Environments:

| Environment | Purpose |
|---|---|
| Local | Developer testing. |
| Dev | Shared engineering testing. |
| Staging | UAT and release validation. |
| Production | Real users. |

Release checklist:

- Build passes.
- Tests pass.
- Environment variables configured.
- Database migrations tested.
- Release notes written.
- Rollback plan ready.
- Monitoring active.
- Support owner assigned.
- Known issues documented.

## Feature Flags and Progressive Rollout

Use:

- Internal-only release
- Beta user release
- Tenant-specific enablement
- Percentage rollout
- Feature flag
- Kill switch
- Feature-level monitoring
- Rollback plan

Rollout rule: high-risk features should be released progressively, not all at once.

## Customer Support and Admin Operations

Admin/support operations should include:

- User lookup
- Organization lookup
- Role changes
- Account disable / suspend
- Subscription status
- Login history
- Audit logs
- Error logs
- Support notes
- Manual correction
- Data export
- Restore deleted records

Support workflows:

- Bug report flow
- Feature request flow
- Access issue flow
- Payment issue flow
- Data correction flow
- Escalation process

## Human Override and Manual Recovery

Support manual recovery for:

- Manual status change
- Admin correction
- Reassign owner
- Restore deleted record
- Retry failed job
- Resend notification
- Override AI recommendation
- Edit AI-generated content
- Cancel stuck workflow
- Restart failed workflow

Recovery rule: no workflow should become permanently stuck because automation failed.

## Product Analytics and Measurement

Track product events such as:

| Event | Purpose |
|---|---|
| user_signed_up | Signup tracking. |
| user_logged_in | Engagement. |
| onboarding_completed | Activation. |
| dashboard_viewed | Usage. |
| record_created | Core workflow. |
| report_exported | Reporting value. |
| ai_action_used | AI adoption. |
| invite_sent | Collaboration. |
| payment_started | Monetization. |
| subscription_created | Conversion. |

Track product metrics:

- Activation rate
- Retention rate
- Time to first value
- Feature adoption
- Drop-off points
- Daily / weekly active users
- Conversion rate
- Churn
- Expansion potential

## Billing, Entitlements, and FinOps

Example plans:

| Plan | Access |
|---|---|
| Free | Basic usage, limited records. |
| Pro | More records, exports, AI features. |
| Business | Team management and reports. |
| Enterprise | SSO, audit logs, custom limits. |

FinOps cost categories:

- Hosting
- Database
- Storage
- Email
- Auth provider
- Payment provider
- AI tokens
- Vector database
- Monitoring tools
- Background jobs
- File processing
- Third-party APIs

FinOps metrics:

| Metric | Purpose |
|---|---|
| Cost per user | Unit economics. |
| Cost per organization | Customer profitability. |
| Cost per workflow | Process cost. |
| Cost per AI action | AI margin control. |
| Gross margin by plan | Commercial readiness. |
| Budget alerts | Overspend prevention. |

## Legal, Privacy, Compliance, and Trust

Required policies:

- Terms of service
- Privacy policy
- Cookie policy
- Data retention policy
- Data deletion process
- User consent handling
- AI usage disclosure
- Vendor / subprocessor list
- DPA readiness for enterprise clients

Compliance evidence pack:

- Security controls checklist
- Access control evidence
- Audit log sample
- Backup proof
- Restore test proof
- Data retention policy
- Incident response policy
- Vendor / subprocessor list
- Pen-test or scan result
- Vulnerability scan report
- Privacy review
- AI usage disclosure

Enterprise trust rule: enterprise trust requires proof, not only claims.

## Product Operations and Governance

Maintain a product decision log:

| Decision | Reason | Alternatives | Owner | Date | Impact |
|---|---|---|---|---|---|
| [Decision] | [Why] | [Options] | [Owner] | [Date] | [Impact] |

Maintain technical debt and risk registers.

Debt register:

| Debt Item | Risk | Priority | Owner | Fix By |
|---|---|---|---|---|
| [Debt item] | [Risk] | Critical / High / Medium / Low | [Owner] | [Date/version] |

Risk register:

| Risk | Type | Severity | Mitigation | Owner |
|---|---|---|---|---|
| AI output may be inaccurate | AI/Product | High | Human review and disclaimer | Product |
| Tenant data leakage | Security | Critical | Tenant-scoped queries and tests | Engineering |
| Low adoption after launch | Business | High | Guided onboarding and feedback loop | Product |

## Product Ownership RACI

| Area | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Product scope | Product Lead | Product Owner | Engineering | Stakeholders |
| Security | Security Lead | CTO/Product Owner | Engineering | Business |
| Release | Engineering | Product Owner | QA/Security | Support |
| UAT | QA/Product | Product Owner | Users | Leadership |
| Support | Support Lead | Operations Owner | Engineering | Product |

## Demo Data, Notifications, and Handover

Demo data must include:

- Realistic demo users
- Realistic organizations
- Realistic records
- Multiple statuses
- Completed workflow examples
- Empty-state scenario
- Error-state scenario
- Dashboard data that tells a story
- Admin and user test accounts

Demo rule: demo data should show the product value within 30 seconds.

Notification quality checklist:

- Notification explains what happened.
- User knows why they received it.
- Next action is clear.
- Action requirement is obvious.
- Link or destination is clear.

Handover package:

- Product overview
- Getting started guide
- Admin guide
- User guide
- FAQ
- Troubleshooting guide
- Architecture document
- API documentation
- Database schema
- Deployment guide
- Known issues
- Roadmap

## Incident Response, GTM, and Customer Success

Incident response template:

| Item | Description |
|---|---|
| Incident type | What happened. |
| Severity | Critical / High / Medium / Low. |
| Owner | Who responds. |
| First action | What to do first. |
| Communication | Who to inform. |
| Recovery | How to restore. |
| Postmortem | What to learn. |

Go-to-market checklist:

- Target customer segment
- Buyer persona
- User persona
- Pain statement
- Value proposition
- Pricing hypothesis
- Demo script
- Sales deck
- Landing page
- Case study format
- ROI story
- Objection handling
- Trial or pilot structure

Customer success layer:

- Customer onboarding checklist
- Admin training guide
- User training guide
- Success milestones
- Adoption dashboard
- Health score
- Renewal risk signals
- Usage review template
- Quarterly business review template

## Continuous Improvement and Product Lifecycle

Feedback classification:

| Type | Meaning |
|---|---|
| Bug | Something broken. |
| UX issue | Something confusing. |
| Feature request | New capability. |
| Enhancement | Improve existing feature. |
| Security issue | Risk or vulnerability. |
| Data issue | Incorrect or missing data. |
| Training issue | User needs guidance. |

Feature kill criteria:

- Users do not use it.
- It creates confusion.
- It increases support issues.
- It slows performance.
- It creates security risk.
- It duplicates another feature.
- It does not support the product goal.

Lifecycle and sunset strategy:

- How features are retired
- How old versions are supported
- How unused features are removed
- How data is migrated
- How customers are notified
- How product debt is reviewed
- How roadmap decisions are made

## Quality Scorecard

Score each area from 1 to 5:

- Product clarity
- UX simplicity
- Core workflow completion
- Security maturity
- Data model quality
- Development quality
- Performance
- Reliability
- AI safety
- Admin operability
- Commercial readiness

Launch scoring rule: no critical area below 4 for production. No security area below 4. MVPs may launch with some 3s only if risks are documented and accepted.

## Finish-Line Readiness Checklist

Confirm:

- Release scope is frozen.
- Main journey works end to end.
- Users can understand product without explanation.
- Loading, empty, error, and success states are handled.
- Data model is stable and realistic.
- Permissions are tested by role.
- Security hardening is complete.
- Abuse cases have been tested.
- Performance is acceptable with realistic data.
- Monitoring is active.
- Backup and recovery are ready.
- Support / admin operations exist.
- Onboarding guides users to first value.
- Documentation exists.
- Product analytics are active.
- Deployment and rollback plan exist.
- Launch rollout is controlled.
- Post-launch ownership is assigned.

## Final Go / No-Go Gate

Approval required:

- Product owner approval
- Engineering approval
- Security approval
- UX approval
- QA approval
- Business approval
- Support owner assigned
- Known risks accepted
- Rollback plan ready
- Monitoring active

Final launch rule: if any critical item is No, do not launch.

## Agent Output Format for Any Development Task

When completing any development task, respond with:

1. Scope understood
2. Assumptions made
3. Source documents used
4. Implementation plan
5. Files to create or change
6. Security considerations
7. Data / schema impact
8. UX states covered
9. Test plan
10. Acceptance criteria
11. Risks or gaps
12. Next recommended step

For code implementation, additionally provide:

- Files changed
- Commands run
- Build / lint / test results
- Manual test steps
- Known limitations
- Rollback notes if relevant

## Master Finish-Line Review Prompt

Use this prompt when a product is already partially built and needs to be taken to production readiness:

```text
Act as an expert AI product developer, SaaS product owner, UX reviewer, security architect, QA lead, and production readiness reviewer.

This product is already 80% built. Identify what is missing to take it to the finish line.

Review: scope readiness, core workflow completion, user functionality, UX friction, role-based experience, loading/empty/error/success states, data model stability, permissions, security hardening, abuse-case testing, performance, monitoring, backup, admin/support operations, onboarding, documentation, billing if SaaS, analytics, deployment, launch readiness, and post-launch ownership.

For each area provide:
- Maturity
- What is missing
- Why it matters
- Risk if ignored
- Specific fix
- Priority
- Acceptance criteria
- Coding-agent prompt if development is required
```

## Master Leopard-Grade Review Prompt

Use this prompt when the user wants a product upgraded to a high-robustness standard:

```text
Act as an expert AI product developer, senior SaaS architect, product designer, security reviewer, and reliability engineer.

Review this product and upgrade it to Leopard-grade robustness.

Evaluate: UI/UX clarity, role-based experience, navigation, feature completeness, workflow quality, onboarding, states, accessibility, admin operations, multi-tenancy, authentication, authorization, access control, rate limiting, secrets, token security, API security, file security, AI safety, AI cost control, observability, audit logs, backup, performance, resilience, CI/CD, supportability, enterprise readiness, privacy, analytics, development QA/QC, test data quality, runbooks, rollout safety, and human override.

For each area provide:
- Current maturity
- What is missing
- Why it matters
- Recommended improvement
- Priority
- Implementation approach
- Coding-agent prompt
- Acceptance criteria
```

## Final Principle

A product should be clear enough to understand, stable enough to trust, secure enough to protect users, measurable enough to improve, and operational enough to survive without the builder beside it.
