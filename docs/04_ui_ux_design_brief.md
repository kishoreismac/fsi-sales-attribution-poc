# UI/UX Design Brief - Feed Sales Incentive POC

## Experience Direction

The product should feel like a quiet, business-focused operational tool. It should be clear, fast, and demo-friendly, with restrained styling and dense but readable information. The UI should help a client understand the assignment foundation without feeling like a marketing site.

## Audience

Primary users are Sales Compensation Admins and Sales Managers. They need confidence, traceability, and low-friction review of assignments, not decorative visuals.

## Product Personality

- Trustworthy
- Structured
- Simple
- Audit-aware
- Future-ready
- Business-readable

## Layout Principles

- Use an app shell with sidebar navigation.
- Keep dashboard content scannable with compact metrics and work queues.
- Prefer tables for operational lists.
- Use detail panels, drawers, or pages for create/edit workflows.
- Avoid nested cards.
- Avoid oversized hero sections.
- Keep the first screen useful: dashboard and action queue, not a landing page.

## Visual Style

- Neutral background.
- Clear status colors for Draft, Submitted, Approved, Rejected, Active, Expired.
- Tables with strong hierarchy, compact rows, clear actions, and sortable headers where comparison is useful.
- 8px or smaller border radius for cards and controls unless the component system requires otherwise.
- Accessible color contrast.
- Visible focus states.
- No one-note decorative palette.

## Core Components

- App shell
- Sidebar navigation
- Page header with actions
- Data table
- Filter bar
- Status badge
- Metric widget
- Form field
- Select and combobox
- Date picker
- Percent input
- Validation message panel
- Approval decision modal
- Audit timeline
- Empty state
- Error state
- Loading skeleton
- Toast notification
- Export button
- Print button
- Sidebar pin toggle
- Theme toggle
- Sort link

## Screen-Level UX Notes

### Dashboard

Answer: What needs attention?

Include:

- Active assignments count.
- Pending approval count.
- Validation failures count.
- Expiring soon count.
- Recent audit activity.
- Quick links to create assignment, approval queue, validator, credit calculation, payments, and exports.

### Seller Management

Answer: Who can receive credit?

Include:

- Seller name, employee type, full-time flag, manager, active status, effective dates.
- Add/edit seller form.
- Inactive seller warning.

### Role Configuration

Answer: How does each seller role behave?

Include:

- Role name, category, behavior, split limit, eligible flag, active flag.
- Direct, LPS, Overlay, Manager Roll-up seed roles.
- Copy should explain behavior through labels and validation messages, not long instructions.

### Assignment Workbench

Answer: Who gets credit, for what, and when?

Include:

- Customer, product group, seller, role, allocation, start/end dates, status.
- Group by customer plus product group when helpful.
- Inline validation status.
- Create, edit, submit actions based on role and assignment status.

### Split Validator

Answer: Are splits valid before approval?

Include:

- Grouped validation results by customer, product group, and date range.
- Severity badges.
- Clear messages and action links to edit affected assignments.

### Approval Queue

Answer: What assignments need review?

Include:

- Submitted assignments.
- Validation summary.
- Approve and reject actions.
- Required rejection comment.

### Invoice Credit Calculation

Answer: How is this invoice transaction credited?

Include:

- Invoice transaction selector.
- Invoice customer, product group, quantity, unit, amount, date.
- Result table with seller, role, allocation, credited quantity, credited amount.
- Empty state when no matching approved assignment exists.

### Monthly Interim Payments

Answer: What interim payment values are generated for the selected month?

Include:

- Payment month and interim rate controls.
- Eligible seller, invoice, gross credited, interim payment, and true-up reserve metrics.
- Seller-level payment run table.
- Copy that separates interim payment review from final payroll execution.

### Export Center And Assignment Statement

Answer: What approved outputs can be exported or printed?

Include:

- Approved assignment CSV.
- Account Assignment Statement link.
- Printable statement surface that uses the application color tokens, not one-off client screenshot colors.
- Active-only assignment filtering for the statement.

### Assignment History / Audit

Answer: Who changed what and when?

Include:

- Timeline or table of audit events.
- Object, action, actor, timestamp, old value, new value, comments.

## Required UX States

Every user-facing workflow must include:

- Loading state.
- Empty state.
- Error state.
- Success state.

## Accessibility Requirements

- Keyboard navigation for forms, tables, and modals.
- Visible focus rings.
- Labels for every input.
- Error messages linked to fields.
- No color-only meaning.
- Responsive at mobile, tablet, 1366px, 1440px, and 1920px.
- Core flows usable without a mouse.

## Microcopy Standards

Use product terms consistently:

| Use | Avoid |
|---|---|
| Assignment | Ticket, case, ownership row |
| Seller | Salesperson, rep, employee, user when credit recipient is meant |
| Role | Type, category when role configuration is meant |
| Product Group | Product bucket |
| Sales Parent | Parent account unless source data uses that term |
| Invoice Credit Calculation | Credit preview, payout simulation |
| Invoice Transaction | Mock invoice |
| Monthly Interim Payments | Payment execution, payroll posting |
| Account Assignment Statement | Invoice |

Example messages:

- `Direct seller split is 80%. Adjust to 100% before approval.`
- `LPS allocation is 120%. Reduce to 100% or less.`
- `This assignment overlaps an existing approved assignment.`
- `Seller is inactive for the selected date range.`
- `Assignment submitted for review.`
- `Assignment approved and ready for credit calculation.`
- `Invoice amount and quantity are entered on invoice transactions, not assignments.`
- `Interim payment values are generated for review; this POC does not execute payroll or bank payments.`
