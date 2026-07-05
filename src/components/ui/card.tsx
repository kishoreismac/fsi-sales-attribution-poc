import { cn } from "@/lib/utils";

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("ui-card rounded-lg border border-border/80 bg-surface shadow-panel", className)}>{children}</div>;
}
