"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DemoRoleSwitcher } from "@/components/demo-role-switcher";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import type { DemoRole } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";

export function AppShellClient({
  role,
  label,
  children
}: {
  role: DemoRole;
  label: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn("min-h-screen lg:grid", collapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[280px_1fr]")}>
      <aside className="border-b border-border bg-white lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className={cn("flex h-16 items-center border-b border-border px-5", collapsed && "lg:justify-center lg:px-3")}>
          <div className={cn(collapsed && "lg:sr-only")}>
            <p className="text-sm font-semibold text-primary">FSI POC</p>
            <p className="text-xs text-muted-foreground">Sales attribution foundation</p>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className={cn("ml-auto hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-white lg:inline-flex", collapsed && "lg:ml-0")}
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            title={collapsed ? "Expand menu" : "Collapse menu"}
          >
            {collapsed ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}
          </button>
        </div>
        <SidebarNav role={role} collapsed={collapsed} />
        <div className={cn(collapsed && "lg:hidden")}>
          <DemoRoleSwitcher currentRole={role} />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current role</p>
            <p className="text-sm font-semibold">{label}</p>
          </div>
          <ThemeToggle />
        </header>
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
