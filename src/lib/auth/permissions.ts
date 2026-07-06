export type DemoRole = "SALES_COMP_ADMIN" | "SALES_MANAGER" | "SELLER" | "FINANCE" | "IT_SYSTEM_ADMIN";

export type Permission =
  | "dashboard:view"
  | "sellers:manage"
  | "roles:manage"
  | "customersProducts:manage"
  | "assignments:create"
  | "assignments:submit"
  | "assignments:view"
  | "assignments:approve"
  | "validator:view"
  | "creditPreview:view"
  | "payments:process"
  | "audit:view"
  | "exports:approvedAssignments";

export const demoRoleLabels: Record<DemoRole, string> = {
  SALES_COMP_ADMIN: "Sales Compensation Admin",
  SALES_MANAGER: "Sales Manager",
  SELLER: "Seller",
  FINANCE: "Finance",
  IT_SYSTEM_ADMIN: "IT System Admin"
};

export const demoRoleDescriptions: Record<DemoRole, string> = {
  SALES_COMP_ADMIN: "Creates setup records, assignments, submissions, exports, and audit review.",
  SALES_MANAGER: "Reviews submitted assignments and can approve or reject changes.",
  SELLER: "Future read-only view of assigned customers and product groups.",
  FINANCE: "Future read-only view of approved outputs and credit preview.",
  IT_SYSTEM_ADMIN: "Future integration and configuration oversight."
};

const permissionsByRole: Record<DemoRole, Permission[]> = {
  SALES_COMP_ADMIN: [
    "dashboard:view",
    "sellers:manage",
    "roles:manage",
    "customersProducts:manage",
    "assignments:create",
    "assignments:submit",
    "assignments:view",
    "validator:view",
    "creditPreview:view",
    "payments:process",
    "audit:view",
    "exports:approvedAssignments"
  ],
  SALES_MANAGER: [
    "dashboard:view",
    "assignments:view",
    "assignments:approve",
    "validator:view",
    "creditPreview:view",
    "payments:process",
    "audit:view"
  ],
  SELLER: ["dashboard:view", "assignments:view"],
  FINANCE: ["dashboard:view", "assignments:view", "creditPreview:view", "payments:process", "audit:view"],
  IT_SYSTEM_ADMIN: ["dashboard:view", "validator:view", "audit:view"]
};

export function hasPermission(role: DemoRole, permission: Permission) {
  return permissionsByRole[role].includes(permission);
}

export function getPermissionsForRole(role: DemoRole) {
  return permissionsByRole[role];
}

export function isDemoRole(value: string | undefined): value is DemoRole {
  return Boolean(value && value in demoRoleLabels);
}
