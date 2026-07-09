import { setDemoRole } from "@/app/actions/demo-session";
import { demoRoleDescriptions, demoRoleLabels, type DemoRole } from "@/lib/auth/permissions";

const roles = Object.entries(demoRoleLabels) as Array<[DemoRole, string]>;

export function DemoRoleSwitcher({ currentRole }: { currentRole: DemoRole }) {
  return (
    <form action={setDemoRole} className="mx-3 mb-4 grid gap-2 rounded-lg border border-border bg-surface-soft p-4">
      <label htmlFor="demo-role" className="text-xs font-bold uppercase tracking-wide text-primary">
        Demo Role
      </label>
      <select
        key={currentRole}
        id="demo-role"
        name="role"
        defaultValue={currentRole}
        className="h-10 rounded-md border border-border bg-surface px-3 text-sm shadow-sm transition focus:border-primary focus:shadow-focus"
      >
        {roles.map(([role, label]) => (
          <option key={role} value={role}>
            {label}
          </option>
        ))}
      </select>
      <button className="h-9 rounded-md bg-primary px-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:brightness-95">
        Apply Role
      </button>
      <p className="text-xs leading-5 text-muted-foreground">{demoRoleDescriptions[currentRole]}</p>
    </form>
  );
}
