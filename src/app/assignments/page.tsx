import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { can } from "@/lib/auth/session";
import { listAssignments } from "@/lib/data/assignments";
import { formatDate, formatEnum } from "@/lib/setup-options";

export default async function AssignmentsPage() {
  const [canCreate, assignments] = await Promise.all([can("assignments:create"), listAssignments()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workbench"
        title="Assignment workbench"
        description="Customer plus product group credit assignments with allocation, role behavior, effective dates, and validation status."
        actions={
          canCreate ? (
            <Link
              href="/assignments/new"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-panel"
            >
              <Plus size={16} aria-hidden="true" />
              New assignment
            </Link>
          ) : null
        }
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Assignment</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Product group</th>
                <th className="px-4 py-3 font-medium">Seller</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Allocation</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Validation</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {assignments.map((assignment) => {
                const errorCount = assignment.validationResults.filter((result) => result.severity === "ERROR").length;
                const warningCount = assignment.validationResults.filter((result) => result.severity === "WARNING").length;
                const validationStatus = errorCount > 0 ? "Error" : warningCount > 0 ? "Warning" : "Approved";

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
                      <StatusBadge status={formatEnum(assignment.status).replace(" ", "")} />
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

