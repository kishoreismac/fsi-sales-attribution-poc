import { Fragment } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PrintButton } from "@/components/ui/print-button";
import { can, getDemoSession } from "@/lib/auth/session";
import { listActiveAccountAssignmentStatementRows } from "@/lib/data/exports";
import { formatDate } from "@/lib/setup-options";

type StatementRow = Awaited<ReturnType<typeof listActiveAccountAssignmentStatementRows>>[number];

function brandLabel(productGroupName: string) {
  const normalized = productGroupName.toLowerCase();

  if (normalized.includes("land o lakes")) {
    return "LAND O LAKES";
  }

  if (normalized.includes("purina")) {
    return "Purina";
  }

  return "All";
}

function groupStatementRows(rows: StatementRow[]) {
  const customerGroups = new Map<string, { customer: StatementRow["customer"]; rows: StatementRow[] }>();

  for (const row of rows) {
    const existing = customerGroups.get(row.customerId);

    if (existing) {
      existing.rows.push(row);
    } else {
      customerGroups.set(row.customerId, { customer: row.customer, rows: [row] });
    }
  }

  return Array.from(customerGroups.values()).map((customerGroup) => {
    const productGroups = new Map<string, { productGroup: StatementRow["productGroup"]; rows: StatementRow[] }>();

    for (const row of customerGroup.rows) {
      const existing = productGroups.get(row.productGroupId);

      if (existing) {
        existing.rows.push(row);
      } else {
        productGroups.set(row.productGroupId, { productGroup: row.productGroup, rows: [row] });
      }
    }

    return {
      ...customerGroup,
      productGroups: Array.from(productGroups.values())
    };
  });
}

export default async function AccountAssignmentsStatementPage() {
  const [allowed, session, rows] = await Promise.all([
    can("exports:approvedAssignments"),
    getDemoSession(),
    listActiveAccountAssignmentStatementRows()
  ]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Account Assignment Statement Is Admin-Only"
        description={`${session.label} can view allowed reporting areas, but account assignment statements are limited to Sales Compensation Admins in this POC.`}
      />
    );
  }

  const customerGroups = groupStatementRows(rows);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Output"
        title="Account Assignment Statement"
        description="Printable active credit assignment report by account, product group, seller, manager, effective date, and allocation percent."
        actions={
          <div className="flex flex-wrap gap-2 no-print">
            <a
              href="/exports"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back To Exports
            </a>
            <PrintButton />
          </div>
        }
      />

      <Card className="print-surface overflow-hidden p-5">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-md border border-border bg-muted px-4 py-3 text-center">
            <h2 className="text-xl font-semibold text-foreground">Account Assignments (Active)</h2>
          </div>

          <div className="mt-6 space-y-8">
            {customerGroups.length === 0 ? (
              <div className="rounded-md border border-dashed border-border bg-surface-soft p-8 text-center text-sm text-muted-foreground">
                No active credit assignments are available for this statement.
              </div>
            ) : null}

            {customerGroups.map((customerGroup) => (
              <section key={customerGroup.customer.id} className="break-inside-avoid">
                <div className="rounded-t-md border border-border bg-surface-soft px-3 py-3">
                  <div className="grid gap-2 text-sm md:grid-cols-[1fr_2fr_1fr]">
                    <div>
                      <span className="text-muted-foreground">Account</span>
                      <div className="font-semibold text-foreground">{customerGroup.customer.customerCode}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Customer</span>
                      <div className="font-semibold text-foreground">{customerGroup.customer.name}</div>
                    </div>
                    <div className="md:text-right">
                      <span className="text-muted-foreground">Sales Parent</span>
                      <div className="font-semibold text-foreground">{customerGroup.customer.salesParent}</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-b-md border-x border-b border-border">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead>
                    <tr className="bg-muted text-muted-foreground">
                      <th className="px-2 py-1.5 font-semibold">Industry Group</th>
                      <th className="px-2 py-1.5 font-semibold">Seller ID</th>
                      <th className="px-2 py-1.5 font-semibold">Sales Person</th>
                      <th className="px-2 py-1.5 font-semibold">Brand</th>
                      <th className="px-2 py-1.5 font-semibold">Effective Date</th>
                      <th className="px-2 py-1.5 font-semibold">Manager</th>
                      <th className="px-2 py-1.5 text-right font-semibold">Pct</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {customerGroup.productGroups.map((productGroup) => {
                      const totalPercent = productGroup.rows.reduce(
                        (total, row) => total + Number(row.allocationPercent),
                        0
                      );
                      const productBrand = brandLabel(productGroup.productGroup.name);

                      return (
                        <Fragment key={productGroup.productGroup.id}>
                          {productGroup.rows.map((row) => (
                            <tr key={row.id}>
                              <td className="px-2 py-1.5">{row.productGroup.name}</td>
                              <td className="px-2 py-1.5 font-medium">{row.seller.sellerCode}</td>
                              <td className="px-2 py-1.5">{row.seller.name}</td>
                              <td className="px-2 py-1.5">{brandLabel(row.productGroup.name)}</td>
                              <td className="px-2 py-1.5">{formatDate(row.startDate)}</td>
                              <td className="px-2 py-1.5">{row.seller.manager?.name ?? "Not Assigned"}</td>
                              <td className="px-2 py-1.5 text-right">{row.allocationPercent.toString()}</td>
                            </tr>
                          ))}
                          <tr className="bg-surface-soft text-sm font-semibold">
                            <td className="px-2 py-1.5" colSpan={3}>
                              {productGroup.productGroup.name}
                            </td>
                            <td className="px-2 py-1.5" colSpan={3}>
                              {productBrand} Percent: {totalPercent}
                            </td>
                            <td className="px-2 py-1.5 text-right">{totalPercent}</td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </section>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
