"use client";

import { CircleDot, Menu, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DemoRoleSwitcher } from "@/components/demo-role-switcher";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { UiComparisonToggle } from "@/components/ui-comparison-toggle";
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
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCollapseTimer() {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
  }

  function expandSidebar() {
    clearCollapseTimer();
    setCollapsed(false);
  }

  function scheduleCollapse() {
    clearCollapseTimer();
    collapseTimer.current = setTimeout(() => {
      setCollapsed(true);
    }, 1800);
  }

  useEffect(() => {
    return clearCollapseTimer;
  }, []);

  return (
    <div className={cn("ui-shell min-h-screen lg:grid", collapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[304px_1fr]")}>
      <aside
        className="ui-sidebar border-b border-border bg-surface/96 shadow-[0_1px_0_hsl(var(--border))] backdrop-blur-xl transition-[width] duration-200 lg:sticky lg:top-0 lg:min-h-screen lg:border-b-0 lg:border-r lg:shadow-none"
        onMouseEnter={expandSidebar}
        onMouseLeave={scheduleCollapse}
        onFocus={expandSidebar}
        onBlur={scheduleCollapse}
      >
        <div className={cn("flex h-20 items-center gap-3 border-b border-border px-5", collapsed && "lg:justify-center lg:px-3")}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-panel">
            FSI
          </div>
          <div className={cn("min-w-0", collapsed && "lg:sr-only")}>
            <p className="text-sm font-semibold text-foreground">Sales Attribution</p>
            <p className="truncate text-xs text-muted-foreground">Credit operations workspace</p>
          </div>
        </div>
        <SidebarNav role={role} collapsed={collapsed} />
        <div className={cn(collapsed && "lg:hidden")}>
          <DemoRoleSwitcher currentRole={role} />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="ui-topbar sticky top-0 z-10 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground shadow-sm lg:hidden">
              <Menu size={18} aria-hidden="true" />
            </div>
            <div className="hidden h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-primary shadow-sm sm:flex">
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Workspace</p>
              <p className="text-sm font-semibold">Credit operations control center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold shadow-sm md:flex">
              <CircleDot size={14} className="text-primary" aria-hidden="true" />
              <span className="text-muted-foreground">Role</span>
              <span>{label}</span>
            </div>
            <div className="hidden rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm lg:block">
              Demo environment
            </div>
            <UiComparisonToggle />
            <ThemeToggle />
          </div>
        </header>
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
