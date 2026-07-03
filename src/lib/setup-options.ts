import type { EmployeeType, MetricType, RoleBehavior, RoleCategory } from "@prisma/client";

export const employeeTypeOptions: Array<{ value: EmployeeType; label: string }> = [
  { value: "WORKDAY_EMPLOYEE", label: "Workday Employee" },
  { value: "LOCAL_HIRE", label: "Local Hire" },
  { value: "NON_EMPLOYEE", label: "Non-Employee" }
];

export const roleCategoryOptions: Array<{ value: RoleCategory; label: string }> = [
  { value: "DIRECT_SELLER", label: "Direct Seller" },
  { value: "LPS_FARM_GATE_SELLER", label: "LPS / Farm Gate Seller" },
  { value: "OVERLAY_SELLER", label: "Overlay Seller" },
  { value: "MANAGER_ROLLUP", label: "Manager Roll-up" },
  { value: "FUTURE_ROLE", label: "Future Role" }
];

export const roleBehaviorOptions: Array<{ value: RoleBehavior; label: string }> = [
  { value: "SPLIT", label: "Split" },
  { value: "SPLIT_WITH_LIMIT", label: "Split With Limit" },
  { value: "ADDITIVE", label: "Additive" },
  { value: "ROLLUP", label: "Roll-up" },
  { value: "CONFIGURABLE", label: "Configurable" }
];

export const metricTypeOptions: Array<{ value: MetricType; label: string }> = [
  { value: "QUANTITY", label: "Quantity" },
  { value: "AMOUNT", label: "Amount" },
  { value: "BOTH", label: "Both" }
];

export function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDate(value: Date | null) {
  if (!value) {
    return "Open";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(value);
}

