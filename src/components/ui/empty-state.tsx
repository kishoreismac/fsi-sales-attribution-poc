import { CircleDashed } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="flex min-h-[220px] items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-muted text-primary">
          <CircleDashed size={20} aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </Card>
  );
}

