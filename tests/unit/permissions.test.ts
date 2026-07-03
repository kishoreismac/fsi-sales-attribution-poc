import { describe, expect, it } from "vitest";
import { getPermissionsForRole, hasPermission, isDemoRole } from "@/lib/auth/permissions";

describe("demo role permissions", () => {
  it("allows admins to create assignments and export approved assignments", () => {
    expect(hasPermission("SALES_COMP_ADMIN", "assignments:create")).toBe(true);
    expect(hasPermission("SALES_COMP_ADMIN", "exports:approvedAssignments")).toBe(true);
  });

  it("allows managers to approve but not edit setup data", () => {
    expect(hasPermission("SALES_MANAGER", "assignments:approve")).toBe(true);
    expect(hasPermission("SALES_MANAGER", "sellers:manage")).toBe(false);
  });

  it("keeps seller permissions read-only for the assignment area", () => {
    expect(getPermissionsForRole("SELLER")).toEqual(["dashboard:view", "assignments:view"]);
  });

  it("rejects unknown demo role cookie values", () => {
    expect(isDemoRole("SALES_MANAGER")).toBe(true);
    expect(isDemoRole("OWNER")).toBe(false);
    expect(isDemoRole(undefined)).toBe(false);
  });
});

