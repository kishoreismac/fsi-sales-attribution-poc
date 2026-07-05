import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMockInvoice } from "@/app/actions/credit-preview";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { can, getDemoSession } from "@/lib/auth/session";
import { listCustomersAndProductGroups } from "@/lib/data/customers-products";
import { getMockInvoiceById } from "@/lib/data/credit-preview";

function dateInputValue(value: Date) {
  return value.toISOString().slice(0, 10);
}

export default async function EditMockInvoicePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const [allowed, session] = await Promise.all([can("customersProducts:manage"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Invoice setup is admin-only"
        description={`${session.label} can preview credit output, but mock invoice maintenance is limited to Sales Compensation Admins in this POC.`}
      />
    );
  }

  const { id } = await params;
  const [invoice, setupData] = await Promise.all([getMockInvoiceById(id), listCustomersAndProductGroups()]);

  if (!invoice) {
    notFound();
  }

  const activeCustomers = setupData.customers.filter((customer) => customer.active || customer.id === invoice.customerId);
  const activeProductGroups = setupData.productGroups.filter((productGroup) => productGroup.active || productGroup.id === invoice.productGroupId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Preview"
        title={`Edit ${invoice.invoiceNumber}`}
        description="Update the invoice amount, tons/quantity, customer, product group, and invoice date used by Credit Preview."
        actions={
          <Link href={`/credit-preview?invoiceId=${invoice.id}`} className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
            Back to preview
          </Link>
        }
      />

      <FormPanel title="Mock invoice" description="Assignments supply allocation percentages; this invoice supplies the quantity/unit and dollar amount being allocated.">
        <form action={updateMockInvoice} className="grid gap-4">
          <input type="hidden" name="id" value={invoice.id} />
          <Field label="Invoice number">
            <input name="invoiceNumber" required className={inputClassName} defaultValue={invoice.invoiceNumber} />
          </Field>
          <Field label="Customer">
            <select name="customerId" required className={selectClassName} defaultValue={invoice.customerId}>
              {activeCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Product group">
            <select name="productGroupId" required className={selectClassName} defaultValue={invoice.productGroupId}>
              {activeProductGroups.map((productGroup) => (
                <option key={productGroup.id} value={productGroup.id}>
                  {productGroup.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Quantity">
              <input name="quantity" required type="number" min="0" step="0.01" className={inputClassName} defaultValue={invoice.quantity.toString()} />
            </Field>
            <Field label="Unit">
              <input name="quantityUnit" required className={inputClassName} defaultValue={invoice.quantityUnit} />
            </Field>
            <Field label="Amount">
              <input name="amount" required type="number" min="0" step="0.01" className={inputClassName} defaultValue={invoice.amount.toString()} />
            </Field>
          </div>
          <Field label="Invoice date">
            <input name="invoiceDate" required type="date" className={inputClassName} defaultValue={dateInputValue(invoice.invoiceDate)} />
          </Field>
          <div className="flex justify-end">
            <SubmitButton>Save invoice</SubmitButton>
          </div>
        </form>
      </FormPanel>
    </div>
  );
}
