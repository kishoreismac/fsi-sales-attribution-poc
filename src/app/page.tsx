import { ArrowRight, ClipboardCheck, FileWarning, History, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatDate, formatEnum } from "@/lib/setup-options";
import { validationStatusFor } from "@/lib/validation/status";

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
    { label: "Active Assignments", value: dashboard.metrics.activeAssignments, icon: ClipboardCheck },
    { label: "Pending Approval", value: dashboard.metrics.pendingApproval, icon: Users },
    { label: "Validation Failures", value: dashboard.metrics.validationFailures, icon: FileWarning },
    { label: "Audit Events", value: dashboard.metrics.auditEvents, icon: History }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="POC Dashboard"
        title="Sales Attribution Workbench"
        description={`Current demo role: ${session.label}. Live assignment status, validation health, and audit activity for the client demo.`}
        actions={
          canCreateAssignment ? (
            <Link
              href="/assignments/new"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
            >
              New Assignment
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ) : null
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-normal">{metric.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-muted text-primary">
                  <Icon size={20} aria-hidden="true" />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-soft px-4 py-3">
            <h2 className="text-base font-semibold">Assignment Queue</h2>
            <Link href="/assignments" className="text-sm font-semibold text-primary">
              View All
            </Link>
          </div>
          {dashboard.queue.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Assignment</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Product Group</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {dashboard.queue.map((item) => {
                    const hasErrors = validationStatusFor(item.status, item.validationResults) === "Error";
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <Link href={`/assignments/${item.id}`} className="font-semibold text-primary">
                            {item.assignmentNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{item.customer.name}</td>
                        <td className="px-4 py-3">{item.productGroup.name}</td>
                        <td className="px-4 py-3">{item.seller.name}</td>
                        <td className="px-4 py-3">
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
              <h2 className="text-lg font-semibold">No Queue Items</h2>
              <p className="mt-2 text-sm text-muted-foreground">Submitted assignments and validation errors will appear here.</p>
            </div>
          )}
        </Card>

        <div className="grid gap-4">
          <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Demo Scope</h2>
                <p className="mt-1 text-sm text-muted-foreground">POC-first, future-ready foundation.</p>
              </div>
              <Badge>Mock Data</Badge>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-6">
              <p>Role configuration, assignment validation, approval history, credit calculation, payments, and exports are in scope.</p>
              <p className="text-muted-foreground">
                Live Workday, SAP/JDE/SAC, Salesforce, Power BI, and payroll integrations remain future phases.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-soft px-4 py-3">
              <h2 className="text-base font-semibold">Recent Audit</h2>
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
