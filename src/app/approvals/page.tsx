import Link from "next/link";
import { approveAssignment, rejectAssignment } from "@/app/actions/assignments";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listSubmittedAssignments } from "@/lib/data/assignments";
import { formatDate } from "@/lib/setup-options";

export default async function ApprovalsPage() {
  const [allowed, session] = await Promise.all([can("assignments:approve"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Approval queue is manager-only"
        description={`${session.label} cannot approve or reject assignments. Approval decisions are limited to Sales Managers in this POC.`}
      />
    );
  }

  const assignments = await listSubmittedAssignments();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Review"
        title="Approval queue"
        description="Submitted assignments awaiting manager approval or rejection with comments."
      />

      {assignments.length > 0 ? (
        <div className="grid gap-4">
          {assignments.map((assignment) => {
            const errorCount = assignment.validationResults.filter((result) => result.severity === "ERROR").length;
            const warningCount = assignment.validationResults.filter((result) => result.severity === "WARNING").length;
            const validationStatus = errorCount > 0 ? "Error" : warningCount > 0 ? "Warning" : "Approved";

            return (
              <Card key={assignment.id} className="overflow-hidden">
                <div className="grid gap-4 p-4 xl:grid-cols-[1fr_360px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold">{assignment.assignmentNumber}</h2>
                      <StatusBadge status="Submitted" />
                      <StatusBadge status={validationStatus} />
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">Customer</dt>
                        <dd className="font-medium">{assignment.customer.name}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Product group</dt>
                        <dd className="font-medium">{assignment.productGroup.name}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Seller / role</dt>
                        <dd className="font-medium">
                          {assignment.seller.name} / {assignment.role.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Allocation and dates</dt>
                        <dd className="font-medium">
                          {assignment.allocationPercent.toString()}% / {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
                        </dd>
                      </div>
                    </dl>
                    {assignment.validationResults.length > 0 ? (
                      <div className="mt-4 rounded-md bg-muted p-3 text-sm">
                        <p className="font-medium">Validation summary</p>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          {assignment.validationResults.slice(0, 3).map((result) => (
                            <li key={result.id}>{result.message}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <Link
                      href={`/assignments/${assignment.id}`}
                      className="mt-4 inline-flex h-9 items-center rounded-md border border-border bg-white px-3 text-xs font-semibold"
                    >
                      View assignment detail
                    </Link>
                  </div>

                  <div className="grid gap-3">
                    <form action={approveAssignment} className="rounded-md border border-border bg-white p-3">
                      <input type="hidden" name="id" value={assignment.id} />
                      <label className="grid gap-2 text-sm font-medium">
                        Approval comment
                        <textarea
                          name="comments"
                          className="min-h-20 rounded-md border border-border bg-white px-3 py-2 text-sm"
                          placeholder="Approved for assignment crediting."
                        />
                      </label>
                      <button
                        className="mt-3 h-10 w-full rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={errorCount > 0}
                      >
                        {errorCount > 0 ? "Resolve errors before approval" : "Approve"}
                      </button>
                    </form>

                    <form action={rejectAssignment} className="rounded-md border border-border bg-white p-3">
                      <input type="hidden" name="id" value={assignment.id} />
                      <label className="grid gap-2 text-sm font-medium">
                        Rejection comment
                        <textarea
                          name="comments"
                          required
                          className="min-h-20 rounded-md border border-border bg-white px-3 py-2 text-sm"
                          placeholder="Explain what needs to change before approval."
                        />
                      </label>
                      <button className="mt-3 h-10 w-full rounded-md border border-border bg-white px-4 text-sm font-semibold">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold">No assignments need review</h2>
          <p className="mt-2 text-sm text-muted-foreground">Submitted assignments will appear here when admins send them for manager review.</p>
        </Card>
      )}
    </div>
  );
}

