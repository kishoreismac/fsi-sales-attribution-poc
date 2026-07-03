import { prisma } from "@/lib/db";

export function listAuditEvents() {
  return prisma.auditLog.findMany({
    include: {
      actor: true
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  });
}

