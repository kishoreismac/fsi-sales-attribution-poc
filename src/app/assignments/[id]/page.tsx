import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidateAssignment, submitAssignment } from "@/app/actions/assignments";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { can } from "@/lib/auth/session";
import { getAssignmentById } from "@/lib/data/assignments";
import { formatDate, formatEnum } from "@/lib/setup-options";
import { validationRuleFix, validationRuleLabel } from "@/lib/validation/display";

function validationBadge(severity: string) {
  if (severity === "ERROR") {
    return "Error";
  }
  if (severity === "WARNING") {
    return "Warning";
  }
  return "Approved";
}

export default async function AssignmentDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const [{ id }, query, canSubmit, canCreate] = await Promise.all([
    params,
    searchParams,
    can("assignments:submit"),
    can("assignments:create")
  ]);
  const assignment = await getAssignmentById(id);

  if (!assignment) {
    notFound();
  }

  const hasValidationErrors = assignment.validationResults.some((result) => result.severity === "ERROR");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assignment detail"
        title={`${assignment.assignmentNumber}`}
        description="Validation status, approval trail, and effective-dated history for the selected assignment."
        actions={
          <Link href="/assignments" className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
            Back to workbench
          </Link>
        }
      />

      {query.created ? (
        <Card className="border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
          Assignment {query.created === "submitted" ? "submitted for review" : "saved as draft"}.
        </Card>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Current status</p>
              <p className="mt-1 text-lg font-semibold">{formatEnum(assignment.status)}</p>
            </div>
            <StatusBadge status={formatEnum(assignment.status).replace(" ", "")} />
          </div>

          <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Customer</dt>
              <dd className="font-medium">{assignment.customer.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Product group</dt>
              <dd className="font-medium">{assignment.productGroup.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Seller</dt>
              <dd className="font-medium">{assignment.seller.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium">{assignment.role.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Allocation</dt>
              <dd className="font-medium">{assignment.allocationPercent.toString()}%</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Effective dates</dt>
              <dd className="font-medium">
                {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
              </dd>
            </div>
          </dl>

          {assignment.reasonNotes ? (
            <div className="mt-5 rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Reason / notes</p>
              <p className="mt-1 text-muted-foreground">{assignment.reasonNotes}</p>
            </div>
          ) : null}
        </Card>

        <Card className="p-4">
          <h2 className="text-base font-semibold">Actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Actions are guarded by server-side permissions.</p>
          <div className="mt-4 grid gap-2">
            {canCreate ? (
              <form action={revalidateAssignment}>
                <input type="hidden" name="id" value={assignment.id} />
                <button className="h-10 w-full rounded-md border border-border bg-surface px-4 text-sm font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
                  Revalidate assignment
                </button>
              </form>
            ) : null}
            {canSubmit && assignment.status === "DRAFT" ? (
              <form action={submitAssignment}>
                <input type="hidden" name="id" value={assignment.id} />
                <button className="h-10 w-full rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:brightness-95">
                  Submit for review
                </button>
              </form>
            ) : null}
            {hasValidationErrors ? <Badge className="border-rose-200 bg-rose-50 text-rose-800">Not ready for approval</Badge> : null}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Validation results</h2>
          </div>
          <div className="divide-y divide-border">
            {assignment.validationResults.length > 0 ? (
              assignment.validationResults.map((result) => (
                <div key={result.id} className="flex items-start justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{validationRuleLabel(result.ruleCode)}</p>
                    <p className="mt-1 text-muted-foreground">{result.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Recommended fix: {validationRuleFix(result.ruleCode)}</p>
                  </div>
                  <StatusBadge status={validationBadge(result.severity)} />
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-muted-foreground">No validation results yet.</p>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Approval history</h2>
          </div>
          <div className="divide-y divide-border">
            {assignment.approvalHistory.length > 0 ? (
              assignment.approvalHistory.map((event) => (
                <div key={event.id} className="px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium">{formatEnum(event.decision)}</p>
                    <p className="text-muted-foreground">{formatDate(event.decidedAt)}</p>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {event.approver.name}
                    {event.comments ? `: ${event.comments}` : ""}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-muted-foreground">No approval history yet.</p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
