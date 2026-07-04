import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SuccessMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-900 shadow-sm">
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
    <Card className="p-5">
      <div>
        <h2 className="text-base font-semibold tracking-normal">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
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
    <label className="grid gap-2 text-sm font-semibold">
      <span>
        {label}
        {description ? <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">{description}</span> : null}
      </span>
      {children}
    </label>
  );
}

export const inputClassName = "h-10 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:shadow-focus";
export const selectClassName = "h-10 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:shadow-focus";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return <button className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95">{children}</button>;
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
      <button className="h-9 rounded-md border border-border bg-white px-3 text-xs font-semibold shadow-sm transition hover:bg-muted">
        {nextActive ? "Activate" : "Deactivate"}
      </button>
    </form>
  );
}
