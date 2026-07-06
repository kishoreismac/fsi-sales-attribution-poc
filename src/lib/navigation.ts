import {
  BarChart3,
  ClipboardCheck,
  Database,
  FileDown,
  GitPullRequestArrow,
  History,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  Split,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import type { Permission } from "@/lib/auth/permissions";

type NavigationItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  permission: Permission;
};

export const navigationItems: NavigationItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
  { href: "/sellers", label: "Sellers", icon: Users, permission: "sellers:manage" },
  { href: "/roles", label: "Roles", icon: ShieldCheck, permission: "roles:manage" },
  { href: "/customers-products", label: "Customers & Products", icon: Database, permission: "customersProducts:manage" },
  { href: "/assignments", label: "Assignments", icon: GitPullRequestArrow, permission: "assignments:view" },
  { href: "/validator", label: "Split Validator", icon: Split, permission: "validator:view" },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck, permission: "assignments:approve" },
  { href: "/credit-preview", label: "Credit Preview", icon: BarChart3, permission: "creditPreview:view" },
  { href: "/payments", label: "Payments", icon: ReceiptText, permission: "payments:process" },
  { href: "/history", label: "History", icon: History, permission: "audit:view" },
  { href: "/exports", label: "Exports", icon: FileDown, permission: "exports:approvedAssignments" }
];
