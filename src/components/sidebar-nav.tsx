"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hasPermission, type DemoRole } from "@/lib/auth/permissions";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SidebarNav({ role, collapsed = false }: { role: DemoRole; collapsed?: boolean }) {
  const pathname = usePathname();
  const visibleItems = navigationItems.filter((item) => hasPermission(role, item.permission));
  const groups = [
    {
      label: "Workspace",
      items: visibleItems.filter((item) =>
        ["/", "/assignments", "/validator", "/approvals", "/credit-preview"].includes(item.href)
      )
    },
    {
      label: "Setup",
      items: visibleItems.filter((item) => ["/sellers", "/roles", "/customers-products"].includes(item.href))
    },
    {
      label: "Governance",
      items: visibleItems.filter((item) => ["/history", "/exports"].includes(item.href))
    }
  ].filter((group) => group.items.length > 0);

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 py-4 lg:block lg:space-y-5" aria-label="Main navigation">
      {groups.map((group) => (
        <div key={group.label} className="contents lg:block">
          <p className={cn("ui-original-nav-label mb-2 px-3 text-[11px] font-bold uppercase text-muted-foreground", collapsed && "lg:sr-only")}>
            {group.label}
          </p>
          <div className="flex gap-1 lg:block lg:space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
              "ui-nav-link inline-flex min-h-10 shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground lg:flex",
              "transition hover:bg-muted hover:text-foreground hover:shadow-sm",
              collapsed && "lg:justify-center lg:px-2",
              isActive && "border border-primary/20 bg-primary/10 text-primary shadow-sm"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className={cn(collapsed && "lg:sr-only")}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
