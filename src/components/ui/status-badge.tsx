import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Draft: "border-slate-300 bg-slate-100 text-slate-700",
  Submitted: "border-sky-200 bg-sky-50 text-sky-800",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Active: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Rejected: "border-rose-200 bg-rose-50 text-rose-800",
  Expired: "border-zinc-300 bg-zinc-100 text-zinc-700",
  Error: "border-rose-200 bg-rose-50 text-rose-800",
  Warning: "border-amber-200 bg-amber-50 text-amber-800"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "ui-status-badge inline-flex min-h-6 items-center rounded-md border px-2.5 text-xs font-semibold leading-none",
        statusStyles[status] ?? "border-border bg-muted text-foreground"
      )}
    >
      {status}
    </span>
  );
}
