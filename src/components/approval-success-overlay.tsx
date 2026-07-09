"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type ApprovalSuccessOverlayProps = {
  assignmentNumber?: string;
};

const CONFETTI = [
  { left: "12%", delay: "0ms", color: "bg-primary", rotate: "12deg" },
  { left: "20%", delay: "90ms", color: "bg-teal-400", rotate: "-18deg" },
  { left: "31%", delay: "30ms", color: "bg-amber-400", rotate: "24deg" },
  { left: "43%", delay: "130ms", color: "bg-sky-400", rotate: "-8deg" },
  { left: "54%", delay: "70ms", color: "bg-primary", rotate: "18deg" },
  { left: "66%", delay: "160ms", color: "bg-emerald-400", rotate: "-24deg" },
  { left: "77%", delay: "40ms", color: "bg-amber-400", rotate: "10deg" },
  { left: "86%", delay: "110ms", color: "bg-teal-400", rotate: "-14deg" }
];

export function ApprovalSuccessOverlay({ assignmentNumber }: ApprovalSuccessOverlayProps) {
  const [visible, setVisible] = useState(Boolean(assignmentNumber));
  const label = useMemo(() => assignmentNumber?.trim() || "Assignment", [assignmentNumber]);

  useEffect(() => {
    if (!assignmentNumber) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const hideTimer = window.setTimeout(() => setVisible(false), 2600);
    const cleanUrlTimer = window.setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("approved");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }, 2800);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(cleanUrlTimer);
    };
  }, [assignmentNumber]);

  if (!visible || !assignmentNumber) {
    return null;
  }

  return (
    <div
      className="approval-success-backdrop fixed inset-0 z-50 grid place-items-center bg-background/82 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-3xl overflow-hidden">
        {CONFETTI.map((piece, index) => (
          <span
            key={`${piece.left}-${index}`}
            className={`approval-confetti absolute top-8 h-3 w-2 rounded-[2px] ${piece.color}`}
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              transform: `rotate(${piece.rotate})`
            }}
          />
        ))}
      </div>

      <div className="approval-success-card relative w-full max-w-sm rounded-lg border border-border bg-surface p-8 text-center shadow-focus">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-8 ring-emerald-100">
          <CheckCircle2 className="approval-success-check size-12" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-primary">Approved</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">{label}</h2>
        <p className="mt-3 text-sm text-muted-foreground">Assignment approved for the next crediting step.</p>
      </div>
    </div>
  );
}
