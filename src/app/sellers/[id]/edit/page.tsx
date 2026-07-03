import Link from "next/link";
import { notFound } from "next/navigation";
import { updateSeller } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { can, getDemoSession } from "@/lib/auth/session";
import { getSellerById, listSellers } from "@/lib/data/sellers";
import { employeeTypeOptions } from "@/lib/setup-options";

function dateInputValue(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

export default async function EditSellerPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const [allowed, session] = await Promise.all([can("sellers:manage"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Seller setup is admin-only"
        description={`${session.label} can review approved workflow areas, but seller profile setup is limited to Sales Compensation Admins in this POC.`}
      />
    );
  }

  const { id } = await params;
  const [seller, sellers] = await Promise.all([getSellerById(id), listSellers()]);

  if (!seller) {
    notFound();
  }

  const managerOptions = sellers.filter((item) => item.id !== seller.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title={`Edit ${seller.name}`}
        description="Update seller identity, worker classification, manager, active-date window, and Workday mapping. Historical assignments remain intact."
        actions={
          <Link href="/sellers" className="inline-flex h-10 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold">
            Back to sellers
          </Link>
        }
      />

      <FormPanel title="Seller profile" description="Workday ID is only saved for Workday employees. Local hires and non-employees keep that field blank.">
        <form action={updateSeller} className="grid gap-4">
          <input type="hidden" name="id" value={seller.id} />
          <Field label="Seller code">
            <input name="sellerCode" required className={inputClassName} defaultValue={seller.sellerCode} />
          </Field>
          <Field label="Workday Employee ID" description="Required only for sellers who exist in Workday. Leave blank for local hires or non-employees.">
            <input name="workdayEmployeeId" className={inputClassName} defaultValue={seller.workdayEmployeeId ?? ""} />
          </Field>
          <Field label="Name">
            <input name="name" required className={inputClassName} defaultValue={seller.name} />
          </Field>
          <Field label="Email">
            <input name="email" required type="email" className={inputClassName} defaultValue={seller.email} />
          </Field>
          <Field label="Employee type" description="Classifies the profile for future validation and integration behavior.">
            <select name="employeeType" className={selectClassName} defaultValue={seller.employeeType}>
              {employeeTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Manager" description="Optional. Managers must already exist as seller profiles in this POC.">
            <select name="managerSellerId" className={selectClassName} defaultValue={seller.managerSellerId ?? ""}>
              <option value="">No manager</option>
              {managerOptions.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-1">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input name="isFullTime" type="checkbox" defaultChecked={seller.isFullTime} />
              Full-time employee
            </label>
            <p className="text-xs leading-5 text-muted-foreground">Use for employee staffing status. For non-employees, leave unchecked unless the business wants to track full-time contractor participation.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date">
              <input name="effectiveStartDate" required type="date" className={inputClassName} defaultValue={dateInputValue(seller.effectiveStartDate)} />
            </Field>
            <Field label="End date">
              <input name="effectiveEndDate" type="date" className={inputClassName} defaultValue={dateInputValue(seller.effectiveEndDate)} />
            </Field>
          </div>
          <div className="flex justify-end">
            <SubmitButton>Save seller</SubmitButton>
          </div>
        </form>
      </FormPanel>
    </div>
  );
}
