# Backend Schema - Feed Sales Incentive POC

## Data Model Principles

- Use mock/manual/CSV-style data for POC.
- Preserve stable external ID fields for future integrations.
- Keep role behavior configurable.
- Use effective dates for history-sensitive records.
- Do not overwrite assignment history.
- Track audit events for create, update, submit, approve, reject, expire, import, and export actions.

## Entities

### Seller

Purpose: People who can receive credit.

Fields:

- `id`
- `sellerCode`
- `workdayEmployeeId`
- `name`
- `email`
- `employeeType`: Workday Employee, Local Hire, Non-Employee
- `isFullTime`
- `managerSellerId`
- `active`
- `effectiveStartDate`
- `effectiveEndDate`
- `createdAt`
- `updatedAt`

### Role

Purpose: Defines credit behavior.

Fields:

- `id`
- `name`
- `category`: Direct Seller, LPS/Farm Gate Seller, Overlay Seller, Manager Roll-up, Future Role
- `behavior`: Split, Split With Limit, Additive, Roll-up, Configurable
- `splitRequiredTotal`
- `splitMaximum`
- `isEligibleForCredit`
- `active`
- `effectiveStartDate`
- `effectiveEndDate`
- `createdAt`
- `updatedAt`

### Customer

Purpose: Customer or sales parent used for assignment.

Fields:

- `id`
- `customerCode`
- `sapCustomerId`
- `salesforceAccountId`
- `name`
- `salesParent`
- `active`
- `effectiveStartDate`
- `effectiveEndDate`
- `createdAt`
- `updatedAt`

### Product Group

Purpose: Product or industry group used for assignment.

Fields:

- `id`
- `productGroupCode`
- `externalProductGroupId`
- `name`
- `metricType`: Quantity, Amount, Both
- `active`
- `effectiveStartDate`
- `effectiveEndDate`
- `createdAt`
- `updatedAt`

### Assignment

Purpose: Core sales credit ownership rule.

Fields:

- `id`
- `assignmentNumber`
- `customerId`
- `productGroupId`
- `sellerId`
- `roleId`
- `allocationPercent`
- `startDate`
- `endDate`
- `status`: Draft, Submitted, Approved, Rejected, Active, Expired
- `reasonNotes`
- `supersedesAssignmentId`
- `createdByUserId`
- `updatedByUserId`
- `createdAt`
- `updatedAt`

Indexes:

- `customerId`, `productGroupId`, `startDate`, `endDate`
- `sellerId`, `roleId`
- `status`

### Validation Result

Purpose: Stores split checks and assignment errors.

Fields:

- `id`
- `assignmentId`
- `validationGroupKey`
- `ruleCode`
- `severity`: Info, Warning, Error
- `message`
- `createdAt`

### Approval History

Purpose: Tracks assignment review.

Fields:

- `id`
- `assignmentId`
- `approverUserId`
- `decision`: Submitted, Approved, Rejected
- `comments`
- `decidedAt`

### Audit Log

Purpose: Tracks changes and sensitive actions.

Fields:

- `id`
- `objectType`
- `objectId`
- `action`
- `actorUserId`
- `oldValueJson`
- `newValueJson`
- `comment`
- `createdAt`

### Mock Invoice

Purpose: Used only for POC credit preview.

Fields:

- `id`
- `invoiceNumber`
- `customerId`
- `productGroupId`
- `quantity`
- `quantityUnit`
- `amount`
- `invoiceDate`
- `createdAt`

### Credit Preview Result

Purpose: Shows sample credited output.

Fields:

- `id`
- `mockInvoiceId`
- `assignmentId`
- `sellerId`
- `roleId`
- `allocationPercent`
- `creditedQuantity`
- `creditedAmount`
- `createdAt`

### Demo User

Purpose: POC role simulation and audit actor.

Fields:

- `id`
- `name`
- `email`
- `role`: Sales Compensation Admin, Sales Manager, Seller, Finance, IT System Admin
- `active`

## Relationships

- Seller may have one manager seller.
- Assignment belongs to one customer.
- Assignment belongs to one product group.
- Assignment belongs to one seller.
- Assignment belongs to one role.
- Validation result belongs to one assignment.
- Approval history belongs to one assignment.
- Audit log references any object by type and ID.
- Mock invoice belongs to one customer and one product group.
- Credit preview result belongs to one mock invoice and one assignment.

## Authorization Model

| Action | Admin | Manager | Seller | Finance | IT |
|---|---|---|---|---|---|
| Manage sellers | Yes | No | No | No | No |
| Manage roles | Yes | No | No | No | No |
| Manage customers/products | Yes | No | No | No | No |
| Create/edit assignments | Yes | No | No | No | No |
| Submit assignments | Yes | No | No | No | No |
| Approve/reject assignments | No | Yes | No | No | No |
| View credit preview | Yes | Yes | Optional future | Optional future | No |
| View audit log | Yes | Read limited | No | Read limited | Read limited |
| Export approved assignments | Yes | No | No | Optional future | No |

Server-side authorization is required for all write, approve/reject, audit, and export actions.

## Validation Rules

| Rule | Severity | Message |
|---|---|---|
| Direct seller split must equal 100% for same customer plus product group plus date range | Error | Direct seller split is `{total}%`. Adjust to 100% before approval. |
| LPS split cannot exceed 100% | Error | LPS allocation is `{total}%`. Reduce to 100% or less. |
| Overlay sellers can be additive | Info | Overlay role is additive and will not reduce direct seller split. |
| Assignment dates cannot overlap incorrectly for same seller/role unless allowed | Error | This assignment overlaps an existing approved assignment. |
| Inactive sellers cannot receive active assignments | Error | Seller is inactive for the selected date range. |
| Start date must be before end date | Error | End date must be after start date. |
| Required fields must be present | Error | Complete all required assignment fields before saving. |

## Data Governance

| Data Type | Sensitivity | Control |
|---|---|---|
| Seller name and email | Personal | Protect and role-limit access |
| Workday Employee ID | Sensitive | Mock only in POC; protect in future |
| Assignment rules | Business confidential | Role-based access |
| Audit logs | Confidential | Admin/limited read only |
| Mock invoices | Demo data | Mark as mock data |

## Seed Data Requirements

- At least 6 sellers.
- At least 2 managers.
- Direct, LPS/Farm Gate, Overlay, Manager Roll-up roles.
- At least 5 customers or sales parents.
- At least 4 product groups.
- Approved, submitted, draft, rejected, active, and expired assignments.
- Valid direct split example.
- Invalid direct split example.
- LPS over-allocation example.
- Overlay additive example.
- Mock invoices that produce visible credit preview results.

