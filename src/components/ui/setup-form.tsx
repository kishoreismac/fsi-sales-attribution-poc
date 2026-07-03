import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SuccessMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">
      <CheckCircle2 size={16} aria-hidden="true" />
      {children}
    </div>
  );
}

export function FormPanel({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

export function Field({
  label,
  description,
  children
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>
        {label}
        {description ? <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">{description}</span> : null}
      </span>
      {children}
    </label>
  );
}

export const inputClassName = "h-10 rounded-md border border-border bg-white px-3 text-sm";
export const selectClassName = "h-10 rounded-md border border-border bg-white px-3 text-sm";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return <button className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">{children}</button>;
}

export function ToggleButton({
  id,
  nextActive,
  action
}: {
  id: string;
  nextActive: boolean;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="active" value={String(nextActive)} />
      <button className="h-9 rounded-md border border-border bg-white px-3 text-xs font-semibold">
        {nextActive ? "Activate" : "Deactivate"}
      </button>
    </form>
  );
}
