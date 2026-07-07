# Monitoring Plan - Feed Sales Incentive POC

## POC Monitoring

| Signal | Purpose | Suggested Check |
|---|---|---|
| App availability | Confirm hosted demo is reachable | Open `https://fsi-sales-poc-89089.azurewebsites.net` after deployment |
| Build status | Confirm deployable artifact is healthy | `npm run build` |
| Quality gates | Prevent demo regressions | lint, typecheck, unit tests, smoke tests |
| Seed data readiness | Confirm demo storyline has enough data | `npm run test:smoke` |
| Assignment validation errors | Watch demo data quality | Split Validator and smoke test output |
| Approval queue aging | Identify submitted assignments waiting for manager review | Dashboard and Approvals screen |
| Invoice credit no-match cases | Catch missing assignment coverage | Invoice Credit Calculation empty states |
| Payment value generation | Confirm monthly interim values are produced | Payments metrics and smoke test |
| Export usage | Confirm output workflows are available | Export Center CSV and Account Assignment Statement |

## Production-Future Monitoring

- Add a health endpoint for uptime checks.
- Add Azure Application Insights for server action exceptions and route performance.
- Track database connectivity and query failures.
- Track validation error volume by rule code.
- Track approval cycle time.
- Track invoice credit calculation no-match frequency.
- Track payment run totals by month.
- Track export generation failures.
- Add dependency and secret scanning to CI.

## Review Cadence

- POC demo: verify manually before each client session.
- Pilot: review weekly metrics and error logs.
- Production: configure alerts for availability, error rate, failed payment runs, and integration failures.

