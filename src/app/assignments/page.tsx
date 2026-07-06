import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { SortLink } from "@/components/ui/sort-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { can } from "@/lib/auth/session";
import { listAssignments } from "@/lib/data/assignments";
import { formatDate, formatEnum } from "@/lib/setup-options";
import { sortDirection, sortRows, type SortParams } from "@/lib/table-sort";
import { validationStatusFor } from "@/lib/validation/status";

function lifecycleStatusLabel(status: string, isEligibleForCredit: boolean) {
  if (status === "ACTIVE") {
    return isEligibleForCredit ? "Active For Crediting" : "Active For Visibility";
  }

  if (status === "APPROVED") {
    return isEligibleForCredit ? "Future Approved For Crediting" : "Future Approved For Visibility";
  }

  return formatEnum(status);
}

export default async function AssignmentsPage({
  searchParams
}: {
  searchParams: Promise<SortParams>;
}) {
  const [canCreate, assignments, params] = await Promise.all([can("assignments:create"), listAssignments(), searchParams]);
  const direction = sortDirection(params.dir);
  const sortedAssignments = sortRows(assignments, direction, (assignment) => {
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
      case "validation":
        return validationStatusFor(assignment.status, assignment.validationResults);
      case "lifecycle":
        return lifecycleStatusLabel(assignment.status, assignment.role.isEligibleForCredit);
      case "assignment":
      default:
        return assignment.assignmentNumber;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workbench"
        title="Assignment Workbench"
        description="Customer plus product group credit assignments with allocation, role behavior, effective dates, and validation status."
        actions={
          canCreate ? (
            <Link
              href="/assignments/new"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-panel"
            >
              <Plus size={16} aria-hidden="true" />
              New Assignment
            </Link>
          ) : null
        }
      />

      <Card className="overflow-hidden">
        <div className="border-b border-border bg-surface-soft px-4 py-3">
          <h2 className="text-base font-semibold">How To Read This Table</h2>
          <div className="mt-2 grid gap-2 text-sm text-muted-foreground lg:grid-cols-3">
            <p>
              <span className="font-semibold text-foreground">Validation</span> checks whether the assignment data is correct.
            </p>
            <p>
              <span className="font-semibold text-foreground">Active For Crediting</span> means approved, current by date, and used for credit calculations.
            </p>
            <p>
              <span className="font-semibold text-foreground">Future Approved</span> starts later; visibility roles are reporting-only and do not calculate credit.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium"><SortLink label="Assignment" sortKey="assignment" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Customer" sortKey="customer" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Product Group" sortKey="product" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Seller" sortKey="seller" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Role" sortKey="role" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Allocation" sortKey="allocation" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Dates" sortKey="dates" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Validation" sortKey="validation" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Lifecycle" sortKey="lifecycle" currentSort={params.sort} currentDir={direction} /></th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {sortedAssignments.map((assignment) => {
                const validationStatus = validationStatusFor(assignment.status, assignment.validationResults);

                return (
                  <tr key={assignment.id}>
                    <td className="px-4 py-3 font-medium">{assignment.assignmentNumber}</td>
                    <td className="px-4 py-3">{assignment.customer.name}</td>
                    <td className="px-4 py-3">{assignment.productGroup.name}</td>
                    <td className="px-4 py-3">{assignment.seller.name}</td>
                    <td className="px-4 py-3">
                      <p>{assignment.role.name}</p>
                      <p className="text-xs text-muted-foreground">{formatEnum(assignment.role.behavior)}</p>
                    </td>
                    <td className="px-4 py-3">{assignment.allocationPercent.toString()}%</td>
                    <td className="px-4 py-3">
                      {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={validationStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lifecycleStatusLabel(assignment.status, assignment.role.isEligibleForCredit)} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-white px-3 text-xs font-semibold"
                      >
                        <Eye size={14} aria-hidden="true" />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
