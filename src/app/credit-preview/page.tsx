import Link from "next/link";
import { createMockInvoice, deleteMockInvoice } from "@/app/actions/credit-preview";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Field, inputClassName, selectClassName, SubmitButton } from "@/components/ui/setup-form";
import { SortLink } from "@/components/ui/sort-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listCustomersAndProductGroups } from "@/lib/data/customers-products";
import { getCreditPreview, listMockInvoices } from "@/lib/data/credit-preview";
import { quantityUnitOptions } from "@/lib/setup-options";
import { sortDirection, sortRows, type SortParams } from "@/lib/table-sort";

function formatNumber(value: number | null, unit?: string) {
  if (value == null) {
    return "Not calculated";
  }

  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value);

  return unit ? `${formatted} ${unit}` : formatted;
}

function formatCurrency(value: number | null) {
  if (value == null) {
    return "Not calculated";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function invoiceCalculationStatus(isSelected: boolean, hasCreditedRows: boolean) {
  if (isSelected && hasCreditedRows) {
    return "Calculated";
  }

  if (isSelected) {
    return "No Matching Assignment";
  }

  return "Ready For Calculation";
}

export default async function CreditPreviewPage({
  searchParams
}: {
  searchParams: Promise<{ invoiceId?: string } & SortParams>;
}) {
  const [allowed, session] = await Promise.all([can("creditPreview:view"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Credit Calculation Is Not Available For This Role"
        description={`${session.label} cannot access credit calculation in this role configuration.`}
      />
    );
  }

  const params = await searchParams;
  const [invoices, preview, setupData, canCreateInvoices] = await Promise.all([
    listMockInvoices(),
    getCreditPreview(params.invoiceId),
    listCustomersAndProductGroups(),
    can("customersProducts:manage")
  ]);
  const activeCustomers = setupData.customers.filter((customer) => customer.active);
  const activeProductGroups = setupData.productGroups.filter((productGroup) => productGroup.active);
  const selectedInvoiceId = preview.invoice?.id;
  const direction = sortDirection(params.dir);
  const sortedInvoices = sortRows(invoices, direction, (invoice) => {
    switch (params.sort) {
      case "invoiceCustomer":
        return invoice.customer.name;
      case "invoiceProduct":
        return invoice.productGroup.name;
      case "invoiceQuantity":
        return Number(invoice.quantity);
      case "invoiceAmount":
        return Number(invoice.amount);
      case "invoiceStatus":
        return invoice.id === selectedInvoiceId;
      case "invoice":
      default:
        return invoice.invoiceNumber;
    }
  });
  const sortedPreviewRows = sortRows(preview.rows, direction, (row) => {
    switch (params.sort) {
      case "creditSeller":
        return row.seller.name;
      case "creditRole":
        return row.role.name;
      case "creditAllocation":
        return row.allocation;
      case "creditQuantity":
        return row.creditedQuantity;
      case "creditAmount":
        return row.creditedAmount;
      case "creditAssignment":
      default:
        return row.assignment.assignmentNumber;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Credit Calculation"
        title="Invoice Credit Calculation"
        description="Calculate seller credit from invoice transactions using approved assignment rules. In production, invoice transactions will come from ERP or billing feeds; this POC allows manual transaction entry for demo data."
      />

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_auto]" action="/credit-preview">
          <label className="grid gap-2 text-sm font-medium">
            Invoice Transaction
            <select name="invoiceId" defaultValue={preview.invoice?.id} className="h-10 rounded-md border border-border bg-white px-3 text-sm">
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} / {invoice.customer.name} / {invoice.productGroup.name}
                </option>
              ))}
            </select>
          </label>
          <button className="h-10 self-end rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Calculate Credit
          </button>
        </form>
      </Card>

      {canCreateInvoices ? (
        <Card className="p-4">
          <div>
            <h2 className="text-base font-semibold">Add Invoice Transaction</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter invoice amount and quantity for POC data entry. Approved assignment rules determine how these invoice values are allocated to sellers.
            </p>
          </div>
          <form action={createMockInvoice} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Invoice Number">
              <input name="invoiceNumber" required className={inputClassName} placeholder="INV-2026-005" />
            </Field>
            <Field label="Customer">
              <select name="customerId" required className={selectClassName}>
                {activeCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Product Group">
              <select name="productGroupId" required className={selectClassName}>
                {activeProductGroups.map((productGroup) => (
                  <option key={productGroup.id} value={productGroup.id}>
                    {productGroup.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Invoice Date">
              <input name="invoiceDate" required type="date" className={inputClassName} defaultValue="2026-07-01" />
            </Field>
            <Field label="Quantity">
              <input name="quantity" required type="number" min="0" step="0.01" className={inputClassName} placeholder="100" />
            </Field>
            <Field label="Unit">
              <select name="quantityUnit" required className={selectClassName} defaultValue="tons">
                {quantityUnitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Amount">
              <input name="amount" required type="number" min="0" step="0.01" className={inputClassName} placeholder="10000" />
            </Field>
            <div className="flex items-end">
              <SubmitButton>Create Transaction</SubmitButton>
            </div>
          </form>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Invoice Transactions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Invoice transactions are the source values for credit calculation. Calculation state shows whether the selected transaction produced seller credit rows.
          </p>
        </div>
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium"><SortLink label="Invoice" sortKey="invoice" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Customer" sortKey="invoiceCustomer" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Product" sortKey="invoiceProduct" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Quantity" sortKey="invoiceQuantity" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Amount" sortKey="invoiceAmount" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Calculation State" sortKey="invoiceStatus" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {sortedInvoices.map((invoice) => {
                  const isSelected = invoice.id === selectedInvoiceId;
                  return (
                    <tr key={invoice.id}>
                      <td className="px-4 py-3 font-medium">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-3">{invoice.customer.name}</td>
                      <td className="px-4 py-3">
                        <p>{invoice.productGroup.name}</p>
                        <p className="text-xs text-muted-foreground">{invoice.productGroup.metricType.toLowerCase()}</p>
                      </td>
                      <td className="px-4 py-3">{formatNumber(Number(invoice.quantity), invoice.quantityUnit)}</td>
                      <td className="px-4 py-3">{formatCurrency(Number(invoice.amount))}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={invoiceCalculationStatus(isSelected, preview.rows.length > 0)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/credit-preview?invoiceId=${invoice.id}`} className="inline-flex h-9 items-center rounded-md border border-border bg-white px-3 text-xs font-semibold">
                            Calculate
                          </Link>
                          {canCreateInvoices ? (
                            <>
                              <Link href={`/credit-preview/invoices/${invoice.id}/edit`} className="inline-flex h-9 items-center rounded-md border border-border bg-white px-3 text-xs font-semibold">
                                Edit
                              </Link>
                              <form action={deleteMockInvoice}>
                                <input type="hidden" name="id" value={invoice.id} />
                                <button className="h-9 rounded-md border border-border bg-white px-3 text-xs font-semibold">
                                  Delete
                                </button>
                              </form>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold">No Invoice Transactions Yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create an invoice transaction to calculate credited amount and quantity.</p>
          </div>
        )}
      </Card>

      {preview.invoice ? (
        <Card className="p-4">
          <div className="mb-4 rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Calculation source:</span> the selected invoice transaction supplies amount and quantity. Approved assignment rules supply seller, role, and allocation percentage.
          </div>
          <div className="grid gap-3 text-sm md:grid-cols-5">
            <div>
              <p className="text-muted-foreground">Invoice</p>
              <p className="font-semibold">{preview.invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-semibold">{preview.invoice.customer.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Product Group</p>
              <p className="font-semibold">{preview.invoice.productGroup.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Quantity</p>
              <p className="font-semibold">{formatNumber(Number(preview.invoice.quantity), preview.invoice.quantityUnit)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-semibold">{formatCurrency(Number(preview.invoice.amount))}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Calculated Seller Credit</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These rows are generated from approved or active credit-eligible assignments that match the invoice customer, product group, and invoice date.
          </p>
        </div>
        {preview.rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium"><SortLink label="Assignment" sortKey="creditAssignment" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Seller" sortKey="creditSeller" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Role" sortKey="creditRole" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Allocation" sortKey="creditAllocation" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Credited Quantity" sortKey="creditQuantity" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Credited Amount" sortKey="creditAmount" currentSort={params.sort} currentDir={direction} query={params} /></th>
                  <th className="px-4 py-3 font-medium">Calculation State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {sortedPreviewRows.map((row) => (
                  <tr key={row.assignment.id}>
                    <td className="px-4 py-3 font-medium">{row.assignment.assignmentNumber}</td>
                    <td className="px-4 py-3">{row.seller.name}</td>
                    <td className="px-4 py-3">{row.role.name}</td>
                    <td className="px-4 py-3">{row.allocation}%</td>
                    <td className="px-4 py-3">{formatNumber(row.creditedQuantity, preview.invoice?.quantityUnit)}</td>
                    <td className="px-4 py-3">{formatCurrency(row.creditedAmount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status="Calculated" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold">No Matching Assignment Rules</h2>
            <p className="mt-2 text-sm text-muted-foreground">No approved or active credit-eligible assignment rules match this invoice customer, product group, and invoice date. Create or approve a matching assignment, or edit the transaction customer/product/date.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
