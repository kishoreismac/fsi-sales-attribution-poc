import { Download } from "lucide-react";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SortLink } from "@/components/ui/sort-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listApprovedAssignmentExportRows } from "@/lib/data/exports";
import { formatDate, formatEnum } from "@/lib/setup-options";
import { sortDirection, sortRows, type SortParams } from "@/lib/table-sort";

export default async function ExportsPage({
  searchParams
}: {
  searchParams: Promise<SortParams>;
}) {
  const [allowed, session, params] = await Promise.all([can("exports:approvedAssignments"), getDemoSession(), searchParams]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Exports Are Admin-Only"
        description={`${session.label} can view allowed reporting areas, but approved assignment exports are limited to Sales Compensation Admins in this POC.`}
      />
    );
  }

  const rows = await listApprovedAssignmentExportRows();
  const direction = sortDirection(params.dir);
  const sortedRows = sortRows(rows, direction, (assignment) => {
    switch (params.sort) {
      case "customer":
        return assignment.customer.name;
      case "product":
        return assignment.productGroup.name;
      case "seller":
        return assignment.seller.name;
      case "role":
        return assignment.role.name;
      case "allocation":
        return Number(assignment.allocationPercent);
      case "dates":
        return assignment.startDate;
      case "status":
        return formatEnum(assignment.status);
      case "assignment":
      default:
        return assignment.assignmentNumber;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Output"
        title="Export Center"
        description="Approved assignment datasets prepared for future Salesforce, Power BI, and calculation use."
        actions={
          <a
            href="/exports/approved-assignments"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Download size={16} aria-hidden="true" />
            Download CSV
          </a>
        }
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Approved Assignments</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {rows.length} rows include customer, product group, seller, role, allocation, dates, and status.
            </p>
          </div>
          <StatusBadge status={rows.length > 0 ? "Approved" : "Warning"} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium"><SortLink label="Assignment" sortKey="assignment" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Customer" sortKey="customer" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Product Group" sortKey="product" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Seller" sortKey="seller" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Role" sortKey="role" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Allocation" sortKey="allocation" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Dates" sortKey="dates" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Status" sortKey="status" currentSort={params.sort} currentDir={direction} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {sortedRows.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-4 py-3 font-medium">{assignment.assignmentNumber}</td>
                  <td className="px-4 py-3">{assignment.customer.name}</td>
                  <td className="px-4 py-3">{assignment.productGroup.name}</td>
                  <td className="px-4 py-3">{assignment.seller.name}</td>
                  <td className="px-4 py-3">{assignment.role.name}</td>
                  <td className="px-4 py-3">{assignment.allocationPercent.toString()}%</td>
                  <td className="px-4 py-3">
                    {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={formatEnum(assignment.status).replace(" ", "")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
