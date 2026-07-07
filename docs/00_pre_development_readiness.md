# Pre-Development Readiness

Source PRD: `FSI_Sales_Attribution_POC_PRD_v2.docx`

## Builder Readiness Checklist

| Item | Status | Notes |
|---|---|---|
| Product idea is written in one sentence | Complete | Build a POC that manages sales attribution assignments at customer plus product group level using mock/manual/CSV data. |
| Target user is clear | Complete | Primary users are Sales Compensation Admins and Sales Managers/Supervisors. |
| Core problem is clear | Complete | Assignment data, approvals, corrections, and auditability are spread across tools, spreadsheets, and email. |
| First useful version is defined | Complete | POC with seller setup, role configuration, assignment workbench, validation, approval, audit/history, invoice credit calculation, monthly interim payments, export-ready CSV, and printable account assignment statements. |
| Out-of-scope items are listed | Complete | Live Workday, SAP/JDE/SAC, Salesforce, Power BI, payroll, full compensation engine, year-end true-up, accruals, and LPS billing automation. |
| Initial success measure is defined | Complete | Client can understand and validate the assignment foundation through the demo storyline and acceptance criteria. |

## Opportunity Validation Note

| Area | Assessment |
|---|---|
| Target user | Sales Compensation Admins, Sales Managers/Supervisors, and later Sellers, Finance, Accounting, and IT/System Admin users. |
| Pain severity | High. Incorrect or unclear assignments can affect incentive calculations, payroll review, auditability, and seller trust. |
| Current workaround | FSI, JDE/XE, Power BI, Workday, SharePoint, spreadsheets, and email-based approvals/corrections. |
| Alternatives | Continue spreadsheet/email workflow, extend existing reporting tools, or wait for a full enterprise implementation. These alternatives do not prove the assignment foundation quickly. |
| Willingness to pay | Likely moderate to high after POC validation because the workflow affects incentive accuracy and operational effort. Final commercial validation remains a client question. |
| Adoption risk | Medium. Users may resist a new workflow if the UI is not simple or if future integrations are unclear. |
| Build / no-build recommendation | Build POC. Keep it small, demo-friendly, and future-ready. Do not build production integrations or full compensation logic in this phase. |

## Product Readiness Level

Current target: Level 2, MVP-style POC.

The immediate goal is demo-ready POC validation, not enterprise production readiness. The POC now proves the core workflow and data model in Azure App Service while preserving a path to Pilot and Production after client approval.

## Required Pre-Code Documents

| No. | Document | Status |
|---|---|---|
| 01 | PRD - Product Requirements Document | Created from source PRD |
| 02 | TRD - Technical Requirements Document | Created |
| 03 | App Flow | Created |
| 04 | UI/UX Design Brief | Created |
| 05 | Backend Schema | Created |
| 06 | Implementation Plan | Created |

Development should not begin until these documents are reviewed and accepted as the source of truth.
