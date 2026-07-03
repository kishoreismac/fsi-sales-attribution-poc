import Link from "next/link";
import { saveDraftAssignment, submitNewAssignment } from "@/app/actions/assignments";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Card } from "@/components/ui/card";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { can, getDemoSession } from "@/lib/auth/session";
import { listCustomersAndProductGroups } from "@/lib/data/customers-products";
import { listRoles } from "@/lib/data/roles";
import { listSellers } from "@/lib/data/sellers";

export default async function NewAssignmentPage() {
  const [allowed, session] = await Promise.all([can("assignments:create"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Assignment creation is admin-only"
        description={`${session.label} can view assignments, but only Sales Compensation Admins can create drafts or submit assignments in this POC.`}
      />
    );
  }

  const [{ customers, productGroups }, sellers, roles] = await Promise.all([
    listCustomersAndProductGroups(),
    listSellers(),
    listRoles()
  ]);

  const activeCustomers = customers.filter((customer) => customer.active);
  const activeProductGroups = productGroups.filter((productGroup) => productGroup.active);
  const activeSellers = sellers.filter((seller) => seller.active);
  const activeRoles = roles.filter((role) => role.active);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assignments"
        title="New assignment"
        description="Create the assignment shell for customer, product group, seller, role, allocation percentage, and effective dates. Amount and tons are not entered here; they come from invoice data in Credit Preview."
        actions={
          <Link href="/assignments" className="inline-flex h-10 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold">
            Previous
          </Link>
        }
      />
      <Card className="p-4">
        <p className="text-sm font-semibold">Where do amount and tons come from?</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          This page only defines who gets what allocation percentage. Invoice amount and invoice quantity, such as tons, are mock invoice inputs used on Credit Preview. The preview multiplies those invoice values by this allocation percentage.
        </p>
      </Card>
      <FormPanel
        title="Assignment details"
        description="Server-side validation will check split behavior, inactive sellers, date order, and overlapping approved records."
      >
        <form action={submitNewAssignment} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Customer / Sales Parent">
              <select name="customerId" required className={selectClassName}>
                {activeCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} / {customer.salesParent}
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
            <Field label="Seller">
              <select name="sellerId" required className={selectClassName}>
                {activeSellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Role">
              <select name="roleId" required className={selectClassName}>
                {activeRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Allocation %" description="Percentage of the matching invoice quantity and/or amount credited to this seller.">
              <input name="allocationPercent" required type="number" min="0" max="200" step="0.01" className={inputClassName} placeholder="100" />
            </Field>
            <Field label="Start Date">
              <input name="startDate" required type="date" className={inputClassName} defaultValue="2026-07-01" />
            </Field>
            <Field label="End Date">
              <input name="endDate" type="date" className={inputClassName} />
            </Field>
            <Field label="Reason / Notes">
              <input name="reasonNotes" className={inputClassName} placeholder="Business reason for assignment" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              formAction={saveDraftAssignment}
              className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Save draft
            </button>
            <SubmitButton>Submit for review</SubmitButton>
          </div>
        </form>
      </FormPanel>
    </div>
  );
}
