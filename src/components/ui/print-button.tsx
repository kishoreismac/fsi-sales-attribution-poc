"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print Statement" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:bg-muted"
    >
      <Printer size={16} aria-hidden="true" />
      {label}
    </button>
  );
}
