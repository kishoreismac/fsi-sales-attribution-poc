# Implementation Plan - Feed Sales Incentive POC

## Source Of Truth

Use these documents as the approved build source:

1. `docs/01_prd.md`
2. `docs/02_trd.md`
3. `docs/03_app_flow.md`
4. `docs/04_ui_ux_design_brief.md`
5. `docs/05_backend_schema.md`
6. `docs/06_implementation_plan.md`

## Release Scope

Release type: POC / MVP-style demo.

Build only:

- Mock/manual data workflows.
- Configurable roles.
- Assignment workbench.
- Split validation.
- Simple approval workflow.
- Audit/history.
- Credit preview.
- Export-ready approved assignments.

Do not build:

- Live enterprise integrations.
- Payroll execution.
- Full compensation engine.
- Production BI/Salesforce integration.
- Billing, subscriptions, or enterprise admin modules.

## Feature Classification

| Feature | Classification |
|---|---|
| Seller profile setup | Required for MVP |
| Role configuration | Required for MVP |
| Customer and product group setup | Required for MVP |
| Assignment creation and editing | Required for MVP |
| Split allocation validation | Required for MVP |
| Effective-dated history | Required for MVP |
| Approval queue | Required for MVP |
| Credit preview | Required for MVP |
| Audit log | Required for MVP |
| Export approved assignments | Required for MVP |
| CSV import | Required for Pilot unless quick POC time allows |
| Live Workday/SAP/Salesforce/Power BI/payroll integrations | Future Scale Feature |
| Full calculation/payment engine | Required for Production after POC |

## Phase 1 - Project Setup

Tasks:

- Scaffold Next.js TypeScript app.
- Add Tailwind CSS and UI component foundation.
- Add Prisma and SQLite.
- Create `.env.example` with variable names only.
- Create app shell, routing, layout, and navigation.
- Create shared UI components: button, input, select, table, badge, modal, toast, empty state, error state, loading skeleton.

Acceptance criteria:

- App runs locally.
- Navigation routes exist.
- No secrets are committed.

## Phase 2 - Database And Seed Data

Tasks:

- Define Prisma schema from `docs/05_backend_schema.md`.
- Add migrations.
- Add seed data that supports the demo storyline.
- Add data access modules by domain.

Acceptance criteria:

- Migration runs cleanly.
- Seed data loads.
- Demo records include valid and invalid assignment examples.

## Phase 3 - Authorization And Demo Roles

Tasks:

- Add POC role switch or simple demo user session.
- Enforce server-side permissions for admin and manager actions.
- Hide or disable role-inappropriate UI actions.

Acceptance criteria:

- Admin can manage setup and submit assignments.
- Manager can approve/reject but cannot edit setup data.
- Unauthorized server actions are rejected.

## Phase 4 - Setup Screens

Tasks:

- Build Seller Management.
- Build Role Configuration.
- Build Customer & Product Group Setup.
- Add create/edit forms with validation and success/error states.

Acceptance criteria:

- Admin can create and edit sellers, roles, customers, and product groups.
- Inactive sellers are clearly shown.
- Role behavior is configurable.

## Phase 5 - Assignment Workbench

Tasks:

- Build assignment list, filters, detail, and create/edit form.
- Implement status transitions for draft and submitted.
- Preserve assignment history by creating replacement records where needed.
- Add validation panel.

Acceptance criteria:

- Admin can create assignments with customer, product group, seller, role, allocation, dates, and notes.
- Required fields and date logic are validated.
- Assignment status changes are audited.

## Phase 6 - Split Validator

Tasks:

- Implement server-side validation rules.
- Build Split Validator screen.
- Show severity, message, and affected assignments.

Acceptance criteria:

- Direct splits must total 100%.
- LPS splits cannot exceed 100%.
- Overlay roles are additive.
- Overlaps and inactive sellers are flagged.

## Phase 7 - Approval Workflow

Tasks:

- Build Approval Queue.
- Implement approve/reject actions with comments.
- Record approval history and audit log.
- Update approved assignments to active when date-valid.

Acceptance criteria:

- Manager can approve or reject submitted assignments.
- Rejection requires comments.
- Audit and approval history are visible.

## Phase 8 - Credit Preview And Export

Tasks:

- Build Credit Preview screen.
- Match mock invoices to approved active assignments.
- Calculate credited quantity and amount.
- Build export for approved assignment dataset.

Acceptance criteria:

- Preview shows credited quantity or amount by seller.
- Empty state appears when no matching approved assignment exists.
- Approved assignment export is clean and future-ready.

## Phase 9 - Dashboard, History, And Polish

Tasks:

- Build dashboard metrics and work queues.
- Build audit/history screen.
- Add loading, empty, error, and success states across flows.
- Verify responsive layouts and keyboard navigation.

Acceptance criteria:

- Dashboard explains product value within 30 seconds.
- History shows who changed what and when.
- Core flows work on desktop and mobile widths.

## Phase 10 - Testing And Quality Gates

Tasks:

- Add unit tests for validation rules.
- Add integration tests for server actions/API validation and permissions.
- Add E2E smoke tests for create, submit, approve, preview.
- Run lint, type check, build, tests, and secret scan where available.

Acceptance criteria:

- Build passes.
- Lint passes.
- Type check passes.
- Tests pass or documented gaps are approved.
- No hardcoded secrets.

## Requirements Traceability Matrix

| Requirement | Source | Feature | Code Area | Test Case | Status |
|---|---|---|---|---|---|
| Assign credit at customer plus product group level | PRD SACA-01 | Assignment Workbench | Assignments domain | Create assignment E2E | Planned |
| Support split allocations | PRD SACA-02 | Split Validator | Validation service | Direct and LPS unit tests | Planned |
| Support multiple role types | PRD SACA-03 | Role Configuration | Roles domain | Role behavior tests | Planned |
| Support effective-dated assignments | PRD SACA-04 | Assignment Workbench / History | Assignments domain | Date overlap tests | Planned |
| Manager can approve/reject assignments | PRD Acceptance Criteria | Approval Queue | Approvals domain | Approval E2E | Planned |
| Track audit details | PRD Acceptance Criteria | History / Audit | Audit domain | Audit integration test | Planned |
| Preview credited quantity or amount | PRD Acceptance Criteria | Credit Preview | Preview service | Preview E2E | Planned |
| Export approved assignments | PRD Acceptance Criteria | Export Center | Export endpoint | Export test | Planned |

## Security Considerations

- No secrets in code.
- Server-side validation for all writes.
- Server-side authorization for admin and manager actions.
- Safe error messages.
- Audit sensitive actions.
- Use mock data only in POC.

## Risks And Gaps

| Risk | Severity | Mitigation |
|---|---|---|
| Client expects live integrations in demo | Medium | Label POC as mock/manual/CSV data and explain future adapter path. |
| Role behavior complexity grows | Medium | Keep behavior configurable and limit POC to stated roles. |
| Assignment history logic becomes unclear | High | Use effective dates and never overwrite approved history. |
| POC auth mistaken for production auth | High | Clearly mark demo role switch as POC-only and document future Entra ID path. |

## Next Recommended Step

Review and approve the six pre-code documents. After approval, start Phase 1 project setup.

