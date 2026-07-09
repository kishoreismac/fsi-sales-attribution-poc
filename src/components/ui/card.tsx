import { cn } from "@/lib/utils";

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("rounded-lg border border-border bg-surface shadow-panel", className)}>{children}</div>;
}
