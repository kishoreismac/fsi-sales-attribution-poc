import { cookies } from "next/headers";
import { cache } from "react";
import { demoRoleLabels, hasPermission, isDemoRole, type DemoRole, type Permission } from "@/lib/auth/permissions";

export const DEMO_ROLE_COOKIE = "fsi_demo_role";
export const DEFAULT_DEMO_ROLE: DemoRole = "SALES_COMP_ADMIN";

export const getDemoSession = cache(async () => {
  const cookieStore = await cookies();
  const cookieRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  const role = isDemoRole(cookieRole) ? cookieRole : DEFAULT_DEMO_ROLE;

  return {
    role,
    label: demoRoleLabels[role],
    isPocSession: true
  };
});

export async function can(permission: Permission) {
  const session = await getDemoSession();
  return hasPermission(session.role, permission);
}

export async function requirePermission(permission: Permission) {
  const session = await getDemoSession();

  if (!hasPermission(session.role, permission)) {
    throw new Error(`Unauthorized demo action for ${session.label}.`);
  }

  return session;
}

