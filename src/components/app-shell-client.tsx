"use client";

import { Pin, PinOff, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [pinned, setPinned] = useState(true);
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
    if (pinned) {
      return;
    }

    clearCollapseTimer();
    collapseTimer.current = setTimeout(() => {
      setCollapsed(true);
    }, 1800);
  }

  useEffect(() => {
    const savedPinned = window.localStorage.getItem("fsi-sidebar-pinned");
    if (savedPinned === "false") {
      setPinned(false);
      setCollapsed(true);
    }

    return clearCollapseTimer;
  }, []);

  function togglePinned() {
    const nextPinned = !pinned;
    setPinned(nextPinned);
    window.localStorage.setItem("fsi-sidebar-pinned", String(nextPinned));

    if (nextPinned) {
      clearCollapseTimer();
      setCollapsed(false);
    } else {
      clearCollapseTimer();
      collapseTimer.current = setTimeout(() => {
        setCollapsed(true);
      }, 1800);
    }
  }

  const PinIcon = pinned ? PinOff : Pin;

  return (
    <div className={cn("min-h-screen lg:grid", collapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[284px_1fr]")}>
      <aside
        className="border-b border-border bg-surface transition-[width] duration-200 lg:min-h-screen lg:border-b-0 lg:border-r"
        onMouseEnter={expandSidebar}
        onMouseLeave={scheduleCollapse}
        onFocus={expandSidebar}
        onBlur={scheduleCollapse}
      >
        <div className={cn("flex h-16 items-center justify-between gap-3 border-b border-border px-5", collapsed && "lg:justify-center lg:px-3")}>
          <div className={cn(collapsed && "lg:sr-only")}>
            <p className="text-sm font-semibold text-foreground">FSI POC</p>
            <p className="text-xs text-muted-foreground">Sales attribution foundation</p>
          </div>
          {collapsed ? <p className="hidden text-sm font-semibold text-primary lg:block">FSI</p> : null}
          <button
            type="button"
            onClick={togglePinned}
            className={cn(
              "hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-white text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground lg:inline-flex",
              collapsed && "lg:hidden"
            )}
            aria-label={pinned ? "Unpin sidebar" : "Pin sidebar open"}
            title={pinned ? "Unpin Sidebar" : "Pin Sidebar"}
          >
            <PinIcon size={16} aria-hidden="true" />
          </button>
        </div>
        <SidebarNav role={role} collapsed={collapsed} />
        <div className={cn(collapsed && "lg:hidden")}>
          <DemoRoleSwitcher currentRole={role} />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="hidden h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-primary shadow-sm sm:flex">
              <ShieldCheck size={18} aria-hidden="true" />
            </div>
            <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Role</p>
            <p className="text-sm font-semibold">{label}</p>
            </div>
          </div>
          <ThemeToggle />
        </header>
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
