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
        "inline-flex min-h-6 items-center rounded-md border border-border bg-muted px-2.5 text-xs font-semibold leading-none text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
