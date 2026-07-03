import { AppShellClient } from "@/components/app-shell-client";
import { getDemoSession } from "@/lib/auth/session";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getDemoSession();

  return <AppShellClient role={session.role} label={session.label}>{children}</AppShellClient>;
}
