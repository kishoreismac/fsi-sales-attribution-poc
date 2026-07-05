import Link from "next/link";
import { RefreshCcw } from "lucide-react";
import { revalidateAllAssignments } from "@/app/actions/assignments";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { getValidationSummary, listValidationGroups } from "@/lib/data/validation";
import { formatDate, formatEnum } from "@/lib/setup-options";
import { validationRuleFix, validationRuleLabel } from "@/lib/validation/display";

function validationStatus(severity: string) {
  if (severity === "ERROR") {
    return "Error";
  }

  if (severity === "WARNING") {
    return "Warning";
  }

  return "Approved";
}

export default async function ValidatorPage() {
  const [allowed, session] = await Promise.all([can("validator:view"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Validator is not available for this role"
        description={`${session.label} cannot access split validation in this POC role configuration.`}
      />
    );
  }

  const [groups, summary] = await Promise.all([listValidationGroups(), getValidationSummary()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Validation"
        title="Split validator"
        description="Grouped allocation checks for direct seller splits, LPS limits, overlay behavior, inactive sellers, and date overlaps."
        actions={
          <form action={revalidateAllAssignments}>
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:brightness-95">
              <RefreshCcw size={16} aria-hidden="true" />
              Revalidate all
            </button>
          </form>
        }
      />

      <section className="grid gap-4 md:grid-cols-4" aria-label="Validation summary">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Assignments checked</p>
          <p className="mt-2 text-3xl font-semibold">{summary.assignmentCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Errors</p>
          <p className="mt-2 text-3xl font-semibold text-danger">{summary.errorCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Warnings</p>
          <p className="mt-2 text-3xl font-semibold text-warning">{summary.warningCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Passed checks</p>
          <p className="mt-2 text-3xl font-semibold text-success">{summary.infoCount}</p>
        </Card>
      </section>

      <div className="grid gap-4">
        {groups.length > 0 ? (
          groups.map((group) => (
            <Card key={group.key} className="overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold">
                      {group.customer.name} / {group.productGroup.name}
                    </h2>
                    <StatusBadge status={group.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Effective from {formatDate(group.startDate)} / {group.errorCount} errors / {group.warningCount} warnings / {group.infoCount} passed checks
                  </p>
                </div>
                <Badge>{group.key}</Badge>
              </div>
              <div className="divide-y divide-border">
                {group.results.map((result) => (
                  <div key={result.id} className="grid gap-3 px-4 py-3 text-sm lg:grid-cols-[220px_1fr_180px_120px] lg:items-center">
                    <div>
                      <p className="font-medium">{validationRuleLabel(result.ruleCode)}</p>
                      <p className="text-xs text-muted-foreground">{formatEnum(result.severity)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{result.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Recommended fix: {validationRuleFix(result.ruleCode)}</p>
                    </div>
                    <div>
                      <p className="font-medium">{result.assignment.seller.name}</p>
                      <p className="text-xs text-muted-foreground">{result.assignment.role.name}</p>
                    </div>
                    <div className="flex items-center gap-2 lg:justify-end">
                      <StatusBadge status={validationStatus(result.severity)} />
                      <Link
                        href={`/assignments/${result.assignmentId}`}
                        className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-semibold"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <h2 className="text-lg font-semibold">No validation results yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Run validation after creating assignments to populate split checks.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
