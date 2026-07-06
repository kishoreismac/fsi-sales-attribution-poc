import Link from "next/link";
import { createSeller, toggleSellerActive } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton, SuccessMessage, ToggleButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { SortLink } from "@/components/ui/sort-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listSellers } from "@/lib/data/sellers";
import { employeeTypeOptions, formatDate, formatEnum } from "@/lib/setup-options";
import { sortDirection, sortRows, type SortParams } from "@/lib/table-sort";

export default async function SellersPage({
  searchParams
}: {
  searchParams: Promise<{ created?: string } & SortParams>;
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

  const [sellers, params] = await Promise.all([listSellers(), searchParams]);
  const direction = sortDirection(params.dir);
  const sortedSellers = sortRows(sellers, direction, (seller) => {
    switch (params.sort) {
      case "code":
        return seller.sellerCode;
      case "employeeType":
        return formatEnum(seller.employeeType);
      case "manager":
        return seller.manager?.name;
      case "dates":
        return seller.effectiveStartDate;
      case "status":
        return seller.active;
      case "seller":
      default:
        return seller.name;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title="Seller management"
        description="Create and maintain seller profiles. Workday employees map to Workday IDs, local hires support regional staffing scenarios, and non-employees represent external participants such as contractors or partners."
      />
      {params.created === "seller" ? <SuccessMessage>Seller profile created.</SuccessMessage> : null}
      {params.created === "seller-updated" ? <SuccessMessage>Seller profile updated.</SuccessMessage> : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Seller profiles</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium"><SortLink label="Seller" sortKey="seller" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Code" sortKey="code" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Employee Type" sortKey="employeeType" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Manager" sortKey="manager" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Dates" sortKey="dates" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium"><SortLink label="Status" sortKey="status" currentSort={params.sort} currentDir={direction} /></th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {sortedSellers.map((seller) => (
                  <tr key={seller.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.email}</p>
                    </td>
                    <td className="px-4 py-3">{seller.sellerCode}</td>
                    <td className="px-4 py-3">{formatEnum(seller.employeeType)}</td>
                    <td className="px-4 py-3">{seller.manager?.name ?? "None"}</td>
                    <td className="px-4 py-3">
                      {formatDate(seller.effectiveStartDate)} - {formatDate(seller.effectiveEndDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={seller.active ? "Active" : "Expired"} />
                    </td>
                    <td className="px-4 py-3">
                      <ToggleButton id={seller.id} nextActive={!seller.active} action={toggleSellerActive} />
                      <Link href={`/sellers/${seller.id}/edit`} className="mt-2 inline-flex h-9 items-center rounded-md border border-border bg-white px-3 text-xs font-semibold">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <FormPanel
          title="Add seller"
          description=""
        >
          <form action={createSeller} className="grid gap-4">
            <Field label="Seller code">
              <input name="sellerCode" required className={inputClassName} placeholder="SEL-207" />
            </Field>
            <Field label="Workday Employee ID" description="Required only for sellers who exist in Workday. Leave blank for local hires or non-employees.">
              <input name="workdayEmployeeId" className={inputClassName} placeholder="WD-207" />
            </Field>
            <Field label="Name">
              <input name="name" required className={inputClassName} placeholder="Thomas Walker" />
            </Field>
            <Field label="Email">
              <input name="email" required type="email" className={inputClassName} placeholder="thomas.walker@example.com" />
            </Field>
            <Field label="Employee type" description="Classifies the profile as an internal Workday employee, local hire, or non-employee for future validation and integrations.">
              <select name="employeeType" className={selectClassName} defaultValue="WORKDAY_EMPLOYEE">
                {employeeTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Manager" description="Optional. Managers must already exist as seller profiles in this POC.">
              <select name="managerSellerId" className={selectClassName} defaultValue="">
                <option value="">No manager</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-1">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input name="isFullTime" type="checkbox" defaultChecked />
                Full-time employee
              </label>
              <p className="text-xs leading-5 text-muted-foreground">Use for employee staffing status. For non-employees, leave unchecked unless the business wants to track full-time contractor participation.</p>
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
              <Badge>Mock profile</Badge>
              <SubmitButton>Create seller</SubmitButton>
            </div>
          </form>
        </FormPanel>
      </section>
    </div>
  );
}
