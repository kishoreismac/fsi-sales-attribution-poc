import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCustomer } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Field, FormPanel, inputClassName, SubmitButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { can, getDemoSession } from "@/lib/auth/session";
import { getCustomerById } from "@/lib/data/customers-products";

function dateInputValue(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

export default async function EditCustomerPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const [allowed, session] = await Promise.all([can("customersProducts:manage"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Customer setup is admin-only"
        description={`${session.label} cannot maintain customer setup records. This setup area is limited to Sales Compensation Admins.`}
      />
    );
  }

  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title={`Edit ${customer.name}`}
        description="Update customer identity, sales parent grouping, integration IDs, and effective dates."
        actions={
          <Link href="/customers-products" className="inline-flex h-10 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold">
            Back to setup
          </Link>
        }
      />

      <FormPanel title="Customer" description="External IDs keep this POC aligned to future SAP and Salesforce matching.">
        <form action={updateCustomer} className="grid gap-4">
          <input type="hidden" name="id" value={customer.id} />
          <Field label="Customer code">
            <input name="customerCode" required className={inputClassName} defaultValue={customer.customerCode} />
          </Field>
          <Field label="Customer name">
            <input name="name" required className={inputClassName} defaultValue={customer.name} />
          </Field>
          <Field label="Sales parent" description="Parent account or sales grouping used to roll customer locations into a broader selling relationship.">
            <input name="salesParent" required className={inputClassName} defaultValue={customer.salesParent} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SAP Customer ID" description="Future key for matching this customer to SAP.">
              <input name="sapCustomerId" className={inputClassName} defaultValue={customer.sapCustomerId ?? ""} />
            </Field>
            <Field label="Salesforce Account ID" description="Future key for matching this customer to Salesforce.">
              <input name="salesforceAccountId" className={inputClassName} defaultValue={customer.salesforceAccountId ?? ""} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date">
              <input name="effectiveStartDate" required type="date" className={inputClassName} defaultValue={dateInputValue(customer.effectiveStartDate)} />
            </Field>
            <Field label="End date">
              <input name="effectiveEndDate" type="date" className={inputClassName} defaultValue={dateInputValue(customer.effectiveEndDate)} />
            </Field>
          </div>
          <div className="flex justify-end">
            <SubmitButton>Save customer</SubmitButton>
          </div>
        </form>
      </FormPanel>
    </div>
  );
}
