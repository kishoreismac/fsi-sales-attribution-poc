# TRD - Feed Sales Incentive POC

## Technical Goal

Build a POC application that demonstrates the sales attribution workflow with mock/manual/CSV-style data and a future-ready data model. The app runs locally and is deployed to Azure App Service for demos. No live enterprise integrations are allowed in the POC.

## Frontend Framework And UI Stack

Recommended stack for initial scaffold:

- Next.js with TypeScript.
- React for UI.
- Tailwind CSS for styling.
- shadcn/ui or a small local component system for tables, forms, dialogs, alerts, toasts, and status badges.
- lucide-react for icons.

Reasoning: This stack supports fast POC development, typed models, app routing, API routes/server actions, and a path to production without forcing a backend rewrite.

## Backend Runtime And API Approach

- Next.js server runtime for POC APIs and server-side validation.
- API endpoints or server actions grouped by domain: sellers, roles, customers, product groups, assignments, approvals, audit, invoice transactions, credit calculation, payments, and exports.
- Business validation must live on the server, not only the client.

## Database Type And Provider

POC recommendation:

- SQLite for local demo persistence.
- Prisma ORM for schema, migrations, seed data, and future migration path.

Future production options:

- PostgreSQL on Azure, Supabase, Neon, or another approved provider.

## Authentication Provider And Login Methods

POC:

- Local mock roles or simple credential-free role switcher may be used only for demo if clearly labeled.
- Protected route and authorization patterns should still be present.

Future:

- Microsoft Entra ID or another approved enterprise identity provider.
- Role-based authorization enforced server-side.

## Hosting / Deployment Platform

POC:

- Local development server.
- Azure App Service for hosted demo deployment.

Future:

- Azure App Service, Azure Container Apps, or Vercel depending on client constraints.
- Production hosting decision remains open until client approval.

## Third-Party APIs

None for POC.

Future integration contracts should reserve fields for:

- Workday: employee, role, manager, hire/termination, payroll output.
- SAP/JDE/SAC/Datasphere: customer, product, invoice transaction, quantity, revenue, credits.
- Salesforce: account visibility and seller-to-customer ownership.
- Power BI: reporting-ready tables and assignment outputs.
- Workday Payroll: future payment output after approval.

## Approved Libraries

- next
- react
- react-dom
- typescript
- prisma
- @prisma/client
- tailwindcss
- lucide-react
- zod for validation
- date-fns for date handling
- papaparse or a native parser for CSV import/export if needed

Add no dependencies without clear value.

## Environment Variables

Variable names only:

```text
DATABASE_URL
NEXT_PUBLIC_APP_NAME
AUTH_SECRET
```

Do not store secret values in code or documentation.

## Constraints

- Use mock data only.
- No live Workday, SAP/JDE/SAC, Salesforce, Power BI, or payroll connections.
- No hardcoded business rules where setup tables can hold the rule.
- Effective dates are required for sellers, roles, product groups, customers where applicable, and assignments.
- Audit logging starts from day one.
- User-facing workflows need loading, empty, error, and success states.
- Role-sensitive actions need server-side authorization.
- Keep UI simple and demo-friendly.

## API Contract

| Endpoint | Method | Purpose | Access |
|---|---|---|---|
| `/api/sellers` | GET | List sellers | Admin, Manager read |
| `/api/sellers` | POST | Create seller | Admin |
| `/api/sellers/:id` | PATCH | Update seller | Admin |
| `/api/roles` | GET | List role configurations | Admin, Manager read |
| `/api/roles` | POST | Create role | Admin |
| `/api/customers` | GET | List customers | Admin, Manager read |
| `/api/product-groups` | GET | List product groups | Admin, Manager read |
| `/api/assignments` | GET | List assignments | Admin, Manager |
| `/api/assignments` | POST | Create assignment | Admin |
| `/api/assignments/:id` | PATCH | Edit assignment | Admin |
| `/api/assignments/:id/submit` | POST | Submit assignment | Admin |
| `/api/assignments/:id/approve` | POST | Approve assignment | Manager |
| `/api/assignments/:id/reject` | POST | Reject assignment | Manager |
| `/api/assignments/validate` | POST | Validate assignment group | Admin, Manager |
| `/api/credit-preview` | POST | Calculate invoice credit using POC invoice transactions and active approved assignments | Admin, Manager, Finance |
| `/payments` | GET | Review generated monthly interim payment values | Admin, Manager, Finance |
| `/api/audit-log` | GET | View audit events | Admin |
| `/api/exports/approved-assignments` | GET | Export approved assignments | Admin |
| `/exports/account-assignments` | GET | View printable active account assignment statement | Admin |

## Architecture Notes

- Keep domain logic separate from UI components.
- Put validation rules in reusable server-side modules.
- Keep seed data realistic enough to support the client demo storyline.
- Export data should be derived from approved assignments and stable external IDs.
- Do not overwrite assignment history; close old records and create new ones.
- Assignment records store ownership percentages only. Invoice transaction records store quantity, unit, amount, and invoice date.
- Lifecycle labels are date-aware: an approved assignment whose start date is today or earlier and whose end date is open/future is active for crediting.
- Azure App Service deployment uses the Next.js standalone output plus bundled Prisma SQLite demo database for the POC.
