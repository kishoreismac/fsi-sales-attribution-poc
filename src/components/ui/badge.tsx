import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "ui-badge inline-flex min-h-6 items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 text-xs font-semibold leading-none text-primary shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
