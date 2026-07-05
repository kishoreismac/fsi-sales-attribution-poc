import { AuthorizationNotice } from "@/components/authorization-notice";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { listAuditEvents } from "@/lib/data/audit";
import { formatDate } from "@/lib/setup-options";

function actionStatus(action: string) {
  if (action.includes("REJECT") || action.includes("BLOCKED")) {
    return "Error";
  }

  if (action.includes("VALIDATE")) {
    return "Warning";
  }

  return "Approved";
}

export default async function HistoryPage() {
  const [allowed, session] = await Promise.all([can("audit:view"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="History is not available for this role"
        description={`${session.label} cannot access audit history in this POC role configuration.`}
      />
    );
  }

  const events = await listAuditEvents();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit"
        title="Assignment history"
        description="Audit events for create, update, submit, approve, reject, validation, and export actions."
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Object</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Comment</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-3">{formatDate(event.createdAt)}</td>
                  <td className="px-4 py-3 font-medium">{event.action}</td>
                  <td className="px-4 py-3">
                    {event.objectType} / {event.objectId}
                  </td>
                  <td className="px-4 py-3">{event.actor?.name ?? "System event"}</td>
                  <td className="px-4 py-3">{event.comment ?? "No comment recorded."}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={actionStatus(event.action)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {events.length === 0 ? (
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold">No audit events yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Setup, assignment, approval, validation, and export actions will appear here.</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

