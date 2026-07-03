import Link from "next/link";
import { createRole, toggleRoleActive } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton, SuccessMessage, ToggleButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listRoles } from "@/lib/data/roles";
import { formatDate, formatEnum, roleBehaviorOptions, roleCategoryOptions } from "@/lib/setup-options";

export default async function RolesPage({
  searchParams
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const [allowed, session] = await Promise.all([can("roles:manage"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Role setup is admin-only"
        description={`${session.label} cannot change role behavior. Role configuration is limited to Sales Compensation Admins in this POC.`}
      />
    );
  }

  const [roles, params] = await Promise.all([listRoles(), searchParams]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title="Role configuration"
        description="Maintain role names, role categories, credit eligibility, and split behavior. Role name is the business label; category groups the role for compensation logic and reporting."
      />
      {params.created === "role" ? <SuccessMessage>Role configuration created.</SuccessMessage> : null}
      {params.created === "role-updated" ? <SuccessMessage>Role configuration updated.</SuccessMessage> : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Role behaviors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Behavior</th>
                  <th className="px-4 py-3 font-medium">Thresholds</th>
                  <th className="px-4 py-3 font-medium">Dates</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.isEligibleForCredit ? "Eligible for credit" : "Visibility only"}</p>
                    </td>
                    <td className="px-4 py-3">{formatEnum(role.category)}</td>
                    <td className="px-4 py-3">{formatEnum(role.behavior)}</td>
                    <td className="px-4 py-3">
                      Required: {role.splitRequiredTotal?.toString() ?? "None"} / Max: {role.splitMaximum?.toString() ?? "None"}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(role.effectiveStartDate)} - {formatDate(role.effectiveEndDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={role.active ? "Active" : "Expired"} />
                    </td>
                    <td className="px-4 py-3">
                      <ToggleButton id={role.id} nextActive={!role.active} action={toggleRoleActive} />
                      <Link href={`/roles/${role.id}/edit`} className="mt-2 inline-flex h-9 items-center rounded-md border border-border bg-white px-3 text-xs font-semibold">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <FormPanel title="Add role" description="Create a future-ready role behavior without changing code.">
          <form action={createRole} className="grid gap-4">
            <Field label="Role name" description="Specific business label shown to users, such as Strategic Account Overlay.">
              <input name="name" required className={inputClassName} placeholder="Strategic Account Overlay" />
            </Field>
            <Field label="Category" description="Broad role family used for grouping, reporting, and future rule mapping.">
              <select name="category" className={selectClassName} defaultValue="FUTURE_ROLE">
                {roleCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Behavior" description="Controls validation logic, such as exact split totals, capped splits, additive overlay credit, or rollups.">
              <select name="behavior" className={selectClassName} defaultValue="CONFIGURABLE">
                {roleBehaviorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Required split total">
                <input name="splitRequiredTotal" type="number" min="0" max="100" className={inputClassName} placeholder="100" />
              </Field>
              <Field label="Split maximum">
                <input name="splitMaximum" type="number" min="0" max="100" className={inputClassName} placeholder="100" />
              </Field>
            </div>
            <div className="grid gap-1">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input name="isEligibleForCredit" type="checkbox" defaultChecked />
                Eligible for credit
              </label>
              <p className="text-xs leading-5 text-muted-foreground">Checked roles participate in Credit Preview. Unchecked roles are visibility-only, such as manager roll-up or planning roles.</p>
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
              <Badge>Configurable</Badge>
              <SubmitButton>Create role</SubmitButton>
            </div>
          </form>
        </FormPanel>
      </section>
    </div>
  );
}
