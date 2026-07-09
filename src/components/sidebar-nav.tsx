"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hasPermission, type DemoRole } from "@/lib/auth/permissions";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SidebarNav({ role, collapsed = false }: { role: DemoRole; collapsed?: boolean }) {
  const pathname = usePathname();
  const visibleItems = navigationItems.filter((item) => hasPermission(role, item.permission));

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 py-4 lg:block lg:space-y-1.5" aria-label="Main navigation">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground lg:flex",
              "transition hover:bg-muted hover:text-foreground",
              collapsed && "lg:justify-center lg:px-2",
              isActive && "border border-primary/25 bg-primary/10 text-primary shadow-sm"
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon size={18} aria-hidden="true" />
            <span className={cn(collapsed && "lg:sr-only")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
