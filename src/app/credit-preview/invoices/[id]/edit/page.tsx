import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMockInvoice } from "@/app/actions/credit-preview";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { can, getDemoSession } from "@/lib/auth/session";
import { listCustomersAndProductGroups } from "@/lib/data/customers-products";
import { getMockInvoiceById } from "@/lib/data/credit-preview";
import { isQuantityUnit, quantityUnitOptions } from "@/lib/setup-options";

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
        title="Invoice Transaction Setup Is Admin-Only"
        description={`${session.label} can view calculated credit output, but invoice transaction maintenance is limited to Sales Compensation Admins in this POC.`}
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
  const hasLegacyUnit = !isQuantityUnit(invoice.quantityUnit);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Credit Calculation"
        title={`Edit ${invoice.invoiceNumber}`}
        description="Update the invoice amount, quantity, customer, product group, and invoice date used by Credit Calculation."
        actions={
          <Link href={`/credit-preview?invoiceId=${invoice.id}`} className="inline-flex h-10 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold">
            Back To Credit Calculation
          </Link>
        }
      />

      <FormPanel title="Invoice Transaction" description="Assignments supply allocation percentages; this transaction supplies the quantity/unit and dollar amount being allocated.">
        <form action={updateMockInvoice} className="grid gap-4">
          <input type="hidden" name="id" value={invoice.id} />
          <Field label="Invoice Number">
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
          <Field label="Product Group">
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
              <select name="quantityUnit" required className={selectClassName} defaultValue={invoice.quantityUnit}>
                {hasLegacyUnit ? <option value={invoice.quantityUnit}>{invoice.quantityUnit} (Legacy)</option> : null}
                {quantityUnitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Amount">
              <input name="amount" required type="number" min="0" step="0.01" className={inputClassName} defaultValue={invoice.amount.toString()} />
            </Field>
          </div>
          <Field label="Invoice Date">
            <input name="invoiceDate" required type="date" className={inputClassName} defaultValue={dateInputValue(invoice.invoiceDate)} />
          </Field>
          <div className="flex justify-end">
            <SubmitButton>Save Transaction</SubmitButton>
          </div>
        </form>
      </FormPanel>
    </div>
  );
}
