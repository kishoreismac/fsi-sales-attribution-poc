import Link from "next/link";
import { createRole, toggleRoleActive } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton, SuccessMessage, ToggleButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { SortLink } from "@/components/ui/sort-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listRoles } from "@/lib/data/roles";
import { formatDate, formatEnum, roleBehaviorOptions, roleCategoryOptions } from "@/lib/setup-options";
import { sortDirection, sortRows, type SortParams } from "@/lib/table-sort";

export default async function RolesPage({
  searchParams
}: {
  searchParams: Promise<{ created?: string } & SortParams>;
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

  const [roles, params] = await Promise.all([listRoles(), searchParams]);
  const direction = sortDirection(params.dir);
  const sortedRoles = sortRows(roles, direction, (role) => {
    switch (params.sort) {
      case "category":
        return formatEnum(role.category);
      case "behavior":
        return formatEnum(role.behavior);
      case "thresholds":
        return Number(role.splitRequiredTotal ?? role.splitMaximum ?? 0);
      case "dates":
        return role.effectiveStartDate;
      case "status":
        return role.active;
      case "role":
      default:
        return role.name;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title="Role Configuration"
        description="Maintain role names, role categories, credit eligibility, and split behavior. Role name is the business label; category groups the role for compensation logic and reporting."
      />
      {params.created === "role" ? <SuccessMessage>Role Configuration Created.</SuccessMessage> : null}
      {params.created === "role-updated" ? <SuccessMessage>Role Configuration Updated.</SuccessMessage> : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Role Behaviors</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium"><SortLink label="Role" sortKey="role" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Category" sortKey="category" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Behavior" sortKey="behavior" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Thresholds" sortKey="thresholds" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Dates" sortKey="dates" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Status" sortKey="status" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {sortedRoles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.isEligibleForCredit ? "Eligible For Credit" : "Visibility Only"}</p>
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

        <FormPanel title="Add Role" description="Create a future-ready role behavior without changing code.">
          <form action={createRole} className="grid gap-4">
            <Field label="Role Name" description="Specific business label shown to users, such as Strategic Account Overlay.">
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
              <Field label="Required Split Total">
                <input name="splitRequiredTotal" type="number" min="0" max="100" className={inputClassName} placeholder="100" />
              </Field>
              <Field label="Split Maximum">
                <input name="splitMaximum" type="number" min="0" max="100" className={inputClassName} placeholder="100" />
              </Field>
            </div>
            <div className="grid gap-1">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input name="isEligibleForCredit" type="checkbox" defaultChecked />
                Eligible For Credit
              </label>
              <p className="text-xs leading-5 text-muted-foreground">Checked roles participate in Credit Calculation. Unchecked roles are visibility-only, such as manager roll-up or planning roles.</p>
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
              <Badge>Configurable</Badge>
              <SubmitButton>Create Role</SubmitButton>
            </div>
          </form>
        </FormPanel>
      </section>
    </div>
  );
}
