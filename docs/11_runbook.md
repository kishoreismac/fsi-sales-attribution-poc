# Runbook - Feed Sales Incentive POC

## Run Locally

```text
npm install
npm run db:generate
npm run db:seed
npm run dev
```

Open the local URL printed by Next.js.

## Reset Demo Data

```text
npm run db:seed
```

## Quality Gates

```text
npm run lint
npm run typecheck
npm test
npm run test:smoke
npm run build
```

## Demo Role Switching

Use the Demo Role control in the left sidebar. The selected role controls visible navigation and server-authorized actions.

## Assignment Amount And Quantity Rule

Assignments store:

- Customer.
- Product group.
- Seller.
- Role.
- Allocation percent.
- Effective dates.

Invoice transactions store:

- Quantity.
- Unit.
- Amount.
- Invoice date.

Invoice Credit Calculation combines both sides to calculate credited quantity or credited amount.

## Troubleshoot No Matching Credit Calculation Rows

Check:

- Invoice customer and product group match an assignment.
- Assignment is approved or active.
- Assignment is effective on the invoice date.
- Role is eligible for credit.
- Seller, customer, product group, and role are active for the selected dates.

## Troubleshoot Payment Values

Check:

- Payment month includes invoice transactions.
- Invoice transactions have matching active approved credit-eligible assignments.
- Interim rate is greater than zero.
- Invoice amount is greater than zero.

## Deploy To Azure

Use the deployment steps in `docs/09_deployment_plan.md`.

Hosted demo URL:

```text
https://fsi-sales-poc-89089.azurewebsites.net
```

## Roll Back

1. Check out the last known good Git commit.
2. Run the quality gates.
3. Rebuild the standalone zip.
4. Redeploy to the same Azure App Service.

