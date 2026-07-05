import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Database,
  FileDown,
  FileWarning,
  GitPullRequestArrow,
  History,
  Sparkles,
  Users
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatDate, formatEnum } from "@/lib/setup-options";

function dashboardStatus(status: string, hasErrors: boolean) {
  if (hasErrors) {
    return "Error";
  }

  return formatEnum(status).replace(" ", "");
}

export default async function DashboardPage() {
  const [canCreateAssignment, session, dashboard] = await Promise.all([
    can("assignments:create"),
    getDemoSession(),
    getDashboardData()
  ]);

  const metrics = [
    { label: "Active assignments", value: dashboard.metrics.activeAssignments, icon: ClipboardCheck },
    { label: "Pending approval", value: dashboard.metrics.pendingApproval, icon: Users },
    { label: "Validation failures", value: dashboard.metrics.validationFailures, icon: FileWarning },
    { label: "Audit events", value: dashboard.metrics.auditEvents, icon: History }
  ];
  const workflow: Array<{ label: string; description: string; icon: typeof Database; href: Route }> = [
    { label: "Setup", description: "Sellers, roles, customers, and product groups", icon: Database, href: "/sellers" },
    { label: "Assign", description: "Build customer and product credit ownership", icon: GitPullRequestArrow, href: "/assignments" },
    { label: "Validate", description: "Catch split issues before manager review", icon: FileWarning, href: "/validator" },
    { label: "Approve", description: "Record manager decision history", icon: ClipboardCheck, href: "/approvals" },
    { label: "Preview", description: "Model invoice credit before export", icon: BarChart3, href: "/credit-preview" },
    { label: "Export", description: "Prepare approved assignment extracts", icon: FileDown, href: "/exports" }
  ];

  return (
    <div className="space-y-6">
      <div className="ui-original-only">
        <PageHeader
          eyebrow="POC dashboard"
          title="Sales attribution workbench"
          description={`Current demo role: ${session.label}. Live assignment status, validation health, and audit activity for the client demo.`}
          actions={
            canCreateAssignment ? (
              <Link
                href="/assignments/new"
                className="ui-original-inline-flex hidden h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
              >
                New assignment
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ) : null
          }
        />
      </div>

      <section className="ui-new-only ui-dashboard-hero overflow-hidden rounded-md border border-border bg-surface shadow-panel">
        <div className="ui-dashboard-hero-inner grid gap-6 p-5 sm:p-6 xl:grid-cols-[1fr_360px]">
          <div>
            <div className="inline-flex min-h-7 items-center gap-2 rounded-md border border-primary/20 bg-surface/75 px-2.5 text-xs font-bold uppercase text-primary shadow-sm">
              <Sparkles size={14} aria-hidden="true" />
              POC dashboard
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-foreground sm:text-4xl">
              Sales attribution workbench
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Current demo role: {session.label}. Monitor assignment status, approval readiness, validation health, and audit activity from one operating view.
            </p>
            {canCreateAssignment ? (
              <Link
                href="/assignments/new"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:brightness-95"
              >
                New assignment
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          <div className="grid gap-3 rounded-md border border-border/80 bg-surface/82 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-muted-foreground">Operating scope</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-border bg-surface px-3 py-3">
                <p className="text-2xl font-semibold">{dashboard.metrics.pendingApproval}</p>
                <p className="text-xs text-muted-foreground">reviews waiting</p>
              </div>
              <div className="rounded-md border border-border bg-surface px-3 py-3">
                <p className="text-2xl font-semibold">{dashboard.metrics.validationFailures}</p>
                <p className="text-xs text-muted-foreground">blocking issues</p>
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Designed for setup owners, managers, finance reviewers, and export operators in a controlled demo workflow.
            </p>
          </div>
        </div>
      </section>

      <section className="ui-new-only grid gap-3 md:grid-cols-2 xl:grid-cols-6" aria-label="Sales attribution workflow">
        {workflow.map((step, index) => {
          const Icon = step.icon;

          return (
            <Link
              key={step.label}
              href={step.href}
              className="ui-workflow-card group rounded-md border border-border bg-surface p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-primary/35"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
              </div>
              <h2 className="mt-4 text-sm font-semibold">{step.label}</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.description}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,24,40,0.10)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-normal">{metric.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                  <Icon size={20} aria-hidden="true" />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-soft px-5 py-4">
            <div>
              <h2 className="text-base font-semibold">Assignment queue</h2>
              <p className="mt-1 text-xs text-muted-foreground">Submitted work and validation exceptions that need attention.</p>
            </div>
            <Link href="/assignments" className="text-sm font-semibold text-primary">
              View all
            </Link>
          </div>
          {dashboard.queue.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Assignment</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Product group</th>
                    <th className="px-5 py-3 font-medium">Owner</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {dashboard.queue.map((item) => {
                    const hasErrors = item.validationResults.some((result) => result.severity === "ERROR");
                    return (
                      <tr key={item.id}>
                        <td className="px-5 py-4">
                          <Link href={`/assignments/${item.id}`} className="font-semibold text-primary">
                            {item.assignmentNumber}
                          </Link>
                        </td>
                        <td className="px-5 py-4">{item.customer.name}</td>
                        <td className="px-5 py-4">{item.productGroup.name}</td>
                        <td className="px-5 py-4">{item.seller.name}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={dashboardStatus(item.status, hasErrors)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold">No queue items</h2>
              <p className="mt-2 text-sm text-muted-foreground">Submitted assignments and validation errors will appear here.</p>
            </div>
          )}
        </Card>

        <div className="grid gap-4">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Demo scope</h2>
                <p className="mt-1 text-sm text-muted-foreground">POC-first, future-ready foundation.</p>
              </div>
              <Badge>Mock data</Badge>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              {["Role configuration", "Assignment validation", "Approval history", "Credit preview", "Approved exports"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-border bg-surface-soft px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-soft px-4 py-3">
              <h2 className="text-base font-semibold">Recent audit</h2>
              <Link href="/history" className="text-sm font-semibold text-primary">
                History
              </Link>
            </div>
            <div className="divide-y divide-border">
              {dashboard.recentAudit.map((event) => (
                <div key={event.id} className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{event.action}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-muted-foreground">{event.comment ?? `${event.objectType} ${event.objectId}`}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{event.actor?.name ?? "System event"}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
