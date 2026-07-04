# SDLC Prompt Playbook - Feed Sales Incentive POC

## Purpose

Use this document to regenerate or extend the Feed Sales Incentive POC through an AI-assisted SDLC. The prompts are written to produce the same style of codebase currently in this repository: a Next.js, TypeScript, Tailwind, Prisma, SQLite POC for sales attribution, assignment validation, approvals, credit preview, audit history, and approved assignment export.

## Source Documents

Before using the prompts, place these files in `docs/` and treat them as the build source of truth:

1. `docs/01_prd.md`
2. `docs/02_trd.md`
3. `docs/03_app_flow.md`
4. `docs/04_ui_ux_design_brief.md`
5. `docs/05_backend_schema.md`
6. `docs/06_implementation_plan.md`
7. `docs/07_quality_gate_report.md`

## Global Prompt Prefix

Use this prefix at the start of every implementation prompt:

```text
You are a senior full-stack product engineer working in this repository.

Build the Feed Sales Incentive POC exactly according to the approved docs in `docs/`.
Use `docs/06_implementation_plan.md` as the phase-by-phase execution plan.

Technical constraints:
- Next.js App Router with TypeScript.
- Tailwind CSS with a small local component system.
- Prisma ORM with SQLite for local POC persistence.
- Server actions for writes and server-side validation.
- Zod for form validation.
- lucide-react for icons.
- Mock/manual data only. No live Workday, SAP, Salesforce, Power BI, payroll, or billing integrations.
- Server-side authorization is required for all write, approval, audit, and export actions.
- Audit important changes.
- Preserve effective-dated history.
- Keep the UI quiet, business-focused, operational, and demo-friendly.
- Do not commit secrets, `.env`, local DB files, `.next`, `node_modules`, logs, or build output.

Before editing, read the relevant docs and existing code. Make focused changes. After implementation, run lint, typecheck, unit tests, and smoke tests when available.
```

## Phase 0 - Product And Technical Planning

### Prompt 0.1 - Create The PRD

```text
Create `docs/01_prd.md` for a POC called "Feed Sales Incentive POC".

The product solves sales attribution assignment, approval, correction, audit, and credit preview problems for feed sales.

Include:
- App name and tagline.
- Problem statement.
- Target users: Sales Compensation Admin and Sales Manager for POC; Seller, Finance, IT for future.
- Core value proposition.
- Product vision.
- Must-have requirements with IDs:
  - SACA-01 assign credit at customer plus product group level.
  - SACA-02 support split allocations.
  - SACA-03 support multiple role types.
  - SACA-04 support effective-dated assignments.
- Additional POC features: seller setup, role configuration, customer/product setup, assignment creation/editing, split validation, approval workflow, audit trail, credit preview, export.
- Nice-to-have features.
- Out-of-scope items: live Workday, SAP/JDE/SAC, Salesforce, Power BI, payroll, production compensation engine.
- POC workflow.
- User stories.
- Success metrics.

Keep it concise, business-readable, and suitable as source of truth for implementation.
```

### Prompt 0.2 - Create The TRD

```text
Create `docs/02_trd.md` for the Feed Sales Incentive POC.

Base it on `docs/01_prd.md`.

Include:
- Technical goal.
- Frontend stack: Next.js, React, TypeScript, Tailwind, local UI components, lucide-react.
- Backend approach: Next.js server actions / server runtime grouped by domain.
- Database: Prisma with SQLite for POC; PostgreSQL-compatible future path.
- Authentication: POC demo role switcher; future Entra ID.
- Hosting: local for POC; future Azure App Service, Azure Container Apps, or Vercel.
- Approved libraries.
- Environment variable names only: DATABASE_URL, NEXT_PUBLIC_APP_NAME, AUTH_SECRET.
- Constraints.
- API or server-action contract by domain.
- Architecture notes.

Do not include real secrets.
```

### Prompt 0.3 - Create App Flow

```text
Create `docs/03_app_flow.md`.

Define routes and workflows for:
- `/` dashboard.
- `/sellers` seller management.
- `/roles` role configuration.
- `/customers-products` customer and product group setup.
- `/assignments` assignment workbench.
- `/assignments/new` new assignment.
- `/assignments/:id` assignment detail.
- `/validator` split validator.
- `/approvals` approval queue.
- `/credit-preview` credit preview.
- `/history` audit/history.
- `/exports` export center.

Include navigation rules, POC auth flow, admin journey, manager journey, core create/approve assignment journey, split validation journey, credit preview journey, empty states, error states, and redirects after actions.
```

### Prompt 0.4 - Create UI/UX Design Brief

```text
Create `docs/04_ui_ux_design_brief.md`.

The app must feel like a quiet, business-focused operational tool.

Include:
- Experience direction.
- Audience.
- Product personality.
- Layout principles.
- Visual style.
- Core components.
- Screen-level UX notes for dashboard, sellers, roles, assignment workbench, validator, approvals, credit preview, history.
- Required UX states: loading, empty, error, success.
- Accessibility requirements.
- Microcopy standards and product terminology.

Avoid marketing-style pages, oversized heroes, decorative gradients, and visual clutter.
```

### Prompt 0.5 - Create Backend Schema

```text
Create `docs/05_backend_schema.md`.

Define the POC data model:
- Seller.
- Role.
- Customer.
- ProductGroup.
- Assignment.
- ValidationResult.
- ApprovalHistory.
- AuditLog.
- MockInvoice.
- CreditPreviewResult.
- DemoUser.

Include fields, relationships, indexes where relevant, authorization matrix, validation rules, data governance notes, and seed data requirements.

Make clear that mock invoice quantity/unit and amount are used only for Credit Preview.
```

### Prompt 0.6 - Create Implementation Plan

```text
Create `docs/06_implementation_plan.md`.

Use the PRD, TRD, app flow, design brief, and backend schema as source of truth.

Organize the build into phases:
1. Project setup.
2. Database and seed data.
3. Authorization and demo roles.
4. Setup screens.
5. Assignment workbench.
6. Split validator.
7. Approval workflow.
8. Credit preview and export.
9. Dashboard, history, polish.
10. Testing and quality gates.

For each phase include tasks and acceptance criteria.

Also include:
- Release scope.
- Feature classification.
- Requirements traceability matrix.
- Security considerations.
- Risks and mitigations.
- Next recommended step.
```

## Phase 1 - Project Setup

### Prompt 1.1 - Scaffold The App

```text
Use the global prompt prefix.

Implement Phase 1 from `docs/06_implementation_plan.md`.

Create a Next.js App Router TypeScript project in this repo with:
- Tailwind CSS.
- ESLint.
- Prisma dependencies.
- Vitest for unit tests.
- A clean local component system under `src/components/ui`.
- App shell with sidebar navigation.
- Page header component.
- Status badge, card, badge, empty-state, form-field helpers.
- Routes from `docs/03_app_flow.md` with initial pages.
- `.gitignore` that excludes `.env`, `.next`, `node_modules`, logs, local DB files, coverage, and build output.
- `.env.example` or equivalent variable-name documentation if needed, with no secrets.

Acceptance criteria:
- `npm run lint` passes.
- `npm run typecheck` passes or documented typegen setup is provided.
- App can run locally with `npm run dev`.
```

### Prompt 1.2 - App Shell And Navigation

```text
Use the global prompt prefix.

Build the app shell and navigation:
- Left sidebar on desktop.
- Compact horizontal navigation on small screens.
- Dashboard, Assignments, Approvals, Validator, Credit Preview, Exports, History, Setup screens.
- Current demo role visible near the top.
- Collapsible sidebar on desktop.
- Light/dark mode toggle.
- Responsive layout with no overlapping text.

Use lucide-react icons. Keep styling restrained and operational.
```

## Phase 2 - Database And Seed Data

### Prompt 2.1 - Prisma Schema

```text
Use the global prompt prefix.

Implement the Prisma schema from `docs/05_backend_schema.md`.

Use SQLite for local POC.

Create enums for:
- EmployeeType.
- RoleCategory.
- RoleBehavior.
- MetricType.
- AssignmentStatus.
- ValidationSeverity.
- ApprovalDecision.
- DemoUserRole.

Create models:
- Seller.
- Role.
- Customer.
- ProductGroup.
- Assignment.
- ValidationResult.
- ApprovalHistory.
- AuditLog.
- MockInvoice.
- CreditPreviewResult.
- DemoUser.

Add indexes for assignment lookup, status, active flags, and future integration IDs.

Acceptance criteria:
- Prisma schema validates.
- Migration can be created and applied.
```

### Prompt 2.2 - Seed Data

```text
Use the global prompt prefix.

Create realistic seed data for the POC.

Seed:
- Sales Compensation Admin, Sales Manager, Finance demo users.
- At least 6 sellers, including managers and local-hire/non-employee examples.
- Direct Seller, LPS/Farm Gate Seller, Overlay Seller, Manager Roll-up, Future Role.
- At least 5 customers/sales parents.
- At least 4 product groups with metric types Quantity, Amount, Both.
- Assignments covering draft, submitted, approved, active, rejected, expired.
- Valid direct split example.
- Invalid direct split example.
- LPS over-allocation example.
- Overlay additive example.
- Mock invoices with quantityUnit `tons`, quantity, amount, invoice date, and matching customer/product data.

Acceptance criteria:
- Seed command runs cleanly.
- Credit Preview has at least one invoice that produces credited output.
- Validator has at least one error to demonstrate.
```

### Prompt 2.3 - Data Access Modules

```text
Use the global prompt prefix.

Create domain data modules under `src/lib/data` for:
- sellers.
- roles.
- customers-products.
- assignments.
- validation.
- credit-preview.
- dashboard.
- audit.
- exports.

Keep Prisma calls out of page components where a reusable data module is clearer.
```

## Phase 3 - Authorization And Demo Roles

### Prompt 3.1 - Permissions

```text
Use the global prompt prefix.

Implement POC role permissions:
- Sales Compensation Admin can manage setup, create/submit assignments, view validator, credit preview, audit, exports.
- Sales Manager can view assignments, approve/reject, view validator, credit preview, audit.
- Seller can view dashboard and assignments only.
- Finance can view dashboard, assignments, credit preview, audit.
- IT System Admin can view dashboard, validator, audit.

Create:
- `src/lib/auth/permissions.ts`
- `src/lib/auth/session.ts`
- Server-side `requirePermission`.
- Demo role switcher using cookies.

Acceptance criteria:
- UI hides role-inappropriate navigation/actions.
- Server actions reject unauthorized writes.
- Unit tests cover permission expectations.
```

## Phase 4 - Setup Screens

### Prompt 4.1 - Seller Management

```text
Use the global prompt prefix.

Build Seller Management at `/sellers`.

Include:
- Seller table with name, email, seller code, employee type, manager, effective dates, active status.
- Create seller form.
- Edit seller route `/sellers/[id]/edit`.
- Activate/deactivate action.
- Workday Employee ID helper text.
- Workday ID saved only for Workday employees; clear it for local hires/non-employees.
- Manager dropdown from existing sellers.
- Full-time employee helper text.
- Audit log for create, update, activate, deactivate.

Acceptance criteria:
- Admin can create and edit sellers.
- Inactive sellers remain visible but are excluded from new assignment selection.
```

### Prompt 4.2 - Role Configuration

```text
Use the global prompt prefix.

Build Role Configuration at `/roles`.

Include:
- Table with role name, category, behavior, thresholds, dates, status, credit eligibility.
- Create role form.
- Edit role route `/roles/[id]/edit`.
- Activate/deactivate action.
- Helper copy explaining role name vs category vs behavior.
- Eligible for credit checkbox. Visibility-only roles should not generate Credit Preview rows.
- Audit log for create, update, activate, deactivate.

Acceptance criteria:
- Admin can create and edit roles.
- Role behavior remains configurable.
```

### Prompt 4.3 - Customer And Product Group Setup

```text
Use the global prompt prefix.

Build Customer and Product Group Setup at `/customers-products`.

Include:
- Customer table and create form.
- Customer edit route `/customers-products/customers/[id]/edit`.
- Product group table and create form.
- Product group edit route `/customers-products/product-groups/[id]/edit`.
- Activate/deactivate actions.
- Helper text for Sales Parent, SAP Customer ID, Salesforce Account ID, External Product Group ID, and Metric Type.
- Audit log for create, update, activate, deactivate.

Acceptance criteria:
- Admin can create and edit customers and product groups.
- Product metric type drives Credit Preview behavior.
```

## Phase 5 - Assignment Workbench

### Prompt 5.1 - Assignment List And Detail

```text
Use the global prompt prefix.

Build Assignment Workbench:
- `/assignments` list page.
- `/assignments/new` creation page.
- `/assignments/[id]` detail page.

Assignment creation fields:
- Customer.
- Product group.
- Seller.
- Role.
- Allocation percent.
- Start date.
- Optional end date.
- Reason/notes.

Only show active customers, product groups, sellers, and roles in new assignment dropdowns.

Detail page must show:
- Status.
- Customer/product/seller/role/allocation/dates.
- Validation results.
- Approval history.
- Actions: revalidate, submit where permitted.

Add helper copy explaining that amount and tons are not entered on assignment. They come from mock invoices in Credit Preview; assignment only supplies allocation percent.
```

### Prompt 5.2 - Assignment Server Actions

```text
Use the global prompt prefix.

Implement server actions for:
- Save draft assignment.
- Submit new assignment.
- Submit existing draft.
- Revalidate assignment.

Validation:
- Required fields.
- End date after start date.
- Allocation between 0 and 200 for POC.
- Server-side permission checks.

On create, generate assignment numbers like `A-1001`.
On write, run validation and write audit log.
```

## Phase 6 - Split Validator

### Prompt 6.1 - Validation Rules

```text
Use the global prompt prefix.

Implement reusable validation logic under `src/lib/validation`.

Rules:
- Direct seller split total must equal 100%.
- LPS/Farm Gate allocation must be <= 100%.
- Overlay role is additive and informational.
- Inactive seller is an error.
- End date must be after start date.
- Same seller and role cannot overlap an existing approved assignment.

Store results in ValidationResult with validationGroupKey, ruleCode, severity, message.

Add unit tests for:
- Date overlap helper.
- Direct split total.
- LPS split total.
- Overlapping approved seller/role detection.
```

### Prompt 6.2 - Validator Screen

```text
Use the global prompt prefix.

Build `/validator`.

Include:
- Revalidate all action.
- Summary cards: assignments checked, errors, warnings, passed checks.
- Grouped validation cards by customer/product/date.
- Each result shows business-readable label, severity, message, recommended fix, seller, role, and View action.

Create display helpers mapping raw rule codes to user-friendly labels and recommended fixes.
```

## Phase 7 - Approval Workflow

### Prompt 7.1 - Approval Queue

```text
Use the global prompt prefix.

Build `/approvals`.

Include:
- Submitted assignments pending manager review.
- Seller/role/customer/product/allocation/dates.
- Validation summary.
- Approve form with optional comments.
- Reject form with required comments.

Server actions:
- Approve assignment.
- Reject assignment.

Approval rules:
- Manager permission required.
- Approval is blocked when validation errors exist.
- Approved assignment becomes Active when current date is inside the effective date range; otherwise Approved.
- Rejection requires comments.
- Write approval history and audit log.
```

## Phase 8 - Credit Preview And Export

### Prompt 8.1 - Credit Preview

```text
Use the global prompt prefix.

Build `/credit-preview`.

Include:
- Mock invoice selector.
- Admin-only Add Mock Invoice form with invoice number, customer, product group, invoice date, quantity, unit such as tons, and amount.
- Mock invoice table with Preview, Edit, Delete actions.
- Invoice edit route `/credit-preview/invoices/[id]/edit`.
- Selected invoice summary.
- Credited output table with assignment, seller, role, allocation, credited quantity, credited amount, status.

Calculation:
- Match approved or active assignments by invoice customer, product group, and invoice date.
- Exclude visibility-only roles where `isEligibleForCredit` is false.
- If product metric type is Amount, calculate amount only.
- If Quantity, calculate quantity only.
- If Both, calculate both.
- credited quantity = invoice quantity * allocation percent / 100.
- credited amount = invoice amount * allocation percent / 100.

Empty state:
- Explain no matching approved/active credit-eligible assignments for selected invoice.
```

### Prompt 8.2 - Export Center

```text
Use the global prompt prefix.

Build `/exports` and `/exports/approved-assignments/route.ts`.

Export approved/active assignments as CSV with stable columns:
- assignment_number.
- customer code/name/sales parent/SAP/Salesforce IDs.
- product group code/name/external ID/metric type.
- seller code/name/email.
- role name/behavior.
- allocation percent.
- start/end dates.
- status.

Add CSV helper tests.
```

## Phase 9 - Dashboard, History, And Polish

### Prompt 9.1 - Dashboard

```text
Use the global prompt prefix.

Build `/` dashboard.

Include:
- Current demo role in page description.
- Active assignment count.
- Pending approval count.
- Validation failure count.
- Recent audit activity.
- Quick links to create assignment, approvals, validator, credit preview.

The dashboard should explain product value within 30 seconds.
```

### Prompt 9.2 - History And Audit

```text
Use the global prompt prefix.

Build `/history`.

Include:
- Audit table with object type, action, actor, timestamp, comment, value summary.
- Role-appropriate read access.
- Empty state when no events exist.

Ensure create/update/submit/approve/reject/activate/deactivate/export-style actions write audit where applicable.
```

### Prompt 9.3 - UX Polish Pass

```text
Use the global prompt prefix.

Run a UX polish pass across all routes.

Add or improve:
- Success messages after create/update.
- Empty states.
- Error-readable microcopy.
- Loading states where the route benefits from them.
- Back buttons on create/detail/edit pages.
- No text overlap on mobile or desktop.
- Tables with horizontal scroll where needed.
- Consistent button and badge styling.
- Keyboard-visible focus states.
```

## Phase 10 - Testing And Quality Gates

### Prompt 10.1 - Unit And Smoke Tests

```text
Use the global prompt prefix.

Implement automated tests:
- `tests/unit/permissions.test.ts`
- `tests/unit/validation-rules.test.ts`
- `tests/unit/csv.test.ts`
- `tests/smoke/poc-data-smoke.ts`

Smoke test should assert:
- At least 6 sellers.
- At least 4 roles.
- At least 1 credit-eligible role.
- At least 1 visibility-only role.
- At least 4 product groups.
- At least 4 customers.
- At least 1 submitted assignment.
- At least 1 approved/active assignment.
- At least 1 validation error.
- At least 1 mock invoice with tons, quantity, and amount.
- At least 1 invoice has approved/active credit-eligible assignment coverage.
```

### Prompt 10.2 - Quality Gate Report

```text
Use the global prompt prefix.

Create or update `docs/07_quality_gate_report.md`.

Include:
- Scope.
- Commands:
  - npm run typecheck
  - npm run lint
  - npm run test
  - npm run test:smoke
  - npm run build
  - npm audit --audit-level=moderate
- Coverage added.
- Known gaps.
- Recommendation for Playwright E2E tests.

Run the commands that are available. Document any failures or dependency advisories honestly.
```

### Prompt 10.3 - Final Verification

```text
Use the global prompt prefix.

Run final verification:
- npm run lint
- npm run typecheck
- npm test
- npm run test:smoke
- npm run build

Then start the dev server and provide the local URL.

Do not claim success for a command that was not run.
```

## Phase 11 - Stakeholder Review Gap Pass

### Prompt 11.1 - Answer Review Questions And Convert To Changes

```text
Use the global prompt prefix.

Review stakeholder questions from a document or notes. Categorize them by app area:
- Seller Profile.
- Roles.
- Customers & Products.
- Assignments.
- Split Validator.
- Credit Preview.
- Overall UI.

For each question:
1. Explain current behavior.
2. Decide whether the app needs a code change, helper text, validation, or product decision.
3. Implement the safe code changes.

Expected improvements:
- Seller edit flow.
- Workday/local hire/non-employee helper text.
- Role name/category/eligible-for-credit helper text.
- Sales Parent and external ID helper text.
- Metric type helper text.
- Assignment page explanation that amount and tons come from invoices.
- Credit Preview invoice entry form.
- Clearer validation labels and recommended fixes.
- Current role visibility.
- Collapsible sidebar.
- Light/dark toggle.

Run lint, typecheck, tests, and smoke tests.
```

## Phase 12 - GitHub Repository Setup

### Prompt 12.1 - Prepare Git Repository

```text
Use the global prompt prefix.

Prepare this app folder as a clean Git repository.

Steps:
- Check whether the current folder is inside a larger unrelated Git repo.
- If it is, do not push unrelated parent files.
- Initialize a clean repo inside this app folder if needed.
- Verify `.gitignore` excludes `.env`, `.next`, `node_modules`, logs, local SQLite DB, coverage, build artifacts, and tsbuildinfo.
- Stage only app files, docs, Prisma schema/migrations/seed, source, tests, and config.
- Commit with message: `Initial FSI sales attribution POC`.
```

### Prompt 12.2 - Create GitHub Repository And Push

```text
Use the global prompt prefix.

Using GitHub CLI:
- Confirm `gh auth status`.
- Create a private GitHub repository named `fsi-sales-attribution-poc`.
- Add it as `origin`.
- Push branch `main`.
- Verify local status is clean.
- Report the repository URL, branch, remote, and commit hash.

If GitHub CLI is not authenticated, stop and ask the user to authenticate with `gh auth login`.
```

## Phase 13 - Deploy

### Prompt 13.1 - Deployment Readiness Review

```text
Use the global prompt prefix.

Prepare a deployment readiness review for the POC.

Check:
- The app builds with `npm run build`.
- Required env vars are documented.
- `.env` is not committed.
- Prisma migration files exist.
- Seed command is documented.
- Local SQLite is acceptable only for POC/demo.
- Deployment target is selected: Vercel, Azure App Service, Azure Container Apps, or another approved target.

Create `docs/09_deployment_plan.md` with:
- Recommended POC deployment option.
- Required environment variables.
- Build command.
- Start command.
- Database setup notes.
- Seed strategy.
- Known POC limitations.
- Rollback plan.
```

### Prompt 13.2 - Vercel POC Deployment Prompt

```text
Use the global prompt prefix.

Prepare this Next.js POC for Vercel deployment.

Tasks:
- Confirm the app builds.
- Add deployment notes for Prisma/SQLite limitations.
- If using SQLite on Vercel is not suitable, document that the POC should use a managed PostgreSQL-compatible database for hosted demos.
- Add `DATABASE_URL`, `NEXT_PUBLIC_APP_NAME`, and `AUTH_SECRET` to deployment instructions with placeholder names only.
- Do not add real secret values.
- Document migration and seed commands.

If asked to deploy directly:
- Use the Vercel CLI only if authenticated.
- Otherwise provide manual deployment steps.
```

### Prompt 13.3 - Azure POC Deployment Prompt

```text
Use the global prompt prefix.

Prepare this POC for Azure deployment planning.

Target options:
- Azure App Service for straightforward Node hosting.
- Azure Container Apps if containerization is required.
- Azure Database for PostgreSQL for hosted persistence.

Create deployment documentation with:
- Architecture diagram in text.
- App service/container settings.
- Environment variables.
- Database migration command.
- Seed command for demo data.
- Health check route recommendation.
- CI/CD outline using GitHub Actions.

Do not connect to live enterprise systems.
```

## Phase 14 - Monitor And Operate

### Prompt 14.1 - Monitoring Plan

```text
Use the global prompt prefix.

Create `docs/10_monitoring_plan.md`.

Include POC monitoring and production-future monitoring:
- Uptime/health check.
- Server action error tracking.
- Build/deployment status.
- Audit-log review process.
- Seed data readiness check.
- Validation error volume.
- Approval queue aging.
- Credit Preview no-match frequency.
- Export usage.
- Security checks for secrets and dependency advisories.

Include suggested metrics, alert thresholds, owner, and review cadence.
```

### Prompt 14.2 - Add Health And Readiness Checks

```text
Use the global prompt prefix.

Add lightweight health/readiness support suitable for a POC.

Implement:
- A simple health route if appropriate, such as `/api/health`, returning app name, status, and timestamp.
- A readiness check that verifies database connectivity if safe for the runtime.
- Tests or smoke script coverage for the health route if feasible.

Do not expose secrets, connection strings, or sensitive system details.
```

### Prompt 14.3 - Operational Runbook

```text
Use the global prompt prefix.

Create `docs/11_runbook.md`.

Include:
- How to run locally.
- How to reset and seed the database.
- How to run quality gates.
- How to create a demo invoice and preview credit.
- How to switch demo roles.
- How to troubleshoot no matching Credit Preview rows.
- How to troubleshoot validation errors.
- How to deploy.
- How to roll back.
- How to check logs and health status.
```

## Phase 15 - Future Hardening

### Prompt 15.1 - E2E Test Expansion

```text
Use the global prompt prefix.

Add Playwright E2E tests for the demo-critical journey:
1. Admin creates or edits seller setup.
2. Admin creates assignment.
3. Admin submits assignment.
4. Manager approves or rejects assignment.
5. Admin creates mock invoice.
6. Credit Preview shows credited output.
7. Export downloads approved assignments CSV.

Keep tests deterministic. Use seeded data where possible.
```

### Prompt 15.2 - Production Integration Planning

```text
Use the global prompt prefix.

Create a future integration plan.

Do not implement live integrations.

Document future adapter boundaries for:
- Workday employee and payroll.
- SAP/JDE/SAC/Datasphere invoice/customer/product data.
- Salesforce account visibility.
- Power BI reporting.
- PostgreSQL production database migration.

Identify which current fields already support each integration.
```

## Final Delivery Prompt

Use this when all phases are complete:

```text
Review the repository end to end.

Confirm:
- Source docs exist.
- Implementation follows `docs/06_implementation_plan.md`.
- Routes match `docs/03_app_flow.md`.
- Prisma schema matches `docs/05_backend_schema.md`.
- UI follows `docs/04_ui_ux_design_brief.md`.
- Quality gates pass.
- GitHub repo is clean and pushed.
- Deployment and monitoring docs exist.

Produce a concise final summary with:
- What was built.
- How to run locally.
- How to seed data.
- How to test.
- GitHub URL.
- Deployment readiness status.
- Known gaps.
```
