# App Flow - Feed Sales Incentive POC

## Routes And Screens

| Route | Screen | Purpose |
|---|---|---|
| `/` | Dashboard | Show active assignments, pending approvals, failed validations, and demo quick actions. |
| `/sellers` | Seller Management | Create, edit, activate, deactivate, and review seller profiles. |
| `/roles` | Role Configuration | Configure Direct, LPS/Farm Gate, Overlay, Manager Roll-up, and future roles. |
| `/customers-products` | Customer & Product Group Setup | Manage mock customers and product groups. |
| `/assignments` | Assignment Workbench | Create and manage customer plus product group credit assignments. |
| `/assignments/new` | New Assignment | Pick customer, product group, seller, role, allocation, dates, and notes. |
| `/assignments/:id` | Assignment Detail | View assignment details, validation results, status, history, and actions. |
| `/validator` | Split Validator | Review grouped allocation checks and issues. |
| `/approvals` | Approval Queue | Approve or reject submitted assignments. |
| `/credit-preview` | Invoice Credit Calculation | Calculate credited tons, units, or dollars using POC invoice transaction data. |
| `/payments` | Monthly Interim Payments | Generate monthly interim payment values from credited invoice amounts. |
| `/history` | Assignment History / Audit | Review changes, decisions, and audit events. |
| `/exports` | Export Center | Export approved assignments and open printable account assignment statements. |
| `/exports/account-assignments` | Account Assignment Statement | Print active account/seller allocation statements in a client-familiar format. |

## Navigation

- Left sidebar on desktop with hover-to-expand when collapsed and an optional pin toggle to keep it open.
- Compact top or bottom navigation on mobile.
- Dashboard, Assignments, Approvals, Split Validator, Credit Calculation, Payments, Exports, and History should be first-class navigation items when permitted.
- Back buttons should appear on create/detail pages.
- Status badges should be consistent across screens.
- Tabular screens should support sort links on core columns.

## Auth Flow

POC:

1. User enters app.
2. User chooses or is assigned a demo role: Sales Compensation Admin or Sales Manager.
3. App limits visible actions by role.
4. Server-side handlers validate role permissions for write, submit, approve, reject, and export actions.

Future:

1. Signup or identity-provider login.
2. Verify account.
3. Onboarding or organization selection.
4. Dashboard.

## Core Journey: Create And Approve Assignment

1. Admin opens Assignment Workbench.
2. Admin clicks create assignment.
3. Admin selects customer or sales parent.
4. Admin selects product group or industry group.
5. Admin selects seller.
6. Admin selects role.
7. Admin enters allocation percent.
8. Admin enters start date and optional end date.
9. System validates required fields and date order.
10. System checks split behavior based on role configuration.
11. Admin saves draft.
12. Admin submits assignment.
13. Manager opens Approval Queue.
14. Manager reviews assignment and validation results.
15. Manager approves or rejects with comments.
16. System records approval history and audit log.
17. Approved assignment becomes active when date-valid.

## Core Journey: Validate Split

1. User opens Split Validator or assignment detail.
2. User filters by customer, product group, and date range.
3. System groups related assignments.
4. Direct seller allocations must total 100%.
5. LPS allocations must be 100% or less.
6. Overlay assignments are shown as additive.
7. Date overlaps and inactive sellers are flagged.
8. User sees severity, message, and recommended correction.

## Core Journey: Invoice Credit Calculation

1. User opens Invoice Credit Calculation.
2. User selects or creates a POC invoice transaction with customer, product group, quantity, unit, amount, and invoice date.
3. System finds approved active credit-eligible assignments for that customer plus product group and invoice date.
4. System applies allocation percentages.
5. User sees credited quantity or credited amount by seller.
6. User can edit invoice transaction inputs and recalculate.

## Core Journey: Monthly Interim Payments

1. User opens Payments.
2. User selects payment month and interim rate.
3. System uses eligible invoice transactions and active approved credit assignments.
4. System groups credited amount by seller.
5. User reviews gross credited amount, interim payment, and true-up reserve.

## Core Journey: Account Assignment Statement

1. Admin opens Exports.
2. Admin opens Account Assignment Statement.
3. System filters to active, credit-eligible assignments effective today.
4. Statement groups rows by account and product group.
5. Admin prints or saves the statement as PDF from the browser.

## Admin Journey

- Manage sellers.
- Manage roles.
- Manage customers and product groups.
- Create/edit assignments.
- Submit assignments.
- View audit log.
- Export approved assignment dataset.

## Manager Journey

- View dashboard.
- Review submitted assignments.
- Approve or reject assignments.
- View validation results and history.
- Preview credit for approved data.

## Empty States

| Screen | Empty State |
|---|---|
| Sellers | No sellers yet. Add a seller or load demo data. |
| Roles | No roles configured. Add Direct, Overlay, LPS, and Manager Roll-up roles. |
| Assignments | No assignments yet. Create the first assignment to start credit ownership setup. |
| Approvals | No assignments need review. |
| Invoice Credit Calculation | No invoice selected. Choose or create an invoice transaction to calculate credit. |
| Payments | No eligible invoice credit exists for the selected month. |
| Account Assignment Statement | No active credit assignments are available for this statement. |
| History | No audit events yet. Changes will appear here. |

## Error States

- Required field missing.
- Allocation percent invalid.
- Direct seller split is below or above 100%.
- LPS allocation exceeds 100%.
- Assignment overlaps an approved assignment.
- Seller inactive for selected date range.
- End date is before start date.
- Unauthorized action for current role.
- Export failed.

## Redirects After Actions

| Action | Redirect |
|---|---|
| Save seller | Seller detail or seller list |
| Save role | Role list |
| Save draft assignment | Assignment detail |
| Submit assignment | Assignment detail with submitted status |
| Approve assignment | Approval queue or assignment detail |
| Reject assignment | Approval queue or assignment detail |
| Export approved assignments | Stay on exports screen and show success state |
