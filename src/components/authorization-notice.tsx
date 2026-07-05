import { LockKeyhole } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AuthorizationNotice({
  title = "Action unavailable",
  description
}: {
  title?: string;
  description: string;
}) {
  return (
    <Card className="border-amber-200 bg-amber-50 p-5 text-amber-950">
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-100">
          <LockKeyhole size={18} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-1 text-sm">{description}</p>
        </div>
      </div>
    </Card>
  );
}

