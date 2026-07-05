import Link from "next/link";
import { createCustomer, createProductGroup, toggleCustomerActive, toggleProductGroupActive } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton, SuccessMessage, ToggleButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listCustomersAndProductGroups } from "@/lib/data/customers-products";
import { formatDate, formatEnum, metricTypeOptions } from "@/lib/setup-options";

export default async function CustomersProductsPage({
  searchParams
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const [allowed, session] = await Promise.all([can("customersProducts:manage"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Customer and product setup is admin-only"
        description={`${session.label} cannot maintain mock customer or product group setup records. This setup area is limited to Sales Compensation Admins.`}
      />
    );
  }

  const [{ customers, productGroups }, params] = await Promise.all([listCustomersAndProductGroups(), searchParams]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title="Customer and product group setup"
        description="Maintain mock customer, sales parent, external integration IDs, and product metric rules used by assignment and credit preview workflows."
      />
      {params.created === "customer" ? <SuccessMessage>Customer created.</SuccessMessage> : null}
      {params.created === "product-group" ? <SuccessMessage>Product group created.</SuccessMessage> : null}
      {params.created === "customer-updated" ? <SuccessMessage>Customer updated.</SuccessMessage> : null}
      {params.created === "product-group-updated" ? <SuccessMessage>Product group updated.</SuccessMessage> : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Customers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">External IDs</th>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.salesParent}</p>
                    </td>
                    <td className="px-4 py-3">{customer.customerCode}</td>
                    <td className="px-4 py-3">
                      SAP: {customer.sapCustomerId ?? "None"} / SF: {customer.salesforceAccountId ?? "None"}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(customer.effectiveStartDate)} - {formatDate(customer.effectiveEndDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.active ? "Active" : "Expired"} />
                    </td>
                    <td className="px-4 py-3">
                      <ToggleButton id={customer.id} nextActive={!customer.active} action={toggleCustomerActive} />
                      <Link href={`/customers-products/customers/${customer.id}/edit`} className="mt-2 inline-flex h-9 items-center rounded-md border border-border bg-surface px-3 text-xs font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <FormPanel title="Add customer" description="Create mock customer and sales parent records with future integration IDs.">
          <form action={createCustomer} className="grid gap-4">
            <Field label="Customer code">
              <input name="customerCode" required className={inputClassName} placeholder="CUST-1007" />
            </Field>
            <Field label="Customer name">
              <input name="name" required className={inputClassName} placeholder="Blue River Dairy" />
            </Field>
            <Field label="Sales parent" description="Parent account or sales grouping used to roll customer locations into a broader selling relationship.">
              <input name="salesParent" required className={inputClassName} placeholder="Blue River Farms" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SAP Customer ID" description="Future key for matching this customer to SAP.">
                <input name="sapCustomerId" className={inputClassName} placeholder="SAP-1007" />
              </Field>
              <Field label="Salesforce Account ID" description="Future key for matching this customer to Salesforce.">
                <input name="salesforceAccountId" className={inputClassName} placeholder="SF-1007" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start date">
                <input name="effectiveStartDate" required type="date" className={inputClassName} defaultValue="2026-07-01" />
              </Field>
              <Field label="End date">
                <input name="effectiveEndDate" type="date" className={inputClassName} />
              </Field>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Badge>Mock customer</Badge>
              <SubmitButton>Create customer</SubmitButton>
            </div>
          </form>
        </FormPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Product groups</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Product group</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Metric</th>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {productGroups.map((productGroup) => (
                  <tr key={productGroup.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{productGroup.name}</p>
                      <p className="text-xs text-muted-foreground">{productGroup.externalProductGroupId ?? "No external ID"}</p>
                    </td>
                    <td className="px-4 py-3">{productGroup.productGroupCode}</td>
                    <td className="px-4 py-3">{formatEnum(productGroup.metricType)}</td>
                    <td className="px-4 py-3">
                      {formatDate(productGroup.effectiveStartDate)} - {formatDate(productGroup.effectiveEndDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={productGroup.active ? "Active" : "Expired"} />
                    </td>
                    <td className="px-4 py-3">
                      <ToggleButton id={productGroup.id} nextActive={!productGroup.active} action={toggleProductGroupActive} />
                      <Link href={`/customers-products/product-groups/${productGroup.id}/edit`} className="mt-2 inline-flex h-9 items-center rounded-md border border-border bg-surface px-3 text-xs font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <FormPanel title="Add product group" description="Metric type controls whether Credit Preview calculates credited tons/quantity, credited amount, or both.">
          <form action={createProductGroup} className="grid gap-4">
            <Field label="Product group code">
              <input name="productGroupCode" required className={inputClassName} placeholder="PG-PURINA-NEW" />
            </Field>
            <Field label="External product group ID" description="Future key for matching this group to product master or ERP data.">
              <input name="externalProductGroupId" className={inputClassName} placeholder="PURINA-NEW" />
            </Field>
            <Field label="Product group name">
              <input name="name" required className={inputClassName} placeholder="Purina Starter Program" />
            </Field>
            <Field label="Metric type" description="Quantity calculates tons/units, Amount calculates dollars, Both calculates both from invoice data.">
              <select name="metricType" className={selectClassName} defaultValue="BOTH">
                {metricTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start date">
                <input name="effectiveStartDate" required type="date" className={inputClassName} defaultValue="2026-07-01" />
              </Field>
              <Field label="End date">
                <input name="effectiveEndDate" type="date" className={inputClassName} />
              </Field>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Badge>Assignment-ready</Badge>
              <SubmitButton>Create product group</SubmitButton>
            </div>
          </form>
        </FormPanel>
      </section>
    </div>
  );
}
