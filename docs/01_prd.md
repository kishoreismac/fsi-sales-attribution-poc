# PRD - Feed Sales Incentive POC

## App Name

Feed Sales Incentive POC

## Tagline

Sales Attribution and Credit Assignment Foundation

## Problem

Sales attribution assignments, approvals, corrections, and history are currently handled across multiple systems and manual workflows. This creates operational effort, audit risk, and confusion when sellers change roles, customers are reassigned, or payment calculations need review.

## Target Users

Primary POC users:

- Sales Compensation Admin
- Sales Manager / Supervisor

Future users:

- Seller / Salesperson
- Finance / Accounting
- IT / System Admin

## Core Value Proposition

Give business users a simple application to create, validate, approve, history-track, and preview sales credit assignments at the customer plus product group level, using mock/manual/CSV data now and future-ready data contracts later.

## Product Vision

The product should feel simple to business users while being structured correctly behind the scenes. The assignment module is the foundation for future incentive calculations, payroll approvals, dashboards, adjustments, Salesforce visibility, accruals, and LPS billing.

## Must-Have Features

| ID | Requirement | Description |
|---|---|---|
| SACA-01 | Assign credit at customer plus product group level | Admin can assign a seller to a customer and product group so the system knows which seller receives credit. |
| SACA-02 | Support split allocations across multiple sellers | Multiple sellers can share the same customer plus product group, with validation based on role type. |
| SACA-03 | Support multiple role types | Direct Seller, Overlay Seller, LPS/Farm Gate Seller, Manager Roll-up, and future configurable roles. |
| SACA-04 | Support effective-dated assignments | Assignments have start and end dates to preserve historical accuracy. |

Additional POC features:

- Seller profile setup with mock or manual data.
- Role configuration with split, additive, roll-up, and future behavior types.
- Customer and product group setup.
- Assignment creation and edit workflow.
- Split validation for direct, LPS, overlay, overlap, inactive seller, and date errors.
- Simple approval workflow: draft, submitted, approved, rejected, active, expired.
- Assignment history and audit trail.
- Credit calculation preview using mock invoice data.
- Export-ready approved assignment dataset.

## Nice-To-Have Features

- Optional seller read-only view.
- Optional finance read-only view.
- CSV-style imports for mock sellers, customers, product groups, assignments, and invoices.
- Simple dashboard for status counts and validation failures.
- Basic dashboard/reporting for demo.

## Out Of Scope

- Live Workday employee integration.
- Live SAP/JDE/SAC transaction integration.
- Salesforce integration.
- Production Power BI integration.
- Actual payroll submission to Workday.
- Full production compensation engine.
- Full year-end true-up and accrual processing.
- LPS billing automation.
- Real payment execution or production accounting entries.

## POC Workflow

1. Set up seller.
2. Set up role.
3. Create assignment.
4. Validate split.
5. Submit and approve.
6. Preview credit.
7. Track history.

## User Stories

```text
As a Sales Compensation Admin, I want to create seller profiles so that eligible people can receive credit.
As a Sales Compensation Admin, I want to configure seller roles so that assignment behavior is not hardcoded.
As a Sales Compensation Admin, I want to create customer plus product group assignments so that credit ownership is clear.
As a Sales Compensation Admin, I want the system to validate split allocation rules so that payment issues are caught before approval.
As a Sales Manager, I want to approve or reject submitted assignments so that assignment changes are governed.
As a Sales Compensation Admin, I want assignment history to be preserved so that historical calculations and audits remain accurate.
As a Sales Compensation Admin, I want to preview credit from mock invoices so that the client can see how assignment data drives future calculations.
As a Sales Compensation Admin, I want approved assignments export-ready so that future Salesforce, Power BI, and calculation integrations can reuse the data.
```

## Success Metrics

- Admin can create and edit seller profiles using mock data.
- Admin can create configurable seller roles and assign behavior.
- Admin can create assignments for customer plus product group plus seller plus percentage plus date range.
- Direct seller splits validate to 100%.
- LPS splits validate at 100% or less.
- Overlay roles are additive and do not reduce direct seller split.
- Overlapping effective-dated assignments are prevented or warned.
- Assignment history is preserved rather than overwritten.
- Manager can approve or reject submitted assignments.
- Audit details are recorded for create, update, submit, approve, reject, and expire actions.
- Credit preview works with mock invoice data.
- Approved assignment data can be exported or exposed as a clean future-ready dataset.

