# Deployment Plan - Feed Sales Incentive POC

## Current Hosted Demo

| Item | Value |
|---|---|
| Platform | Azure App Service |
| Resource group | `rg-fsi-poc` |
| App Service plan | `asp-fsi-poc-free` |
| Web app | `fsi-sales-poc-89089` |
| URL | `https://fsi-sales-poc-89089.azurewebsites.net` |

## Deployment Shape

- Next.js App Router application built with `output: "standalone"`.
- Prisma Client generated during build.
- SQLite demo database bundled for POC persistence.
- Static assets copied from `.next/static`.
- Deployment package uploaded to Azure App Service as a zip package.

## Required Environment Variables

Variable names only:

```text
DATABASE_URL
NEXT_PUBLIC_APP_NAME
AUTH_SECRET
```

Do not commit real secret values.

## Build And Verification

Run before deployment:

```text
npm run lint
npm run typecheck
npm test
npm run test:smoke
npm run build
```

## Deployment Steps

1. Build the app with `npm run build`.
2. Create a standalone deployment folder from `.next/standalone`.
3. Copy `.next/static` into `.next/standalone/.next/static`.
4. Copy `prisma/dev.db` into the standalone package for the hosted demo.
5. Zip the standalone package.
6. Deploy with Azure CLI:

```text
az webapp deploy --resource-group rg-fsi-poc --name fsi-sales-poc-89089 --src-path fsi-azure-standalone.zip --type zip --clean true
```

## POC Limitations

- SQLite is acceptable for demo only.
- App Service filesystem persistence is not a production database strategy.
- Future pilot/production should move to managed PostgreSQL or another approved relational database.
- Demo role switching is not production authentication.
- Live Workday, SAP/JDE/SAC, Salesforce, Power BI, payroll, banking, and accounting integrations are out of scope.

## Rollback Plan

- Keep the previous Git commit available on `main`.
- Rebuild and redeploy the previous commit if a demo-blocking issue is found.
- Preserve the last working deployment zip until the new deployment is verified.

