"use server";

import { requirePermission } from "@/lib/auth/session";

export async function exportApprovedAssignments() {
  await requirePermission("exports:approvedAssignments");
}

