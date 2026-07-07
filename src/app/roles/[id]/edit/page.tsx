import Link from "next/link";
import { notFound } from "next/navigation";
import { updateRole } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { can, getDemoSession } from "@/lib/auth/session";
import { getRoleById } from "@/lib/data/roles";
import { roleBehaviorOptions, roleCategoryOptions } from "@/lib/setup-options";

function dateInputValue(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

export default async function EditRolePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const [allowed, session] = await Promise.all([can("roles:manage"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Role Setup Is Admin-Only"
        description={`${session.label} cannot change role behavior. Role configuration is limited to Sales Compensation Admins in this POC.`}
      />
    );
  }

  const { id } = await params;
  const role = await getRoleById(id);

  if (!role) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title={`Edit ${role.name}`}
        description="Update role category, credit eligibility, split behavior, thresholds, and effective dates."
        actions={
          <Link href="/roles" className="inline-flex h-10 items-center rounded-md border border-border bg-white px-4 text-sm font-semibold">
            Back To Roles
          </Link>
        }
      />

      <FormPanel title="Role Configuration" description="Role name is the user-facing label. Category and behavior drive reporting and validation logic.">
        <form action={updateRole} className="grid gap-4">
          <input type="hidden" name="id" value={role.id} />
          <Field label="Role Name" description="Specific business label shown to users.">
            <input name="name" required className={inputClassName} defaultValue={role.name} />
          </Field>
          <Field label="Category" description="Broad role family used for grouping, reporting, and future rule mapping.">
            <select name="category" className={selectClassName} defaultValue={role.category}>
              {roleCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Behavior" description="Controls validation logic for split totals, capped splits, overlays, and rollups.">
            <select name="behavior" className={selectClassName} defaultValue={role.behavior}>
              {roleBehaviorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Required Split Total">
              <input name="splitRequiredTotal" type="number" min="0" max="100" className={inputClassName} defaultValue={role.splitRequiredTotal?.toString() ?? ""} />
            </Field>
            <Field label="Split Maximum">
              <input name="splitMaximum" type="number" min="0" max="100" className={inputClassName} defaultValue={role.splitMaximum?.toString() ?? ""} />
            </Field>
          </div>
          <div className="grid gap-1">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input name="isEligibleForCredit" type="checkbox" defaultChecked={role.isEligibleForCredit} />
              Eligible For Credit
            </label>
            <p className="text-xs leading-5 text-muted-foreground">Checked roles participate in Credit Calculation. Unchecked roles are visibility-only.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start Date">
              <input name="effectiveStartDate" required type="date" className={inputClassName} defaultValue={dateInputValue(role.effectiveStartDate)} />
            </Field>
            <Field label="End Date">
              <input name="effectiveEndDate" type="date" className={inputClassName} defaultValue={dateInputValue(role.effectiveEndDate)} />
            </Field>
          </div>
          <div className="flex justify-end">
            <SubmitButton>Save Role</SubmitButton>
          </div>
        </form>
      </FormPanel>
    </div>
  );
}
