import Link from "next/link";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Eye, MessageSquareText, XCircle } from "lucide-react";
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
  const blockedCount = assignments.filter((assignment) =>
    assignment.validationResults.some((result) => result.severity === "ERROR")
  ).length;
  const warningCount = assignments.filter(
    (assignment) =>
      !assignment.validationResults.some((result) => result.severity === "ERROR") &&
      assignment.validationResults.some((result) => result.severity === "WARNING")
  ).length;
  const cleanCount = assignments.length - blockedCount - warningCount;

  return (
    <div className="space-y-6">
      <div className="ui-original-only">
        <PageHeader
          eyebrow="Review"
          title="Approval queue"
          description="Submitted assignments awaiting manager approval or rejection with comments."
        />
      </div>
      <div className="ui-new-only">
        <PageHeader
          eyebrow="Review center"
          title="Approval queue"
          description="Review submitted assignments, scan validation risk, and record approval decisions with comments."
        />
      </div>

      {assignments.length > 0 ? (
        <>
          <section className="ui-new-only grid gap-4 md:grid-cols-3" aria-label="Approval summary">
            <Card className="ui-approval-summary p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Submitted</p>
                  <p className="mt-2 text-3xl font-semibold">{assignments.length}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <ClipboardCheck size={20} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">Assignments currently waiting for manager review.</p>
            </Card>
            <Card className="ui-approval-summary p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Ready to approve</p>
                  <p className="mt-2 text-3xl font-semibold">{cleanCount}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={20} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">No validation errors or warnings detected.</p>
            </Card>
            <Card className="ui-approval-summary p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Needs attention</p>
                  <p className="mt-2 text-3xl font-semibold">{blockedCount + warningCount}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                  <AlertTriangle size={20} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">Assignments with validation warnings or blocking errors.</p>
            </Card>
          </section>

          <div className="grid gap-4">
            {assignments.map((assignment) => {
              const errorCount = assignment.validationResults.filter((result) => result.severity === "ERROR").length;
              const assignmentWarningCount = assignment.validationResults.filter((result) => result.severity === "WARNING").length;
              const validationStatus = errorCount > 0 ? "Error" : assignmentWarningCount > 0 ? "Warning" : "Approved";

              return (
                <Card key={assignment.id} className="overflow-hidden">
                  <div className="ui-original-approval-grid grid gap-0 xl:grid-cols-[8px_minmax(0,1fr)_380px]">
                    <div className={errorCount > 0 ? "ui-original-approval-rail h-2 bg-danger xl:h-auto" : assignmentWarningCount > 0 ? "ui-original-approval-rail h-2 bg-warning xl:h-auto" : "ui-original-approval-rail h-2 bg-success xl:h-auto"} />
                  <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">{assignment.assignmentNumber}</h2>
                        <StatusBadge status="Submitted" />
                        <StatusBadge status={validationStatus} />
                      </div>
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-xs font-semibold shadow-sm transition hover:bg-muted hover:text-primary"
                      >
                        <Eye size={14} aria-hidden="true" />
                        View detail
                      </Link>
                    </div>

                    <div className="mt-4 rounded-md border border-border bg-surface-soft p-4">
                      <div className="grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">Customer</p>
                          <p className="mt-1 font-medium">{assignment.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">Product group</p>
                          <p className="mt-1 font-medium">{assignment.productGroup.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">Seller / role</p>
                          <p className="mt-1 font-medium">
                            {assignment.seller.name} / {assignment.role.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-muted-foreground">Allocation and dates</p>
                          <p className="mt-1 font-medium">
                            {assignment.allocationPercent.toString()}% / {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {assignment.validationResults.length > 0 ? (
                      <div className="mt-4 rounded-md border border-border bg-muted/70 p-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold">Validation summary</p>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {errorCount} errors / {assignmentWarningCount} warnings
                          </span>
                        </div>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          {assignment.validationResults.slice(0, 3).map((result) => (
                            <li key={result.id}>{result.message}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="ui-original-approval-actions grid gap-3 border-t border-border bg-surface-soft p-4 xl:border-l xl:border-t-0">
                    <form action={approveAssignment} className="rounded-md border border-border bg-surface p-4 shadow-sm">
                      <input type="hidden" name="id" value={assignment.id} />
                      <label className="grid gap-2 text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <MessageSquareText size={15} aria-hidden="true" />
                          Approval comment
                        </span>
                        <textarea
                          name="comments"
                          className="min-h-20 rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:shadow-focus"
                          placeholder="Approved for assignment crediting."
                        />
                      </label>
                      <button
                        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={errorCount > 0}
                      >
                        <CheckCircle2 size={16} aria-hidden="true" />
                        {errorCount > 0 ? "Resolve errors before approval" : "Approve"}
                      </button>
                    </form>

                    <form action={rejectAssignment} className="rounded-md border border-border bg-surface p-4 shadow-sm">
                      <input type="hidden" name="id" value={assignment.id} />
                      <label className="grid gap-2 text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <MessageSquareText size={15} aria-hidden="true" />
                          Rejection comment
                        </span>
                        <textarea
                          name="comments"
                          required
                          className="min-h-20 rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-sm transition focus:border-primary focus:shadow-focus"
                          placeholder="Explain what needs to change before approval."
                        />
                      </label>
                      <button className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
                        <XCircle size={16} aria-hidden="true" />
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold">No assignments need review</h2>
          <p className="mt-2 text-sm text-muted-foreground">Submitted assignments will appear here when admins send them for manager review.</p>
        </Card>
      )}
    </div>
  );
}

