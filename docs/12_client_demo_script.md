# Client Demo Script - Sales Attribution And Credit Assignment

## Demo Purpose

Use this script to demo the product in a clear business sequence. The story is:

1. Sales Operations sets up sellers, roles, customers, and product groups.
2. Sales Compensation Admin creates customer plus product group assignments.
3. The system validates splits, roles, and effective dates.
4. Sales Manager approves submitted assignments.
5. The system calculates invoice credit.
6. Finance reviews monthly interim payment values.
7. Admin exports or prints approved assignment outputs.

## P1 Features To Highlight

| P1 Feature | Where It Appears In Demo |
|---|---|
| Assign credit at customer + product group level | Assignments, New Assignment, Assignment Detail, Exports |
| Support split allocations across multiple sellers | Assignments, Split Validator, Assignment Detail |
| Support multiple role types | Roles, Assignments, Split Validator, Credit Calculation |
| Support effective-dated assignments | Assignments, Assignment Detail, Lifecycle status, History |
| Generate monthly interim payment values | Payments |

## Recommended Demo Order

Use this role order:

1. Sales Compensation Admin
2. Sales Manager
3. Finance
4. Seller
5. IT System Admin

This order follows the natural business workflow from setup to approval to credit/payment review.

---

## 1. Sales Compensation Admin Demo

### Step 1 - Start On Dashboard

Role: `Sales Compensation Admin`

Screen: `Dashboard`

What to show:

- Active Assignments
- Pending Approval
- Validation Failures
- Audit Events
- New Assignment button

What to say:

> This dashboard gives Sales Compensation a quick health check of the assignment process: what is active, what needs manager review, what has validation issues, and what changed recently.

P1 features shown:

- Effective-dated assignments appear through active assignment counts.
- Split allocation issues appear through validation failures.

### Step 2 - Show Seller Setup

Screen: `Sellers`

What to show:

- Seller code
- Employee type
- Manager
- Effective dates
- Active status

What to say:

> Before we assign credit, the system needs to know who can receive credit. Sellers have stable IDs, manager relationships, active status, and effective dates so future integrations like Workday can map cleanly.

P1 features shown:

- Supports the seller side of customer plus product group credit assignment.
- Supports historical accuracy through effective-dated seller records.

### Step 3 - Create Or Explain A Seller Profile

Screen: `Sellers`

What to click:

- Use the `Add Seller` form on the Sellers screen.

What to show:

- Seller Code
- Workday Employee ID
- Name
- Email
- Employee Type
- Manager
- Full-time checkbox
- Start Date
- End Date
- Create Seller button

What to say:

> To create a seller, Sales Compensation enters the seller's stable seller code, name, email, employee type, manager, and effective dates. Workday Employee ID is used when the seller exists in Workday; local hires or non-employees can be represented without forcing that ID.

Presenter sequence:

1. Point to `Seller Code` and explain it is the stable seller identifier.
2. Point to `Workday Employee ID` and explain it is optional for non-Workday sellers.
3. Point to `Employee Type` and explain this supports Workday Employee, Local Hire, and Non-Employee scenarios.
4. Point to `Manager` and explain manager relationships support roll-ups and future reporting.
5. Point to `Start Date` and `End Date` and explain that seller availability is effective-dated.
6. If you do not want to change demo data, do not submit; simply explain the form.

P1 features shown:

- Supports assigning credit to eligible sellers.
- Supports effective-dated setup records.

Demo tip:

- For a live demo, it is usually safer to explain the seller creation fields without saving a new seller unless the presenter has a prepared unique seller code and email.

### Step 4 - Show Role Configuration

Screen: `Roles`

What to show:

- Direct Seller
- Overlay Seller
- LPS / Farm Gate Seller
- Manager Roll-up
- Credit eligibility
- Split behavior

What to say:

> Role behavior is configurable. Direct sellers participate in split allocation, overlay sellers can be additive, LPS roles can have limits, and manager roll-ups can be visible without behaving like direct seller splits.

P1 features shown:

- Multiple role types: direct, overlay, LPS, manager roll-ups.
- Split behavior is role-driven, not hardcoded in the UI.

### Step 5 - Create Or Explain A Role

Screen: `Roles`

What to click:

- Use the `Add Role` form on the Roles screen.

What to show:

- Role Name
- Category
- Behavior
- Required Split Total
- Split Maximum
- Eligible For Credit checkbox
- Start Date
- End Date
- Create Role button

What to say:

> Roles control how the system validates and calculates credit. The role name is the business label. Category groups the role as Direct, Overlay, LPS, Manager Roll-up, or Future Role. Behavior controls whether the assignment is a split, capped split, additive overlay, roll-up, or configurable role.

Presenter sequence:

1. Point to `Role Name` and explain it is what business users see.
2. Point to `Category` and show Direct Seller, LPS / Farm Gate Seller, Overlay Seller, Manager Roll-up, and Future Role.
3. Point to `Behavior` and explain:
   - `Split` means the seller participates in a percentage split.
   - `Split With Limit` means the role has a maximum allowed allocation.
   - `Additive` means the role can add credit without reducing direct seller splits.
   - `Roll-up` supports manager visibility or roll-up style views.
4. Point to `Required Split Total` and explain Direct Seller groups commonly need to total 100%.
5. Point to `Split Maximum` and explain LPS-style roles can be capped.
6. Point to `Eligible For Credit` and explain unchecked roles are visibility-only and do not generate credit calculation rows.
7. Point to `Start Date` and `End Date` and explain role behavior can also be effective-dated.

P1 features shown:

- Supports multiple role types.
- Supports split allocation logic.
- Supports effective-dated role configuration.

Demo tip:

- Do not create a duplicate Direct Seller role during the demo. If creating a role live, use a clearly new role name like `Strategic Account Overlay Demo`.

### Step 6 - Show Customers And Product Groups

Screen: `Customers & Products`

What to show:

- Customer code
- Sales parent
- External IDs
- Product group
- Metric type: quantity, amount, or both

What to say:

> The assignment grain is customer plus product group. That means credit can be controlled at the level where selling relationships actually happen, instead of only at customer or seller level.

P1 features shown:

- Assign credit at customer + product group level.

### Step 7 - Create Or Explain A Customer

Screen: `Customers & Products`

What to click:

- Use the `Add Customer` form in the Customers section.

What to show:

- Customer Code
- Customer Name
- Sales Parent
- SAP Customer ID
- Salesforce Account ID
- Start Date
- End Date
- Create Customer button

What to say:

> Customers are one side of the assignment grain. The app keeps stable customer codes plus future integration IDs for SAP and Salesforce. Sales Parent lets related customer locations roll up into a broader selling relationship.

Presenter sequence:

1. Point to `Customer Code` and explain it is the stable POC/customer identifier.
2. Point to `Customer Name` and explain it is the account name users recognize.
3. Point to `Sales Parent` and explain it groups related locations or accounts.
4. Point to `SAP Customer ID` and `Salesforce Account ID` and explain these are future integration keys.
5. Point to `Start Date` and `End Date` and explain customer availability is effective-dated.

P1 features shown:

- Supports assigning credit at customer level.
- Supports future integration readiness.
- Supports effective-dated setup records.

Demo tip:

- If creating a customer live, use a unique code such as `CUST-DEMO-01` to avoid duplicate-code errors.

### Step 8 - Create Or Explain A Product Group

Screen: `Customers & Products`

What to click:

- Use the `Add Product Group` form in the Product Groups section.

What to show:

- Product Group Code
- External Product Group ID
- Product Group Name
- Metric Type
- Start Date
- End Date
- Create Product Group button

What to say:

> Product Group is the other side of the assignment grain. This is what lets the same customer have different sellers or split rules for different product lines. Metric Type tells Credit Calculation whether to calculate quantity, amount, or both from invoice data.

Presenter sequence:

1. Point to `Product Group Code` and explain it is the stable product group identifier.
2. Point to `External Product Group ID` and explain it is a future product-master or ERP key.
3. Point to `Product Group Name` and explain it is the business-facing product group label.
4. Point to `Metric Type` and explain:
   - `Quantity` calculates credited tons, pounds, kilograms, or units.
   - `Amount` calculates credited dollars.
   - `Both` calculates quantity and amount.
5. Point to `Start Date` and `End Date` and explain product groups are effective-dated.

P1 features shown:

- Supports assigning credit at product group level.
- Supports customer + product group assignment grain.
- Supports invoice credit calculation behavior through metric type.

Demo tip:

- If creating a product group live, use a unique code such as `PG-DEMO-01`.

### Step 9 - Show Existing Assignments

Screen: `Assignments`

What to show:

- Assignment number
- Customer
- Product group
- Seller
- Role
- Allocation percentage
- Effective dates
- Validation
- Lifecycle

What to say:

> This is the core workbench. Each row says who gets credit, for which customer, for which product group, at what percentage, and during which effective date range.

P1 features shown:

- Customer + product group credit assignment.
- Split allocations across multiple sellers.
- Multiple role types.
- Effective-dated assignments.

Recommended rows to point out:

- Two rows for the same customer and product group with 80% and 20% direct seller split.
- Overlay or manager roll-up rows to show non-direct role behavior.
- Future approved or active lifecycle status to explain date-aware activation.

### Step 10 - Create A New Assignment

Screen: `Assignments` -> `New Assignment`

What to show:

- Customer dropdown
- Product group dropdown
- Seller dropdown
- Role dropdown
- Allocation percentage
- Start date
- Optional end date
- Reason / notes

What to say:

> Amount and tons are not entered here. Assignments only define the credit rule: customer, product group, seller, role, allocation percent, and effective dates. Invoice quantity and amount are entered later on invoice transactions.

P1 features shown:

- Customer + product group assignment.
- Role-based assignment.
- Effective dates.
- Allocation percentage.

Demo tip:

- If you do not want to change demo data during a client presentation, open the screen and explain the fields without saving.

### Step 11 - Show Assignment Detail

Screen: `Assignments` -> `View`

What to show:

- Current status
- Customer and product group
- Seller and role
- Allocation
- Effective dates
- Validation results
- Approval history
- Revalidate action
- Submit action when available

What to say:

> The detail page is where a reviewer can understand why an assignment is ready or not ready for approval. Validation, approval history, and effective-dated context are visible together.

P1 features shown:

- Effective-dated assignments.
- Split validation.
- Role-based behavior.

### Step 12 - Run Split Validator

Screen: `Split Validator`

What to show:

- Direct seller split total
- LPS limit validation
- Overlay additive messages
- Recommended fixes

What to say:

> The validator protects the process before approval. Direct seller splits must total 100%. LPS allocations cannot exceed their limit. Overlay roles can be additive and do not reduce direct seller split.

P1 features shown:

- Split allocations across multiple sellers.
- Multiple role types.

### Step 13 - Show Credit Calculation

Screen: `Credit Calculation`

What to show:

- Invoice transaction selector
- Quantity and unit
- Amount
- Customer and product group
- Calculation result by seller
- Credited quantity
- Credited amount

What to say:

> Invoice transactions bring in quantity and amount. The system matches the invoice customer, product group, and invoice date to approved active assignments, then applies allocation percentages.

P1 features shown:

- Customer + product group assignment drives credit calculation.
- Effective dates determine whether an assignment applies to the invoice date.
- Split allocations distribute credited quantity and amount.

### Step 14 - Show Exports

Screen: `Exports`

What to show:

- Approved assignment CSV
- Account Assignment Statement
- Print Statement button

What to say:

> Approved assignment data can be exported for downstream reporting or future integrations. The Account Assignment Statement gives a client-familiar printable view of active account and seller allocations.

P1 features shown:

- Customer + product group assignment output.
- Effective active assignments.

---

## 2. Sales Manager Demo

### Step 1 - Switch Role

Role: `Sales Manager`

Screen: left sidebar Demo Role control

What to say:

> Now we switch to the Sales Manager role. The navigation changes because managers review and approve assignments, but they do not manage setup records.

### Step 2 - Review Dashboard

Screen: `Dashboard`

What to show:

- Pending Approval
- Validation Failures
- Assignment Queue

What to say:

> The manager sees the work that needs approval or review, without being exposed to admin setup actions.

### Step 3 - Open Approvals

Screen: `Approvals`

What to show:

- Submitted assignments
- Validation status
- Approve / Reject actions
- Comments

What to say:

> Managers approve submitted assignments only after validation is acceptable. This replaces email-based approval with a governed, auditable workflow.

P1 features shown:

- Effective-dated assignments become approved and then active when date-valid.
- Split validation protects approval quality.

### Step 4 - Open Assignment Detail From Approval Context

Screen: `Assignments` -> `View`

What to show:

- Assignment details
- Validation results
- Approval history
- Lifecycle status

What to say:

> The manager can inspect the assignment before deciding. They can see who gets credit, for what product group, what percentage, and during which dates.

P1 features shown:

- Customer + product group assignment.
- Split allocation.
- Role behavior.
- Effective dates.

### Step 5 - Show Credit Calculation As Manager

Screen: `Credit Calculation`

What to say:

> Managers can also see how approved assignments affect invoice credit, which helps them trust what they are approving.

P1 features shown:

- Credit assignment rules flow into invoice credit calculation.

### Step 6 - Show Payments As Manager

Screen: `Payments`

What to show:

- Payment month
- Interim rate
- Gross credited
- Monthly interim payment
- True-up reserve

What to say:

> This is not payroll execution. It generates monthly interim payment values from credited invoice amounts, so sellers can receive consistent income while final reconciliation remains separate.

P1 features shown:

- Generate monthly interim payment values.

---

## 3. Finance Demo

### Step 1 - Switch Role

Role: `Finance`

What to say:

> Finance focuses on approved outputs, credit calculation, payment values, and audit visibility. They are not creating assignments in this POC.

### Step 2 - Review Credit Calculation

Screen: `Credit Calculation`

What to show:

- Invoice amount
- Quantity and unit
- Credited amount by seller
- Calculation state

What to say:

> Finance can see how invoice amount and quantity are converted into credited values using approved assignment rules.

P1 features shown:

- Credit assignment drives financial credit outputs.

### Step 3 - Review Monthly Interim Payments

Screen: `Payments`

What to show:

- Select payment month
- Adjust or explain interim rate
- Eligible invoices
- Eligible sellers
- Gross credited amount
- Monthly interim payment
- True-up reserve
- Seller-level payment rows

What to say:

> Payment Processing generates interim values for review. It uses the credited invoice amount and applies an interim percentage. The remaining balance is kept as true-up reserve for final reconciliation.

P1 features shown:

- Generate monthly interim payment values so sellers receive consistent income.

### Step 4 - Review History

Screen: `History`

What to show:

- Action
- Object
- Actor
- Date
- Comments

What to say:

> Finance can trace who changed or approved assignment data before it impacts credit and payment values.

---

## 4. Seller Demo

### Step 1 - Switch Role

Role: `Seller`

What to say:

> The Seller role is intentionally limited. Sellers can view relevant assignment information, but cannot create or approve assignment rules.

### Step 2 - Show Dashboard

Screen: `Dashboard`

What to show:

- Read-only overview
- Reduced navigation

What to say:

> This gives sellers transparency without giving them control over compensation setup.

### Step 3 - Show Assignments

Screen: `Assignments`

What to show:

- Customer
- Product group
- Seller
- Role
- Allocation
- Dates
- Lifecycle

What to say:

> Sellers can understand which customer and product group relationships are assigned and when those assignments are active.

P1 features shown:

- Customer + product group assignment visibility.
- Effective-dated assignment visibility.

---

## 5. IT System Admin Demo

### Step 1 - Switch Role

Role: `IT System Admin`

What to say:

> The IT role is focused on oversight, validation, and audit readiness. In production, this role would support integrations and operational monitoring.

### Step 2 - Show Split Validator

Screen: `Split Validator`

What to say:

> IT and operations can see the validation rules working without owning the business approval decision.

P1 features shown:

- Split allocations.
- Role-specific validation.

### Step 3 - Show History

Screen: `History`

What to say:

> The application is audit-aware. Every important business action can be reviewed by action type, actor, object, and timestamp.

---

## End-To-End Demo Story

Use this short summary at the end:

> This POC proves the core foundation for sales attribution. We can assign credit at customer plus product group level, support split ownership across sellers, handle direct, overlay, LPS, and manager roll-up roles, preserve effective-dated history, and generate monthly interim payment values from approved credit assignments.

## Suggested 20-Minute Demo Timing

| Time | Segment |
|---|---|
| 2 minutes | Dashboard and business problem |
| 3 minutes | Sellers, roles, customers, product groups |
| 5 minutes | Assignments, detail page, effective dates |
| 3 minutes | Split Validator |
| 3 minutes | Manager approval |
| 2 minutes | Credit Calculation |
| 1 minute | Payments |
| 1 minute | Exports and wrap-up |

## Important Presenter Notes

- Do not say the POC executes payroll or sends payments. It generates interim payment values for review.
- Do not say integrations are live. Workday, SAP/JDE/SAC, Salesforce, Power BI, and payroll are future integration phases.
- Explain clearly that assignments store allocation percentage. Invoice transactions store quantity, unit, amount, and invoice date.
- Use `Active For Crediting` to explain date-aware approval becoming active.
- Use `Future Approved For Crediting` to explain an approved assignment that starts later.
- Use validation errors to show control, not failure. The app is catching issues before approval and payment.
