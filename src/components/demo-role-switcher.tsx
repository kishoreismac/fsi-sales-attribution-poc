import { setDemoRole } from "@/app/actions/demo-session";
import { demoRoleDescriptions, demoRoleLabels, type DemoRole } from "@/lib/auth/permissions";

const roles = Object.entries(demoRoleLabels) as Array<[DemoRole, string]>;

export function DemoRoleSwitcher({ currentRole }: { currentRole: DemoRole }) {
  return (
    <form action={setDemoRole} className="grid gap-2 border-t border-border px-5 py-4">
      <label htmlFor="demo-role" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Demo role
      </label>
      <select
        id="demo-role"
        name="role"
        defaultValue={currentRole}
        className="h-10 rounded-md border border-border bg-white px-3 text-sm"
      >
        {roles.map(([role, label]) => (
          <option key={role} value={role}>
            {label}
          </option>
        ))}
      </select>
      <button className="h-9 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground">
        Apply role
      </button>
      <p className="text-xs leading-5 text-muted-foreground">{demoRoleDescriptions[currentRole]}</p>
    </form>
  );
}

