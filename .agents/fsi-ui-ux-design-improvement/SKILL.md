---
name: fsi-ui-ux-design-improvement
description: Use this skill to upgrade the UI/UX of an existing Feed Sales Incentive website into a polished enterprise SaaS POC without changing routes, APIs, database schema, state management, validation logic, authentication, authorization, or working workflows. Apply when improving layouts, components, tables, forms, dashboards, status states, accessibility, and visual consistency.
---

# FSI Website UI/UX Design Improvement Skill

## Skill Name
Enterprise UI/UX Upgrade for the Feed Sales Incentive Website

## Agent Skill Operating Mode

Use this skill as a task-specific UI/UX improvement guide for an existing working application. The agent must inspect the current codebase first, preserve the working application flow, and improve the product through design tokens, reusable components, layout upgrades, screen-by-screen refinement, accessibility checks, and regression-safe validation.

The agent must not rebuild the application from scratch. The agent must not change business logic, routes, APIs, database schema, validation rules, authentication, authorization, or state management unless the user explicitly requests it.

## Purpose
Use this skill to improve the visual design, usability, and enterprise feel of the existing Feed Sales Incentive website without breaking the current application flow, existing logic, working components, routes, APIs, database structure, or user permissions.

The goal is to make the application look and feel like a professional enterprise product designed by an experienced human UI/UX designer, not like a generic AI-generated prototype.

---

## Product Context
The website supports the Feed Sales Incentive process, especially the Sales Attribution and Credit Assignment POC.

The application may include screens for:

- Seller profile management
- Role configuration
- Customer + product group assignment
- Split allocation validation
- Effective-dated assignments
- Assignment approval workflow
- Credit preview using mock invoice data
- Admin dashboards
- Seller/manager views
- Audit trail
- Future-ready integration placeholders for Workday, SAP/JDE/SAC, Salesforce, Power BI, and payroll

The UI must support data-heavy workflows, admin accuracy, auditability, and business-user confidence.

---

## When to Use This Skill
Use this skill when the existing FSI website is functionally working but needs professional UI/UX improvement.

This skill is especially useful when:

- The app looks too basic, unfinished, or AI-generated.
- Screens are working but lack enterprise design quality.
- Tables, forms, buttons, cards, spacing, colors, or typography need improvement.
- The workflow must remain exactly the same.
- The product needs to be shown to a client as a polished POC.
- The development team wants design improvements without rewriting the application.

---

## Non-Negotiable Rules

### 1. Do Not Break Existing Functionality
Do not change business logic unless explicitly requested.

Preserve:

- Existing routes
- Existing navigation flow
- Existing forms
- Existing validation logic
- Existing APIs
- Existing database schema
- Existing props and component contracts
- Existing state management
- Existing authentication and authorization behavior
- Existing working buttons, filters, tables, modals, and workflows

UI improvement must be done around the working application, not by replacing the application.

### 2. Do Not Redesign the Business Process
The purpose is visual and experience improvement, not process redesign.

Keep the existing user journey intact:

```text
Login → Dashboard → Select Module → View / Add / Edit → Validate → Submit / Approve → Review Output
```

Only improve clarity, layout, hierarchy, usability, and presentation.

### 3. Do Not Create a Flashy Consumer App
This is an enterprise incentive management system. Avoid styles that look playful, trendy, or experimental.

Avoid:

- Neon colors
- Overused AI gradients
- Excessive glassmorphism
- Random illustrations
- Cartoon icons
- Oversized shadows
- Unnecessary animations
- Decorative elements that do not support business use

The design should feel calm, confident, accurate, and executive-ready.

---

## Design Direction

### Desired Look and Feel
The FSI website should feel like a modern enterprise platform used by Finance, Sales Operations, HR, and Sales leadership.

The design should communicate:

- Trust
- Accuracy
- Control
- Audit readiness
- Professionalism
- Operational clarity
- Executive polish

A good reference style is a blend of enterprise SaaS, compensation management, financial operations, and modern admin dashboard design.

---

## Visual Design Standards

### Color Palette
Use a restrained enterprise palette.

Recommended base palette:

```css
:root {
  --fsi-bg: #F6F8FB;
  --fsi-surface: #FFFFFF;
  --fsi-surface-soft: #F9FAFC;
  --fsi-border: #D9E1EC;
  --fsi-border-soft: #E7ECF3;

  --fsi-text-primary: #172033;
  --fsi-text-secondary: #526173;
  --fsi-text-muted: #7A8797;

  --fsi-primary: #1F5EFF;
  --fsi-primary-dark: #1647C7;
  --fsi-primary-soft: #EAF0FF;

  --fsi-success: #168A5B;
  --fsi-success-soft: #E9F7F1;

  --fsi-warning: #B7791F;
  --fsi-warning-soft: #FFF5DD;

  --fsi-danger: #C2413A;
  --fsi-danger-soft: #FDECEC;

  --fsi-info: #2563A8;
  --fsi-info-soft: #EAF4FF;
}
```

Usage rules:

- Use white and soft gray backgrounds for readability.
- Use blue as the primary action color.
- Use green only for approved/success states.
- Use amber only for warning/review states.
- Use red only for errors, rejected items, and risk alerts.
- Use color to support meaning, not decoration.

### Typography
Use a professional, readable font stack.

Recommended:

```css
font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
```

Typography scale:

```css
--font-xs: 12px;
--font-sm: 13px;
--font-md: 14px;
--font-lg: 16px;
--font-xl: 20px;
--font-2xl: 24px;
--font-3xl: 30px;
```

Rules:

- Body text should usually be 14px or 15px.
- Table text should not go below 13px.
- Page titles should be clear and confident, usually 24px to 30px.
- Avoid overly thin fonts.
- Use font weight 600 or 700 for headings.
- Use font weight 400 or 500 for body and table values.

### Spacing
Use consistent spacing to make screens feel intentional.

Recommended spacing system:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
```

Rules:

- Use generous spacing around page sections.
- Avoid crowded forms.
- Group related fields into cards or panels.
- Maintain consistent left alignment.
- Use whitespace to guide the eye.

### Radius, Borders, and Shadows
Use subtle enterprise styling.

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;

--shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
--shadow-md: 0 8px 24px rgba(16, 24, 40, 0.08);
```

Rules:

- Use soft borders more than heavy shadows.
- Cards should feel clean and structured.
- Avoid deep shadows and floating visual effects.
- Tables should use borders and row separation for clarity.

---

## Layout Standards

### Global App Shell
The application should use a stable enterprise layout:

```text
Top Header
- Product name
- Current user / role
- Environment label, if needed
- Notifications / help / profile

Left Navigation
- Dashboard
- Sellers
- Roles
- Assignments
- Split Validation
- Approvals
- Credit Preview
- Audit Trail
- Settings / Future Integrations

Main Content Area
- Page title
- Short description
- Primary action button
- Filters or summary cards
- Main table/form/content
```

Rules:

- Navigation should be predictable.
- The active menu item must be clearly highlighted.
- Page titles should explain the task.
- Each page should have one obvious primary action.

### Page Header Pattern
Every major screen should begin with:

```text
Page Title
One-line explanation
Primary action button
Optional status or last updated indicator
```

Example:

```text
Sales Assignments
Manage which sellers receive credit for each customer and product group.
[Create Assignment]
```

---

## Screen-Level UI/UX Guidance

### 1. Dashboard
Purpose: Give users a clear summary of what needs attention.

Recommended sections:

- Total active assignments
- Assignments pending approval
- Split validation issues
- Effective dates expiring soon
- Sellers without assignments
- Recent assignment changes
- Mock credit preview summary

Design guidance:

- Use KPI cards at the top.
- Use status colors carefully.
- Keep charts simple and meaningful.
- Avoid decorative dashboards that do not help the user act.

### 2. Seller Profile Screen
Purpose: Manage sellers, employee type, role, and assignment readiness.

Important fields:

- Seller ID
- Seller name
- Employee type: Workday Employee / Local Hire / Non-Employee
- Full-time employee: Yes / No
- Role
- Manager
- Active status
- Effective start date
- Effective end date

UX guidance:

- Use a clean table with filters.
- Use badges for employee type and status.
- Use a drawer or side panel for details instead of sending users to too many pages.
- Show assignment count for each seller.

### 3. Role Configuration Screen
Purpose: Allow configurable seller roles without hardcoding.

Important fields:

- Role name
- Role category: Direct / Overlay / LPS / Manager Roll-Up / Other
- Assignment behavior: Split / Additive / Roll-Up
- Eligible for incentive: Yes / No
- Active status

UX guidance:

- Explain role behavior in plain language.
- Use short helper text near complex fields.
- Show examples for split, additive, and roll-up roles.

### 4. Customer + Product Assignment Screen
Purpose: Assign credit at customer + product group level.

Important fields:

- Customer / sales parent
- Product group / industry group
- Seller
- Seller role
- Allocation percentage
- Effective start date
- Effective end date
- Assignment status

UX guidance:

- Use a table-first layout.
- Provide filters for customer, product group, seller, role, status, and effective date.
- Use inline validation for percentage allocation.
- Show overlapping or conflicting assignments clearly.
- Provide a clear Create Assignment button.

### 5. Split Validation Screen
Purpose: Show whether allocations are valid.

Validation examples:

- Direct seller split must total 100%.
- LPS split must not exceed 100%.
- Overlay seller can be additive.
- Assignment dates should not overlap incorrectly.
- Inactive sellers should not receive active assignments.

UX guidance:

- Show validation results in a simple table.
- Use clear statuses: Valid, Warning, Error.
- Include a reason column explaining the issue.
- Provide a direct action to fix the problem.

### 6. Approval Workflow Screen
Purpose: Replace email-based approval with visible workflow status.

Statuses:

```text
Draft → Submitted → Manager Review → Approved → Active
Draft → Submitted → Manager Review → Rejected
```

UX guidance:

- Use a stepper or timeline for status.
- Show approver name, date, and comments.
- Keep approve/reject buttons clear.
- Do not hide rejection reasons.
- Show who made the latest change.

### 7. Credit Preview Screen
Purpose: Show how assignment rules will affect invoice credit calculation using mock data.

Recommended preview fields:

- Invoice ID
- Invoice date
- Customer
- Product group
- Invoice quantity
- Unit
- Invoice amount
- Seller
- Allocation percentage
- Credited quantity
- Credited dollars

UX guidance:

- Make it clear this is a POC mock preview.
- Show the calculation in simple terms.
- Example: `100 tons × 20% = 20 credited tons`.
- Keep this screen educational and confidence-building.

### 8. Audit Trail Screen
Purpose: Show traceability of changes.

Important fields:

- Action type
- Record changed
- Previous value
- New value
- Changed by
- Changed date/time
- Comment / reason

UX guidance:

- Use filters for action type, user, date, and module.
- Keep audit logs readable.
- Use expandable rows for detailed changes.

### 9. Future Integration Placeholder Screen
Purpose: Show that the POC is built for future data connections without actually connecting to live systems.

Suggested integrations:

- Workday: seller and employee data
- SAP/JDE/SAC: customer, product, and sales transaction data
- Salesforce: assignment visibility
- Power BI: reporting layer
- Workday Payroll: future payment output

UX guidance:

- Clearly mark as Future Integration.
- Show connection status as Mock / Not Connected.
- Show the expected data type from each source.
- Avoid pretending real integrations exist.

---

## Component Design Standards

### Buttons
Button hierarchy:

- Primary: main action, such as Create Assignment or Submit for Approval
- Secondary: supporting action, such as Export or View Details
- Tertiary: low-emphasis action, such as Cancel or Clear Filters
- Danger: destructive actions only

Rules:

- Do not use too many primary buttons on one screen.
- Button labels should be action-oriented.
- Avoid vague labels like Submit when a clearer label is possible.

Good examples:

```text
Create Assignment
Submit for Approval
Approve Assignment
Reject Assignment
Run Validation
Preview Credit
```

### Tables
Tables are central to this product. They must be clean, readable, and powerful.

Table standards:

- Sticky header for long tables
- Clear column labels
- Sortable key columns
- Filters above the table
- Row hover state
- Status badges
- Empty state message
- Pagination or virtual scrolling for large lists
- Export option where useful

Do not overload tables with too many columns. Use a details drawer for secondary information.

### Forms
Form standards:

- Group fields by meaning.
- Use clear labels.
- Use helper text for business terms.
- Show validation errors beside the field.
- Mark required fields clearly.
- Use dropdowns for controlled values.
- Use date pickers for effective dates.

### Cards
Cards should be used for summary and grouped content.

Card standards:

- Clear title
- One purpose per card
- Minimal decoration
- Useful content only
- Consistent spacing

### Badges
Use badges for status and classification.

Examples:

```text
Active
Draft
Pending Review
Approved
Rejected
Expired
Direct Seller
Overlay
LPS
Local Hire
Mock Data
Future Integration
```

### Empty States
Every empty screen should explain what to do next.

Example:

```text
No assignments found.
Create a customer + product group assignment to define seller credit allocation.
[Create Assignment]
```

### Error States
Errors must be human-readable.

Poor error:

```text
Validation failed.
```

Better error:

```text
Direct seller allocation must total 100% for this customer and product group.
Current total is 85%.
```

---

## UX Writing Rules

Use simple business language.

Avoid technical terms unless required.

Use:

```text
Assignment
Seller
Customer
Product Group
Allocation %
Effective Date
Approval Status
Credit Preview
```

Avoid unnecessary jargon like:

```text
Entity relationship orchestration
Dynamic attribution abstraction
Algorithmic allocation interface
```

The product should feel professional and easy to understand.

---

## Interaction Rules

### Search and Filter
Data-heavy pages should have filters.

Recommended filters:

- Customer
- Product group
- Seller
- Role
- Status
- Effective date
- Validation status

### Detail Drawer
Use side drawers for record details where possible.

Drawer sections:

- Summary
- Assignment details
- Validation results
- Approval history
- Audit history

This helps users stay in context.

### Confirmation Dialogs
Use confirmation dialogs only for important actions:

- Delete assignment
- Submit for approval
- Approve assignment
- Reject assignment
- Expire assignment

### Inline Validation
Validate fields as the user works, especially:

- Allocation percentage
- Effective date range
- Required seller
- Required customer
- Required product group
- Duplicate or overlapping assignment

---

## Accessibility Standards

The UI should be accessible and usable by enterprise users.

Minimum requirements:

- Maintain strong color contrast.
- Do not rely on color alone to communicate meaning.
- Use visible focus states.
- Support keyboard navigation.
- Use semantic HTML where possible.
- Add accessible labels to form fields.
- Keep clickable targets large enough.
- Ensure tables are readable on different screen sizes.

Target WCAG level: WCAG 2.1 AA where practical.

---

## Responsive Design Rules

The primary experience should be desktop-first because this is an enterprise admin product.

However, it should still work on tablets and smaller screens.

Rules:

- Do not crush complex tables into unreadable mobile layouts.
- Use horizontal scroll for wide enterprise tables when needed.
- Stack form sections on smaller screens.
- Keep primary actions visible.
- Avoid hiding critical workflow information.

---

## Implementation Approach for Existing Website

Follow this sequence.

### Step 1: Audit the Existing App
Before making changes, inspect:

- Current routes
- Current components
- Current styles
- Current forms
- Current tables
- Current state management
- Current API calls
- Current validation logic
- Current working user flows

Create a short list of what must not change.

### Step 2: Add Design Tokens
Introduce design tokens first:

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Status colors

Use CSS variables, theme config, or design system constants depending on the stack.

### Step 3: Upgrade Layout
Improve:

- App shell
- Sidebar
- Header
- Page titles
- Content spacing
- Card structure

Do not change routes or workflow.

### Step 4: Upgrade Reusable Components
Improve existing components before creating new ones.

Priority components:

- Button
- Input
- Select
- Date picker
- Table
- Badge
- Card
- Modal
- Drawer
- Toast notification
- Empty state
- Error message

### Step 5: Improve Screens One by One
Recommended order:

```text
1. App shell and navigation
2. Dashboard
3. Seller Profile
4. Role Configuration
5. Assignment Management
6. Split Validation
7. Approval Workflow
8. Credit Preview
9. Audit Trail
10. Future Integration Placeholder
```

### Step 6: Preserve Functionality
After each screen update, test the existing flow before moving to the next screen.

Do not wait until the end to test.

### Step 7: Final Polish
Check:

- Alignment
- Button hierarchy
- Table readability
- Form clarity
- Empty states
- Error states
- Loading states
- Responsive behavior
- Accessibility
- Visual consistency

---

## AI Agent Instructions

When using this skill with an AI coding agent, give the agent this instruction:

```text
You are improving the UI/UX of an existing Feed Sales Incentive website. Do not rebuild the app from scratch. Do not break routes, APIs, state management, validation logic, or working components.

Your task is to make the existing application look like a professional enterprise SaaS product. Improve layout, spacing, typography, colors, tables, forms, navigation, status badges, empty states, loading states, and error messages.

Before coding, inspect the current app structure and identify reusable components. Create or improve design tokens first. Then upgrade shared components. Then improve screens one by one while preserving the existing user flow.

Use a clean enterprise design style: professional, calm, readable, audit-friendly, and data-focused. Avoid flashy AI-generated visuals, neon gradients, cartoon icons, or unnecessary animations.

After each change, verify that the existing workflow still works.
```

---

## Design QA Checklist

Use this checklist before considering the UI/UX upgrade complete.

### Visual Quality
- [ ] The application feels enterprise-grade.
- [ ] The product does not look AI-generated.
- [ ] Colors are professional and consistent.
- [ ] Fonts are readable and consistent.
- [ ] Spacing is clean and intentional.
- [ ] Cards, tables, forms, and buttons follow one design system.

### Flow Safety
- [ ] Existing routes still work.
- [ ] Existing buttons still perform the same actions.
- [ ] Existing form submissions still work.
- [ ] Existing validations still work.
- [ ] Existing filters and search still work.
- [ ] Existing approval flow still works.

### Data UX
- [ ] Tables are readable.
- [ ] Important statuses are visible.
- [ ] Filters are easy to use.
- [ ] Error messages explain the issue clearly.
- [ ] Empty states tell users what to do next.
- [ ] Audit-related information is easy to find.

### Accessibility
- [ ] Text contrast is readable.
- [ ] Focus states are visible.
- [ ] Forms have labels.
- [ ] Interactive elements are keyboard accessible.
- [ ] Status is not communicated by color alone.

### Enterprise Readiness
- [ ] The UI supports admin-heavy workflows.
- [ ] The UI supports seller and manager visibility.
- [ ] The UI supports future integrations without pretending they are active.
- [ ] The design can scale to more modules later.

---

## Definition of Done

The UI/UX improvement is complete when:

```text
1. The existing app flow is preserved.
2. No working feature is broken.
3. The application looks professional and enterprise-ready.
4. Screens are consistent in layout, color, typography, and spacing.
5. Tables and forms are easier to use.
6. Validation and status messages are clearer.
7. The product feels ready for a client-facing POC demo.
```

---

## Final Design Principle
Build the interface as if a Sales Compensation Admin, Finance user, Sales Manager, and Executive will all see it in the same client demo.

The experience should be simple, polished, trustworthy, and operationally clear.

---

## Required Agent Output After Each UI/UX Update

After every implementation slice, report:

1. Files changed
2. Screens or components improved
3. Existing functionality preserved
4. Manual test steps completed
5. Visual/UX improvements made
6. Accessibility checks completed
7. Known limitations or follow-up items

Do not mark the UI/UX upgrade complete until the design QA checklist and flow safety checklist pass.
