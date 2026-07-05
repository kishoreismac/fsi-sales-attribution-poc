import Link from "next/link";
import { createMockInvoice, deleteMockInvoice } from "@/app/actions/credit-preview";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Field, inputClassName, selectClassName, SubmitButton } from "@/components/ui/setup-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listCustomersAndProductGroups } from "@/lib/data/customers-products";
import { getCreditPreview, listMockInvoices } from "@/lib/data/credit-preview";

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

export default async function CreditPreviewPage({
  searchParams
}: {
  searchParams: Promise<{ invoiceId?: string }>;
}) {
  const [allowed, session] = await Promise.all([can("creditPreview:view"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Credit preview is not available for this role"
        description={`${session.label} cannot access credit preview in this POC role configuration.`}
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

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Preview"
        title="Credit preview"
        description="Sample invoice crediting based on approved active assignments and mock invoice data. Invoice quantity, such as tons, and invoice amount are selected here; assignments only provide allocation percentages."
      />

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_auto]" action="/credit-preview">
          <label className="grid gap-2 text-sm font-medium">
            Mock invoice
            <select name="invoiceId" defaultValue={preview.invoice?.id} className="h-10 rounded-md border border-border bg-surface px-3 text-sm">
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} / {invoice.customer.name} / {invoice.productGroup.name}
                </option>
              ))}
            </select>
          </label>
          <button className="h-10 self-end rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:brightness-95">
            Preview
          </button>
        </form>
      </Card>

      {canCreateInvoices ? (
        <Card className="p-4">
          <div>
            <h2 className="text-base font-semibold">Add mock invoice</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the invoice amount and tons/quantity here. Assignment allocation percentages decide how these invoice values are split in the credited output.
            </p>
          </div>
          <form action={createMockInvoice} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Invoice number">
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
            <Field label="Product group">
              <select name="productGroupId" required className={selectClassName}>
                {activeProductGroups.map((productGroup) => (
                  <option key={productGroup.id} value={productGroup.id}>
                    {productGroup.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Invoice date">
              <input name="invoiceDate" required type="date" className={inputClassName} defaultValue="2026-07-01" />
            </Field>
            <Field label="Quantity">
              <input name="quantity" required type="number" min="0" step="0.01" className={inputClassName} placeholder="100" />
            </Field>
            <Field label="Unit">
              <input name="quantityUnit" required className={inputClassName} defaultValue="tons" />
            </Field>
            <Field label="Amount">
              <input name="amount" required type="number" min="0" step="0.01" className={inputClassName} placeholder="10000" />
            </Field>
            <div className="flex items-end">
              <SubmitButton>Create invoice</SubmitButton>
            </div>
          </form>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Mock invoices</h2>
          <p className="mt-1 text-sm text-muted-foreground">These are the source records for invoice amount and tons/quantity used by Credit Preview.</p>
        </div>
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Invoice</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {invoices.map((invoice) => {
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
                        <StatusBadge status={isSelected && preview.rows.length > 0 ? "Approved" : isSelected ? "Warning" : "Active"} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/credit-preview?invoiceId=${invoice.id}`} className="inline-flex h-9 items-center rounded-md border border-border bg-surface px-3 text-xs font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
                            Preview
                          </Link>
                          {canCreateInvoices ? (
                            <>
                              <Link href={`/credit-preview/invoices/${invoice.id}/edit`} className="inline-flex h-9 items-center rounded-md border border-border bg-surface px-3 text-xs font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
                                Edit
                              </Link>
                              <form action={deleteMockInvoice}>
                                <input type="hidden" name="id" value={invoice.id} />
                                <button className="h-9 rounded-md border border-border bg-surface px-3 text-xs font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
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
            <h2 className="text-lg font-semibold">No mock invoices yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create a mock invoice to enter amount and tons/quantity for crediting.</p>
          </div>
        )}
      </Card>

      {preview.invoice ? (
        <Card className="p-4">
          <div className="mb-4 rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Source of amount and tons:</span> these values come from the selected mock invoice. Credit Preview multiplies invoice quantity and invoice amount by each approved assignment allocation percentage.
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
              <p className="text-muted-foreground">Product group</p>
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
          <h2 className="text-base font-semibold">Credited output</h2>
        </div>
        {preview.rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Assignment</th>
                  <th className="px-4 py-3 font-medium">Seller</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Allocation</th>
                  <th className="px-4 py-3 font-medium">Credited quantity</th>
                  <th className="px-4 py-3 font-medium">Credited amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {preview.rows.map((row) => (
                  <tr key={row.assignment.id}>
                    <td className="px-4 py-3 font-medium">{row.assignment.assignmentNumber}</td>
                    <td className="px-4 py-3">{row.seller.name}</td>
                    <td className="px-4 py-3">{row.role.name}</td>
                    <td className="px-4 py-3">{row.allocation}%</td>
                    <td className="px-4 py-3">{formatNumber(row.creditedQuantity, preview.invoice?.quantityUnit)}</td>
                    <td className="px-4 py-3">{formatCurrency(row.creditedAmount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status="Approved" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold">No matching approved assignments</h2>
            <p className="mt-2 text-sm text-muted-foreground">No approved or active credit-eligible assignments match this invoice customer, product group, and invoice date. Create or approve a matching assignment, or edit the invoice customer/product/date.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
