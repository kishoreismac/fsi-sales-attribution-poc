import Link from "next/link";
import { createCustomer, createProductGroup, toggleCustomerActive, toggleProductGroupActive } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton, SuccessMessage, ToggleButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { SortLink } from "@/components/ui/sort-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listCustomersAndProductGroups } from "@/lib/data/customers-products";
import { formatDate, formatEnum, metricTypeOptions } from "@/lib/setup-options";
import { sortDirection, sortRows, type SortParams } from "@/lib/table-sort";

export default async function CustomersProductsPage({
  searchParams
}: {
  searchParams: Promise<{ created?: string } & SortParams>;
}) {
  const [allowed, session] = await Promise.all([can("customersProducts:manage"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Customer And Product Setup Is Admin-Only"
        description={`${session.label} cannot maintain mock customer or product group setup records. This setup area is limited to Sales Compensation Admins.`}
      />
    );
  }

  const [{ customers, productGroups }, params] = await Promise.all([listCustomersAndProductGroups(), searchParams]);
  const direction = sortDirection(params.dir);
  const sortedCustomers = sortRows(customers, direction, (customer) => {
    switch (params.sort) {
      case "customerCode":
        return customer.customerCode;
      case "externalIds":
        return customer.sapCustomerId ?? customer.salesforceAccountId;
      case "customerDates":
        return customer.effectiveStartDate;
      case "customerStatus":
        return customer.active;
      case "customer":
      default:
        return customer.name;
    }
  });
  const sortedProductGroups = sortRows(productGroups, direction, (productGroup) => {
    switch (params.sort) {
      case "productCode":
        return productGroup.productGroupCode;
      case "metric":
        return formatEnum(productGroup.metricType);
      case "productDates":
        return productGroup.effectiveStartDate;
      case "productStatus":
        return productGroup.active;
      case "product":
      default:
        return productGroup.name;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title="Customer And Product Group Setup"
        description="Maintain mock customer, sales parent, external integration IDs, and product metric rules used by assignment and credit preview workflows."
      />
      {params.created === "customer" ? <SuccessMessage>Customer created.</SuccessMessage> : null}
      {params.created === "product-group" ? <SuccessMessage>Product Group Created.</SuccessMessage> : null}
      {params.created === "customer-updated" ? <SuccessMessage>Customer updated.</SuccessMessage> : null}
      {params.created === "product-group-updated" ? <SuccessMessage>Product Group Updated.</SuccessMessage> : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Customers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium"><SortLink label="Customer" sortKey="customer" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Code" sortKey="customerCode" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="External IDs" sortKey="externalIds" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Dates" sortKey="customerDates" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Status" sortKey="customerStatus" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {sortedCustomers.map((customer) => (
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
                      <Link href={`/customers-products/customers/${customer.id}/edit`} className="mt-2 inline-flex h-9 items-center rounded-md border border-border bg-white px-3 text-xs font-semibold">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <FormPanel title="Add Customer" description="Create mock customer and sales parent records with future integration IDs.">
          <form action={createCustomer} className="grid gap-4">
            <Field label="Customer Code">
              <input name="customerCode" required className={inputClassName} placeholder="CUST-1007" />
            </Field>
            <Field label="Customer Name">
              <input name="name" required className={inputClassName} placeholder="Blue River Dairy" />
            </Field>
            <Field label="Sales Parent" description="Parent account or sales grouping used to roll customer locations into a broader selling relationship.">
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
              <Field label="Start Date">
                <input name="effectiveStartDate" required type="date" className={inputClassName} defaultValue="2026-07-01" />
              </Field>
              <Field label="End Date">
                <input name="effectiveEndDate" type="date" className={inputClassName} />
              </Field>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Badge>Mock Customer</Badge>
              <SubmitButton>Create Customer</SubmitButton>
            </div>
          </form>
        </FormPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Product Groups</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium"><SortLink label="Product Group" sortKey="product" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Code" sortKey="productCode" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Metric" sortKey="metric" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Dates" sortKey="productDates" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Status" sortKey="productStatus" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {sortedProductGroups.map((productGroup) => (
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
                      <Link href={`/customers-products/product-groups/${productGroup.id}/edit`} className="mt-2 inline-flex h-9 items-center rounded-md border border-border bg-white px-3 text-xs font-semibold">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <FormPanel title="Add Product Group" description="Metric type controls whether Credit Preview calculates credited tons/quantity, credited amount, or both.">
          <form action={createProductGroup} className="grid gap-4">
            <Field label="Product Group Code">
              <input name="productGroupCode" required className={inputClassName} placeholder="PG-PURINA-NEW" />
            </Field>
            <Field label="External Product Group ID" description="Future key for matching this group to product master or ERP data.">
              <input name="externalProductGroupId" className={inputClassName} placeholder="PURINA-NEW" />
            </Field>
            <Field label="Product Group Name">
              <input name="name" required className={inputClassName} placeholder="Purina Starter Program" />
            </Field>
            <Field label="Metric Type" description="Quantity calculates tons/units, Amount calculates dollars, Both calculates both from invoice data.">
              <select name="metricType" className={selectClassName} defaultValue="BOTH">
                {metricTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date">
                <input name="effectiveStartDate" required type="date" className={inputClassName} defaultValue="2026-07-01" />
              </Field>
              <Field label="End Date">
                <input name="effectiveEndDate" type="date" className={inputClassName} />
              </Field>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Badge>Assignment-ready</Badge>
              <SubmitButton>Create Product Group</SubmitButton>
            </div>
          </form>
        </FormPanel>
      </section>
    </div>
  );
}
