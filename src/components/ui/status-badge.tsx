import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Draft: "border-slate-300 bg-slate-100 text-slate-700",
  Submitted: "border-blue-200 bg-blue-50 text-blue-800",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Available: "border-slate-300 bg-slate-100 text-slate-700",
  Selected: "border-blue-200 bg-blue-50 text-blue-800",
  "Credit Eligible": "border-emerald-200 bg-emerald-50 text-emerald-800",
  Calculated: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Ready For Calculation": "border-blue-200 bg-blue-50 text-blue-800",
  "No Matching Assignment": "border-amber-200 bg-amber-50 text-amber-800",
  "Approved, Not Active": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Approved For Crediting": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Approved For Visibility": "border-sky-200 bg-sky-50 text-sky-800",
  "Future Approved For Crediting": "border-amber-200 bg-amber-50 text-amber-800",
  "Future Approved For Visibility": "border-sky-200 bg-sky-50 text-sky-800",
  Passed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Active: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Active For Crediting": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Active For Visibility": "border-sky-200 bg-sky-50 text-sky-800",
  Rejected: "border-rose-200 bg-rose-50 text-rose-800",
  Expired: "border-zinc-300 bg-zinc-100 text-zinc-700",
  Error: "border-rose-200 bg-rose-50 text-rose-800",
  Warning: "border-amber-200 bg-amber-50 text-amber-800",
  "Not Applicable": "border-zinc-300 bg-zinc-100 text-zinc-700"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center whitespace-nowrap rounded-md border px-2.5 text-xs font-semibold leading-none",
        statusStyles[status] ?? "border-border bg-muted text-foreground"
      )}
    >
      {status}
    </span>
  );
}
